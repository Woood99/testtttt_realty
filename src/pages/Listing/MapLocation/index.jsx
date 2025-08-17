import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import styles from './MapLocation.module.scss';
import { fetchScriptMap } from '../../../helpers/fetchScript';
import { IconCloseCircle, IconFinger, IconMinus, IconPlus, IconTrash } from '../../../ui/Icons';
import { colorLineBlue, colorLinePaint, colorLineRed, stylesMapDefault } from '../../../unifComponents/ymap/ymapStyles';
import paintOnMap from '../../../helpers/paintOnMap';
import { getMapBuildings } from '../../../api/getMapBuildings';
import isEmptyArrObj from '../../../helpers/isEmptyArrObj';
import { handleZoomIn, handleZoomOut } from '../../../unifComponents/ymap/YmapZoom';
import isPointInPolygon from '../../../helpers/isPointInPolygon';
import Button from '../../../uiForm/Button';
import { setMapLocationCoordinates, setVisiblePlacemarks } from '../../../redux/slices/listingSlice';
import { SpinnerForBtn } from '../../../ui/Spinner';
import { sendPostRequest } from '../../../api/requestsApi';
import calculateCenter from '../../../unifComponents/ymap/calculateCenter';
import { getCurrentCityNameSelector, getIsDesktop } from '@/redux';

let COORDINATES = [];
let drawingsCollection = {};

export const mapLocationListingClear = () => {
   COORDINATES = [];
   drawingsCollection.removeAll?.();
};

const MapLocation = ({ setModal }) => {
   const dispatch = useDispatch();

   const isDesktop = useSelector(getIsDesktop);
   const currentCity = useSelector(getCurrentCityNameSelector);
   const resultFilters = useSelector(state => state.listing.resultFilters);

   const listingSelector = useSelector(state => state.listing);

   const [isLoaded, setIsLoaded] = useState(false);
   const [map, setMap] = useState(null);

   const mapRef = useRef(null);
   let isPaint = false;
   const [isPaintState, setIsPaintState] = useState(false);

   const [paintMore, setPaintMore] = useState(false);
   const [responseData, setResponseData] = useState({});
   const paintBtnRef = useRef(null);

   const [totalBuildings, setTotalBuildings] = useState(null);

   const [visibleBuildingId, setVisibleBuildingId] = useState([]);

   const [isLoading, setIsLoading] = useState(true);

   useEffect(() => {
      const res = fetchScriptMap();
      if (res) {
         res.then(() => {
            setIsLoaded(true);
         });
      } else {
         setIsLoaded(true);
      }
   }, []);

   useEffect(() => {
      if (listingSelector.mapLocationCoordinates.length === 0) {
         if (!isEmptyArrObj(drawingsCollection)) {
            // paintBtnClearHandler();
         }
      }
   }, [listingSelector.mapLocationCoordinates]);

   useEffect(() => {
      if (!currentCity) return;
      const fetchMapBuildings = async () => {
         try {
            const response = await getMapBuildings(currentCity);
            setResponseData(response);
         } catch (error) {}
      };

      fetchMapBuildings();
   }, [currentCity]);

   useEffect(() => {
      if (!visibleBuildingId) return;
      if (!currentCity) return;
      if (isEmptyArrObj(resultFilters)) return;
      setIsLoading(true);
      const params = {
         ...resultFilters,
         ...(COORDINATES.length > 0 ? { visibleObjects: [...visibleBuildingId] } : {}),
         city: currentCity,
         sort: listingSelector.sortBy,
      };

      if (params.visibleObjects && params.visibleObjects.length === 0) {
         params.visibleObjects = null;
      }
      sendPostRequest('/api/catalog/geo', params).then(res => {
         setIsLoading(false);
         setTotalBuildings(res.data.placemarks.length);
      });
   }, [visibleBuildingId, currentCity, resultFilters]);

   const createMap = () => {
      try {
         ymaps.ready(initMap);
      } catch (error) {}
   };

   useEffect(() => {
      if (isLoaded && !isEmptyArrObj(responseData) && !map) {
         createMap();
      }
   }, [isLoaded, map, responseData]);

   const updateBuildingPolygon = placemarks => {
      const newPlacemarks = [];

      placemarks.forEach(item => {
         if (isPointInPolygon(item.coordinates, COORDINATES.flat(1))) {
            newPlacemarks.push(item);
         }
      });
      setVisibleBuildingId(newPlacemarks.map(item => item.id));
   };

   function initMap() {
      paintOnMap();
      ymaps.ready(['ext.paintOnMap']).then(function () {
         const myMap = new ymaps.Map('customMap2', {
            center: responseData.coordinates,
            zoom: 12,
            controls: [],
         });
         setMap(myMap);

         let paintProcess;

         drawingsCollection = new ymaps.GeoObjectCollection();

         myMap.geoObjects.add(drawingsCollection);

         paintBtnRef.current.addEventListener('click', () => {
            isPaint = !isPaint;
            setIsPaintState(prev => !prev);
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
               let deleteBtn;
               isPaint = false;
               setIsPaintState(false);

               let coordinates = paintProcess.finishPaintingAt(e);
               dispatch(setMapLocationCoordinates([...COORDINATES, coordinates]));
               COORDINATES.push(coordinates);

               paintProcess = null;

               let geoObject = new ymaps.Polygon([coordinates], {}, colorLinePaint);

               geoObject.myCoordinates = coordinates;

               geoObject.events
                  .add('mouseenter', e => {
                     e.get('target').options.set(colorLineRed);

                     const coords = e.get('target').myCoordinates;

                     const customIconLayout = ymaps.templateLayoutFactory.createClass(
                        `
                           <button class="ymap-action ymap-action-btn !w-[32px] !h-[32px] -translate-x-4 -translate-y-4">
                           <svg width="14" height="14" viewBox="0 0 512 512" xml:space="preserve"><g><path d="M490.667,96c0-17.673-14.327-32-32-32h-80.555C364.632,25.757,328.549,0.13,288,0h-64   c-40.549,0.13-76.632,25.757-90.112,64H53.333c-17.673,0-32,14.327-32,32l0,0c0,17.673,14.327,32,32,32H64v266.667   C64,459.468,116.532,512,181.333,512h149.333C395.468,512,448,459.468,448,394.667V128h10.667   C476.34,128,490.667,113.673,490.667,96z M384,394.667C384,424.122,360.122,448,330.667,448H181.333   C151.878,448,128,424.122,128,394.667V128h256V394.667z"></path><path d="M202.667,384c17.673,0,32-14.327,32-32V224c0-17.673-14.327-32-32-32s-32,14.327-32,32v128   C170.667,369.673,184.994,384,202.667,384z"></path><path d="M309.333,384c17.673,0,32-14.327,32-32V224c0-17.673-14.327-32-32-32s-32,14.327-32,32v128   C277.333,369.673,291.66,384,309.333,384z"></path></g></svg>
                           </button>
                        `
                     );

                     deleteBtn = new ymaps.Placemark(
                        calculateCenter(coords),
                        {},
                        {
                           iconLayout: customIconLayout, // Используем кастомный макет
                        }
                     );
                     myMap.geoObjects.add(deleteBtn);
                  })
                  .add('mouseleave', e => {
                     e.get('target').options.set(colorLineBlue);
                     myMap.geoObjects.remove(deleteBtn);
                  })
                  .add('click', async e => {
                     let target = e.get('target');
                     dispatch(setMapLocationCoordinates(COORDINATES.filter(el => el !== target.myCoordinates)));
                     COORDINATES = COORDINATES.filter(el => el !== target.myCoordinates);

                     drawingsCollection.remove(target);
                     if (deleteBtn) {
                        myMap.geoObjects.remove(deleteBtn);
                     }
                     updateBuildingPolygon(responseData.placemarks);

                     if (!drawingsCollection.getLength()) {
                        setPaintMore(false);
                     }
                  });
               drawingsCollection.add(geoObject);
               setPaintMore(true);
               updateBuildingPolygon(responseData.placemarks);
            } else {
               isPaint = false;
            }
         });
      });
   }

   const paintBtnClearHandler = () => {
      dispatch(setMapLocationCoordinates([]));
      isPaint = false;
      mapLocationListingClear();
      updateBuildingPolygon(responseData.placemarks);
      setPaintMore(false);
   };

   const onClickGoHandle = () => {
      dispatch(setVisiblePlacemarks(visibleBuildingId));
      setModal(false);
   };

   return (
      <div className={styles.MapLocationRoot}>
         <div className="absolute top-5 right-[80px] title-4">{currentCity}</div>
         <div className="relative w-full h-full">
            <div ref={mapRef} id="customMap2" className="remove-copyrights-pane" style={stylesMapDefault}></div>
            {isLoaded && (
               <>
                  <div className="ymap-actions top-4 right-4 ymap-actions-group !w-auto items-end">
                     {paintMore ? (
                        <>
                           <button
                              className={`ymap-action ymap-action-btn !w-auto font-medium gap-1 px-3 ${isPaintState ? '!w-auto px-4 gap-2' : ''}`}>
                              {isPaintState ? (
                                 <>
                                    <IconFinger width={24} height={24} />
                                    Начните рисовать
                                    <IconCloseCircle className="!text-primary400 opacity-80" />
                                 </>
                              ) : (
                                 <>
                                    <IconPlus className="stroke-black" width={15} height={15} />
                                    <span>Добавить ещё область</span>
                                 </>
                              )}
                           </button>
                           <button onClick={paintBtnClearHandler} className="ymap-action ymap-action-btn !w-auto font-medium gap-1 px-3">
                              <IconTrash width={15} height={15} />
                           </button>
                        </>
                     ) : (
                        <>
                           <button ref={paintBtnRef} className={`ymap-action ymap-action-btn ${isPaintState ? '!w-auto px-4 gap-2' : ''}`}>
                              <IconFinger width={24} height={24} />
                              {isPaintState && (
                                 <>
                                    Начните рисовать
                                    <IconCloseCircle className="!text-primary400 opacity-80" />
                                 </>
                              )}
                           </button>
                        </>
                     )}
                  </div>
                  {isDesktop && (
                     <div className="ymap-actions ymap-top-right-center ymap-actions-group ymap-actions-group-join">
                        <button onClick={() => handleZoomIn(map)} className="ymap-action">
                           <IconPlus className="stroke-black" />
                        </button>
                        <button onClick={() => handleZoomOut(map)} className="ymap-action">
                           <IconMinus />
                        </button>
                     </div>
                  )}
               </>
            )}
            {totalBuildings !== null && (
               <Button size="Small" onClick={onClickGoHandle} className={`${styles.MapLocationGo} min-w-[220px]`}>
                  {isLoading ? <SpinnerForBtn size={16} variant="second" /> : <>Показать {totalBuildings} новостроек</>}
               </Button>
            )}
         </div>
      </div>
   );
};

export default MapLocation;


