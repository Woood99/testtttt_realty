import React, { useEffect, useRef, useState } from 'react';
import { fullscrenEnterClasses, fullscrenExitClasses, toggleFullscreen } from '../../unifComponents/ymap/YmapFullscreen';
import { handleZoomIn, handleZoomOut } from '../../unifComponents/ymap/YmapZoom';
import { IconFinger, IconFullscreen, IconMinus, IconPlus, IconTrash } from '../../ui/Icons';
import paintOnMap from '../../helpers/paintOnMap';
import { colorLineBlue, colorLinePaint, colorLineRed } from '../../unifComponents/ymap/ymapStyles';

let COORDINATES = [];

let drawingsCollection = {};

const PurchaseCreateMap = ({ center = [], coordinates = [], setCoordinates }) => {
   const mapRef = useRef(null);

   const actionsContainerRef = useRef(null);

   const [paintMore, setPaintMore] = useState(false);
   const paintBtnRef = useRef(null);
   let isPaint = false;

   useEffect(() => {
      COORDINATES = coordinates;
   }, []);

   const updateCoordinates = () => {
      setCoordinates([...COORDINATES]);
   };

   const paintBtnClearHandler = () => {
      COORDINATES = [];
      isPaint = false;
      drawingsCollection.removeAll();
      setPaintMore(false);
      updateCoordinates();
   };

   const createMap = () => {
      paintOnMap();
      
      const map = ymaps.ready(['ext.paintOnMap']).then(function () {
         const myMap = new window.ymaps.Map('customMap', {
            center: center || [],
            zoom: 11,
            controls: [],
         });
         let paintProcess;

         drawingsCollection = new ymaps.GeoObjectCollection();

         myMap.geoObjects.add(drawingsCollection);

         if (COORDINATES.length > 0) {
            for (let i = 0; i < COORDINATES.length; i++) {
               let polygon = new ymaps.Polygon([COORDINATES[i]], {}, colorLinePaint);
               polygon.myCoordinates = COORDINATES[i];
               drawingsCollection.add(polygon);

               polygon.events
                  .add('mouseenter', function () {
                     polygon.options.set(colorLineRed);
                  })
                  .add('mouseleave', function () {
                     polygon.options.set(colorLineBlue);
                  })
                  .add('click', function (e) {
                     let target = e.get('target');
                     COORDINATES = COORDINATES.filter(el => el !== target.myCoordinates);
                     drawingsCollection.remove(target);
                     updateCoordinates();

                     if (!drawingsCollection.getLength()) {
                        setPaintMore(false);
                     }
                  });
               updateCoordinates();
            }
         }

         paintBtnRef.current.addEventListener('click', () => {
            isPaint = !isPaint;
            if (isPaint) {
               if (paintBtnRef.current) paintBtnRef.current.classList.add('ymap-action-active');
            } else {
               if (paintBtnRef.current) paintBtnRef.current.classList.remove('ymap-action-active');
            }
         });

         myMap.events.add('mousedown', function (e) {
            if (isPaint) {
               paintProcess = ymaps.ext.paintOnMap(myMap, e, { style: colorLinePaint });
            }
         });

         myMap.events.add('mouseup', function (e) {
            if (paintProcess) {
               isPaint = false;

               let coordinates = paintProcess.finishPaintingAt(e);

               COORDINATES.push(coordinates);
               paintProcess = null;

               let geoObject = new ymaps.Polygon([coordinates], {}, colorLinePaint);

               geoObject.myCoordinates = coordinates;

               geoObject.events
                  .add('mouseenter', e => e.get('target').options.set(colorLineRed))
                  .add('mouseleave', e => e.get('target').options.set(colorLineBlue))
                  .add('click', async e => {
                     let target = e.get('target');
                     COORDINATES = COORDINATES.filter(el => el !== target.myCoordinates);
                     drawingsCollection.remove(target);
                     updateCoordinates();

                     if (!drawingsCollection.getLength()) {
                        setPaintMore(false);
                     }
                  });
               drawingsCollection.add(geoObject);
               setPaintMore(true);
               updateCoordinates();
            } else {
               isPaint = false;
            }
         });

         fullscrenEnterClasses(myMap, actionsContainerRef);
         fullscrenExitClasses(myMap, actionsContainerRef);

         return myMap;
      });
      return map;
   };
   
   useEffect(() => {
      if (!window.ymaps || center?.length === 0) return;
      
      window.ymaps.ready(() => {
         if (!mapRef.current) {
            createMap().then(res => {
               mapRef.current = res;
            });
         } else if (center) {
            paintBtnClearHandler();
            mapRef.current.setCenter(center);
         }
      });
   }, [center]);

   return (
      <div id="customMap" className="mt-6 remove-copyrights-pane relative w-full h-[320px] rounded-xl overflow-hidden">
         {mapRef && (
            <div className="ymap-actions-container" ref={actionsContainerRef}>
               <div className="ymap-actions ymap-actions-group ymap-action-right-top">
                  <button type="button" onClick={() => toggleFullscreen(mapRef.current, actionsContainerRef)} className="ymap-action ymap-action-btn">
                     <IconFullscreen />
                  </button>
               </div>
               <div className="ymap-actions ymap-top-right-center ymap-actions-group ymap-actions-group-join">
                  <button type="button" onClick={() => handleZoomIn(mapRef.current)} className="ymap-action">
                     <IconPlus className="stroke-black" />
                  </button>
                  <button type="button" onClick={() => handleZoomOut(mapRef.current)} className="ymap-action">
                     <IconMinus />
                  </button>
               </div>
               <div className="ymap-actions bottom-4 right-4 ymap-actions-group !w-auto items-end">
                  {paintMore ? (
                     <>
                        <button type="button" className="ymap-action ymap-action-btn !w-auto font-medium gap-1 px-3">
                           <IconPlus className="stroke-black" width={15} height={15} />
                           <span>Ещё</span>
                        </button>
                        <button type="button" onClick={paintBtnClearHandler} className="ymap-action ymap-action-btn !w-auto font-medium gap-1 px-3">
                           <IconTrash width={15} height={15} />
                        </button>
                     </>
                  ) : (
                     <>
                        <button type="button" ref={paintBtnRef} className="ymap-action ymap-action-btn">
                           <IconFinger />
                        </button>
                     </>
                  )}
               </div>
            </div>
         )}
      </div>
   );
};

export default PurchaseCreateMap;
