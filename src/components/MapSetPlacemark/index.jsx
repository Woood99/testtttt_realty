import React, { useEffect, useRef, useState } from 'react';
import fetchScript from '../../helpers/fetchScript';
import { fullscrenEnterClasses, fullscrenExitClasses, toggleFullscreen } from '../../unifComponents/ymap/YmapFullscreen';
import { IconFullscreen, IconMinus, IconPlus } from '../../ui/Icons';
import { handleZoomIn, handleZoomOut } from '../../unifComponents/ymap/YmapZoom';
import { YMAPS_API } from '../../constants/api';

const MapSetPlacemark = ({ data, setData, zoom = 12 }) => {
   const [isLoaded, setIsLoaded] = useState(false);
   const [map, setMap] = useState(null);

   let placemark = null;
   const actionsContainerRef = useRef(null);

   useEffect(() => {
      fetchScript(YMAPS_API).then(() => setIsLoaded(true));
   }, []);

   const createMap = () => {
      try {
         ymaps.ready(() => {
            const myMap = new ymaps.Map('customMap', {
               center: data.length ? data : [55.7558, 37.6176],
               zoom: zoom,
               controls: [],
            });

            fullscrenEnterClasses(myMap, actionsContainerRef);
            fullscrenExitClasses(myMap, actionsContainerRef);

            setMap(myMap);

            if (data.length > 0) {
               updatePlacemark(myMap, data);
            } else {
               myMap.events.add('click', e => {
                  const newCoordinates = e.get('coords');
                  updatePlacemark(myMap, newCoordinates);
                  setData(newCoordinates);
               });
            }
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

   const updatePlacemark = (map, coords) => {
      if (!map) return;
      if (placemark) {
         placemark.geometry.setCoordinates(coords);
         map.panTo(coords, {
            delay: 500,
            timingFunction: 'ease-in-out',
         });
      } else {
         const newPlacemark = new ymaps.Placemark(
            coords,
            {},
            {
               draggable: true,
            }
         );

         map.geoObjects.add(newPlacemark);
         placemark = newPlacemark;

         newPlacemark.events.add('dragend', e => {
            const newCoordinates = newPlacemark.geometry.getCoordinates();
            setData(newCoordinates);
            map.panTo(newCoordinates, {
               delay: 500,
               timingFunction: 'ease-in-out',
            });
         });
      }
   };

   return (
      <div id="customMap" className="remove-copyrights-pane relative w-full h-[650px] rounded-xl overflow-hidden">
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
   );
};

export default MapSetPlacemark;
