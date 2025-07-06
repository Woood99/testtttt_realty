import React, { useContext, useEffect, useRef, useState } from 'react';
import { PurchasePageContext } from '../../context';
import fetchScript from '../../helpers/fetchScript';
import { YMAPS_API } from '../../constants/api';
import { IconFullscreen, IconMinus, IconPlus } from '../../ui/Icons';
import { handleZoomIn, handleZoomOut } from '../../unifComponents/ymap/YmapZoom';
import { fullscrenEnterClasses, fullscrenExitClasses, toggleFullscreen } from '../../unifComponents/ymap/YmapFullscreen';
import paintOnMap from '../../helpers/paintOnMap';
import { colorLinePaint } from '../../unifComponents/ymap/ymapStyles';
import { Chars } from '../../ui/Chars';
import { useSelector } from 'react-redux';
import { getIsDesktop } from '../../redux/helpers/selectors';

const PurchaseRequestMap = () => {
   const { data } = useContext(PurchasePageContext);
   const { search_area, neighboring_areas } = data;

   const [isLoaded, setIsLoaded] = useState(false);
   const [map, setMap] = useState(null);
   const actionsContainerRef = useRef(null);
   const isDesktop = useSelector(getIsDesktop);

   useEffect(() => {
      fetchScript(YMAPS_API).then(() => setIsLoaded(true));
   }, []);

   const createMap = () => {
      try {
         paintOnMap();
         ymaps.ready(['ext.paintOnMap']).then(function () {
            const coordinatesFlat = search_area.reduce((acc, current) => (current.length > acc.length ? current : acc));
            const latitudeAverage = coordinatesFlat.reduce((acc, current) => acc + current[0], 0) / coordinatesFlat.length;
            const longitudeAverage = coordinatesFlat.reduce((acc, current) => acc + current[1], 0) / coordinatesFlat.length;

            const myMap = new ymaps.Map('customMap', {
               center: [latitudeAverage, longitudeAverage] || [],
               zoom: 12,
               controls: [],
            });
            const drawingsCollection = new ymaps.GeoObjectCollection();

            myMap.geoObjects.add(drawingsCollection);

            if (search_area.length > 0) {
               for (let i = 0; i < search_area.length; i++) {
                  let polygon = new ymaps.Polygon([search_area[i]], {}, colorLinePaint);
                  polygon.myCoordinates = search_area[i];
                  drawingsCollection.add(polygon);
               }
            }

            setMap(myMap);
            fullscrenEnterClasses(myMap, actionsContainerRef);
            fullscrenExitClasses(myMap, actionsContainerRef);
         });
      } catch (error) {
         console.log('error is', error);
      }
   };

   useEffect(() => {
      if (isLoaded && !map) {
         createMap();
      }
   }, [isLoaded, map]);

   return (
      <section>
         <div className="mt-8 overflow-hidden">
            <h2 className="title-2 mb-4">Расположение поиска</h2>
            <div id="customMap" className="mt-6 remove-copyrights-pane relative w-full h-[284px] md1:h-[350px] rounded-xl overflow-hidden">
               {isLoaded && map && (
                  <div className="ymap-actions-container" ref={actionsContainerRef}>
                     <div className="ymap-actions ymap-actions-group ymap-action-right-top">
                        <button type="button" onClick={() => toggleFullscreen(map, actionsContainerRef)} className="ymap-action ymap-action-btn">
                           <IconFullscreen />
                        </button>
                     </div>
                     <div className="ymap-actions ymap-top-right-center ymap-actions-group ymap-actions-group-join">
                        <button type="button" onClick={() => handleZoomIn(map)} className="ymap-action">
                           <IconPlus className="stroke-black" />
                        </button>
                        <button type="button" onClick={() => handleZoomOut(map)} className="ymap-action">
                           <IconMinus />
                        </button>
                     </div>
                  </div>
               )}
            </div>
            <Chars className="mt-4" justifyBetween={!isDesktop}>
               <span className="whitespace-nowrap">Можно предлагать соседние районы</span>
               <span>{neighboring_areas ? 'Да' : 'Нет'}</span>
            </Chars>
         </div>
      </section>
   );
};

export default PurchaseRequestMap;
