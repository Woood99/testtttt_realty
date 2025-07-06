import React, { useState, useEffect, useRef, useCallback } from 'react';
import ReactDOM from 'react-dom/client';
import debounce from 'lodash.debounce';
import isEqual from 'lodash.isequal';
import axios from 'axios';

import stylesPlacemark from '../../components/MapPlacemarks/MapPlacemarks.module.scss';

import { useDispatch, useSelector } from 'react-redux';
import { setMapInit, setMapPlacemarks, setVisiblePlacemarks } from '../../redux/slices/listingSlice';
import { fetchScriptMap } from '../../helpers/fetchScript';
import { BASE_URL } from '../../constants/api';
import isEmptyArrObj from '../../helpers/isEmptyArrObj';
import { RoutesPath } from '../../constants/RoutesPath';
import { IconCloseCircle, IconFinger, IconFullscreen, IconMinus, IconPlus, IconTrash } from '../../ui/Icons';
import paintOnMap from '../../helpers/paintOnMap';
import isPointInPolygon from '../../helpers/isPointInPolygon';
import { Notification } from '../../ui/Tooltip';

import { stylesMapDefault, colorLineRed, colorLineBlue, colorLinePaint } from '../../unifComponents/ymap/ymapStyles';
import { handleZoomIn, handleZoomOut } from '../../unifComponents/ymap/YmapZoom';
import { fullscrenEnterClasses, fullscrenExitClasses, toggleFullscreen } from '../../unifComponents/ymap/YmapFullscreen';
import { BalloonCard } from '../../components/MapPlacemarks/BalloonCard';
import visibleCirclePlacemark from '../../components/MapPlacemarks/visibleCirclePlacemark';
import visiblePricePlacemark from '../../components/MapPlacemarks/visiblePricePlacemark';
import calculateCenter from '../../unifComponents/ymap/calculateCenter';
import { sendPostRequest } from '../../api/requestsApi';
import { createPopper } from '@popperjs/core';
import { getCurrentCitySelector, getIsDesktop } from '../../redux/helpers/selectors';
import getCardsBuildings from '../../api/getCardsBuildings';
import ModalWrapper from '../../ui/Modal/ModalWrapper';
import Modal from '../../ui/Modal';
import CardPrimary from '../../ui/CardPrimary';

let COORDINATES = [];
let drawingsCollection = {};
let placemarks = [];

function ListingMap({ currentMouseEnterId, currentMouseEvent }) {
   const isDesktop = useSelector(getIsDesktop);
   const listingSelector = useSelector(state => state.listing);

   const listingFiltersSelector = useSelector(state => state.listing.resultFilters);
   const prevFiltersRef = useRef(listingFiltersSelector);

   const dispatch = useDispatch();
   const currentCity = useSelector(getCurrentCitySelector);

   const [isLoaded, setIsLoaded] = useState(false);
   const [map, setMap] = useState(null);
   const [visibleBuildingId, setVisibleBuildingId] = useState([]);

   const actionsContainerRef = useRef(null);

   const [currentTooltip, setCurrentTooltip] = useState(null);
   const [mobileModalComplex, setMobileModalComplex] = useState(null);
   let isOpenTooltip = false;

   let isPaint = false;
   const [isPaintState, setIsPaintState] = useState(false);
   const [paintMore, setPaintMore] = useState(false);

   const paintBtnRef = useRef(null);

   useEffect(() => {
      fetchData(currentTooltip);
   }, [currentTooltip]);

   const fetchData = useCallback(
      debounce(state => {
         if (!state) return;

         getDataCard(state.id).then(res => {
            renderReactComponent(state.hint, res);
         });
      }, 450),
      []
   );

   const updateBuildingPolygon = placemarks => {
      const newPlacemarks = [];

      placemarks.forEach(item => {
         if (isPointInPolygon(item.mark.geometry._coordinates, COORDINATES.flat(1))) {
            newPlacemarks.push(item);
         }
      });

      setVisibleBuildingId(newPlacemarks.map(item => item.id));
   };

   function renderReactComponent(container, data) {
      ReactDOM.createRoot(container).render(<BalloonCard data={data} />);
   }

   const mapRef = useRef(null);

   const getDataCard = async id => {
      const res = await getCardsBuildings({ visibleObjects: [id], page: 1 });
      return res?.cards?.[0];
   };

   const getBuildingDebounce = useCallback(
      debounce(state => {
         if (COORDINATES.length > 0) return;
         setVisibleBuildingId(getBuildingIds(state.myMap, state.placemarks));
      }, 400),
      []
   );

   const getBuildingIds = (myMap, placemarks) => {
      if (!myMap) return;
      const bounds = myMap.getBounds();
      const buildingIds = [];
      placemarks.forEach(function (placemark) {
         const id = placemark.mark.properties.get('id');
         const placemarkCoords = placemark.mark.geometry.getCoordinates();
         if (ymaps.util.bounds.contains(bounds, placemarkCoords)) {
            buildingIds.push(id);
         }
      });
      return buildingIds;
   };

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

   const createMap = () => {
      try {
         ymaps.ready(initMap);
      } catch (error) {}
   };

   function loadMarkersInViewport(map, placemarks = []) {
      if (!map) return;

      const bounds = map.getBounds();
      const southWest = bounds[0];
      const northEast = bounds[1];

      const visibleMarkers = placemarks.filter(item => {
         const coordinates = item.mark.geometry.getCoordinates();

         const lat = coordinates[0];
         const lng = coordinates[1];
         return lat >= southWest[0] && lat <= northEast[0] && lng >= southWest[1] && lng <= northEast[1];
      });

      placemarks.forEach(item => {
         map.geoObjects.remove(item.mark);
      });

      visibleMarkers.forEach(item => {
         map.geoObjects.add(item.mark);
         map.events.add('mousemove', e => {
            if (isOpenTooltip) {
               isOpenTooltip = false;
               const target = e.get('target');

               if (target !== item.mark) {
                  actionsContainerRef.current.querySelectorAll('[data-balloon]').forEach(item => {
                     item.remove();
                  });
               }
            }
         });
      });
   }

   function initMap() {
      paintOnMap();
      ymaps.ready(['ext.paintOnMap']).then(function () {
         const myMap = new ymaps.Map('customMap', {
            center: currentCity.geo || [],
            zoom: 12.4,
            controls: [],
         });

         fullscrenEnterClasses(myMap, actionsContainerRef, mapRef);
         fullscrenExitClasses(myMap, actionsContainerRef, mapRef);

         setMap(myMap);

         myMap.events.add('boundschange', event => {
            loadMarkersInViewport(myMap, placemarks);
            getBuildingDebounce({ myMap, placemarks });
         });

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
               isPaint = false;
               let deleteBtn;
               setIsPaintState(false);
               let coordinates = paintProcess.finishPaintingAt(e);
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
                           iconLayout: customIconLayout,
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
                     COORDINATES = COORDINATES.filter(el => el !== target.myCoordinates);
                     drawingsCollection.remove(target);
                     if (deleteBtn) {
                        myMap.geoObjects.remove(deleteBtn);
                     }
                     updateBuildingPolygon(placemarks);

                     if (!drawingsCollection.getLength()) {
                        setPaintMore(false);

                        setVisibleBuildingId(getBuildingIds(myMap, placemarks));
                     }
                  });
               drawingsCollection.add(geoObject);
               setPaintMore(true);
               updateBuildingPolygon(placemarks);
            } else {
               isPaint = false;
            }
         });
      });
   }

   useEffect(() => {
      if (!currentCity.name) return;
      if (isLoaded && !map) {
         createMap();
      }
   }, [isLoaded, map, actionsContainerRef, currentCity.name]);

   useEffect(() => {
      if (!currentCity.name) return;
      if (!map) return;
      if (isEmptyArrObj(listingFiltersSelector)) return;

      if ((!isEqual(prevFiltersRef.current, listingFiltersSelector) && !isEmptyArrObj(listingFiltersSelector)) || !listingSelector.isInitMap) {
         dispatch(setMapInit(true));
         prevFiltersRef.current = listingFiltersSelector;

         const fields = { ...listingFiltersSelector, city: currentCity.name };
         if (isEmptyArrObj(fields.visibleObjects)) {
            delete fields.visibleObjects;
         }

         sendPostRequest(`/api/catalog/geo`, fields).then(res => {
            const dataPlacemarks = res.data.placemarks;
            placemarks.forEach(item => {
               map.geoObjects.remove(item.mark);
            });

            placemarks = dataPlacemarks.map(item => {
               const mark = new ymaps.Placemark(
                  [item.coordinates[0], item.coordinates[1]],
                  {
                     id: item.id,
                     minPrice: item.minBdPrice || item.minPrice,
                     title: item.name,
                  },
                  {
                     iconLayout: ymaps.templateLayoutFactory.createClass(
                        `<div class=${stylesPlacemark.MapCircle} data-placemark-id="${item.id}"></div>`
                     ),
                     iconShape: {
                        type: 'Rectangle',
                        coordinates: [
                           [0, 0],
                           [15, 15],
                        ],
                     },
                  }
               );
               mark.events.add('mouseenter', e => {
                  if (window.innerWidth > 1212) {
                     actionsContainerRef.current.querySelectorAll('[data-balloon]').forEach(item => {
                        item.remove();
                     });

                     isOpenTooltip = true;
                     let hint = document.createElement('a');
                     hint.setAttribute('href', `${RoutesPath.building}${item.id}`);
                     hint.setAttribute('target', '_blank');
                     hint.style.position = 'absolute';
                     hint.style.paddingTop = '20px';
                     hint.style.paddingBottom = '20px';
                     hint.style.zIndex = '20001';
                     hint.style.minWidth = '450px';
                     hint.style.minHeight = '180px';
                     hint.style.pointerEvents = 'all';

                     hint.setAttribute('data-balloon', item.id);

                     actionsContainerRef.current.appendChild(hint);

                     setCurrentTooltip({ ...item, hint });

                     setTimeout(() => {
                        const interval = setInterval(() => {
                           const inner = hint.firstChild;
                           if (inner) {
                              hint.style.minWidth = `${inner.clientWidth}px`;
                              hint.style.minHeight = `${inner.clientHeight}px`;
                              hint.classList.add('show');
                              clearInterval(interval);
                           }
                        }, 100);

                        createPopper(mark.getOverlaySync().getElement().querySelector('[data-placemark-id]'), hint, {
                           placement: 'bottom',
                           modifiers: [
                              {
                                 name: 'offset',
                                 options: {
                                    offset: [0, 0],
                                 },
                              },
                           ],
                        });
                     }, 0.1);
                  }
               });

               mark.events.add('click', e => {
                  if (window.innerWidth > 1212) {
                     window.open(`${RoutesPath.building}${item.id}`, '_blank');
                  } else {
                     getDataCard(item.id).then(res => {
                        setMobileModalComplex(res);
                     });
                  }
               });
               return {
                  id: item.id,
                  mark,
               };
            });

            dispatch(setMapPlacemarks(placemarks.map(item => item.id)));

            loadMarkersInViewport(map, placemarks);

            setVisibleBuildingId(getBuildingIds(map, placemarks));
         });
      }
   }, [currentCity.name, map, listingFiltersSelector, listingSelector.isInitMap]);

   useEffect(() => {
      dispatch(setVisiblePlacemarks([...visibleBuildingId]));
   }, [visibleBuildingId]);

   const paintBtnClearHandler = () => {
      COORDINATES = [];
      isPaint = false;
      drawingsCollection.removeAll();
      setPaintMore(false);
      updateBuildingPolygon(placemarks);

      setVisibleBuildingId(getBuildingIds(map, placemarks));
   };

   useEffect(() => {
      if (!map) return;
      placemarks.forEach(item => {
         if (visibleBuildingId.includes(item.id)) {
            if (item.id === currentMouseEnterId) {
               visiblePricePlacemark(map, item);
            } else {
               if (map.getZoom() > 12.4) {
                  visiblePricePlacemark(map, item);
               } else {
                  visibleCirclePlacemark(map, item);
               }
               if (currentMouseEvent === 'enter') {
                  setTimeout(() => {
                     const currentMark = document.querySelector(`[data-placemark-id="${item.id}"]`);
                     if (currentMark) {
                        currentMark.classList.add(map.getZoom() > 12.4 ? stylesPlacemark.MapPlacemarkActive : stylesPlacemark.MapCircleActive);
                     }
                  }, 150);
               }
               if (currentMouseEvent === 'leave') {
                  setTimeout(() => {
                     const currentMark = document.querySelector(`[data-placemark-id="${item.id}"]`);
                     if (currentMark) {
                        currentMark.classList.remove(stylesPlacemark.MapCircleActive);
                        currentMark.classList.remove(stylesPlacemark.MapPlacemarkActive);
                     }
                  }, 150);
               }
            }
         }
      });
   }, [currentMouseEnterId]);

   useEffect(() => {
      if (!map) return;
      if (map.getZoom() > 12.4) {
         placemarks.forEach(item => {
            if (visibleBuildingId.includes(item.id)) {
               visiblePricePlacemark(map, item);
            }
         });
      } else {
         placemarks.forEach(item => {
            if (visibleBuildingId.includes(item.id)) {
               visibleCirclePlacemark(map, item);
            }
         });
      }
   }, [visibleBuildingId]);

   return (
      <div className="relative w-full h-full md1:flex-grow md1:absolute md1:!h-[calc(var(--vh,100vh)-114px)]">
         <div ref={mapRef} id="customMap" className="remove-copyrights-pane map-fullscreen" style={stylesMapDefault} />
         {isLoaded && (
            <div className="ymap-actions-container" ref={actionsContainerRef}>
               <div className="ymap-actions ymap-actions-group ymap-action-left-top">
                  <button onClick={() => toggleFullscreen(map, actionsContainerRef)} className="ymap-action ymap-action-btn">
                     <IconFullscreen />
                  </button>
               </div>
               <div className="ymap-actions top-4 right-4 ymap-actions-group !w-auto items-end">
                  {paintMore ? (
                     <>
                        <button className={`ymap-action ymap-action-btn !w-auto font-medium gap-1 px-3 ${isPaintState ? '!w-auto px-4 gap-2' : ''}`}>
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
                        {/* {isDesktop && (
                           <Notification time={5} refTarget={paintBtnRef} position="left" gap={0}>
                              Выделяйте интересующую вас область на карте
                           </Notification>
                        )} */}
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
               {!isDesktop && (
                  <ModalWrapper condition={mobileModalComplex}>
                     <Modal
                        condition={mobileModalComplex}
                        set={setMobileModalComplex}
                        options={{ modalClassNames: '', overlayClassNames: '_bottom _full !z-[9999999]', modalContentClassNames: '!px-4' }}>
                        <CardPrimary {...mobileModalComplex} />
                     </Modal>
                  </ModalWrapper>
               )}
            </div>
         )}
      </div>
   );
}

export default ListingMap;
