import React, { useCallback, useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom/client';

import fetchScript from '../../helpers/fetchScript';
import { BASE_URL, YMAPS_API } from '../../constants/api';
import { handleZoomIn, handleZoomOut } from '../../unifComponents/ymap/YmapZoom';
import { fullscrenEnterClasses, fullscrenExitClasses, toggleFullscreen } from '../../unifComponents/ymap/YmapFullscreen';
import { IconClose, IconFullscreen, IconMinus, IconPlus, IconRoute } from '../../ui/Icons';
import PlacemarkCreate from './PlacemarkCreate';
import { RoutesPath } from '../../constants/RoutesPath';
import visiblePricePlacemark from './visiblePricePlacemark';
import visibleCirclePlacemark from './visibleCirclePlacemark';
import debounce from 'lodash.debounce';
import { BalloonCardSmall, BalloonTooltipInfo } from './BalloonCard';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { mapRouteShow, mapRouteHidden } from '../../unifComponents/ymap/RouteToggle';
import isEmptyArrObj from '../../helpers/isEmptyArrObj';

import stylesMap from './MapPlacemarks.module.scss';
import { createPopper } from '@popperjs/core';
import { stylesMapDefault } from '../../unifComponents/ymap/ymapStyles';
import Button from '../../uiForm/Button';
import HorizontalScrollMouse from '../../ui/HorizontalScrollMouse';
import { getCitiesSelector, getIsDesktop } from '../../redux/helpers/selectors';
import ModalWrapper from '../../ui/Modal/ModalWrapper';
import Modal from '../../ui/Modal';
import CardPrimary from '../../ui/CardPrimary';
import getCardsBuildings from '../../api/getCardsBuildings';

const MapPlacemarks = ({
   sale = [],
   sold = [],
   coordinates = [],
   markCoord = false,
   zoom = 12,
   className = '',
   currentCityId = null,
   idMap = 'customMap',
   children,
   features = false,
   route = false,
   currentBuilding = null,
   buttons = null,
   isFullscreen = false,
   setIsFullscreen = () => {},
   options = {},
   defaultIsFullscreen = false,
   onClose = null,
}) => {
   const isDesktop = useSelector(getIsDesktop);
   const [cards, setCards] = useState([]);
   const [isLoaded, setIsLoaded] = useState(false);

   const [map, setMap] = useState(null);
   const mapRef = useRef(null);

   const cities = useSelector(getCitiesSelector);

   const actionsContainerRef = useRef(null);
   const [placemarks, setPlacemarks] = useState([]);

   const [currentTooltip, setCurrentTooltip] = useState(null);
   const [mobileModalComplex, setMobileModalComplex] = useState(null);
   const [visibleBuildingId, setVisibleBuildingId] = useState([]);

   const [routeInfo, setRouteInfo] = useState({});

   let isOpenTooltip = false;
   const [isActiveRoute, setIsActiveRoute] = useState(false);

   useEffect(() => {
      setCards([...sale, ...sold]);
   }, [sale]);

   useEffect(() => {
      fetchData(currentTooltip);
   }, [currentTooltip]);

   const getDataCard = async id => {
      const res = await getCardsBuildings({ visibleObjects: [id], page: 1 });
      return res?.cards?.[0];
   };

   const fetchData = useCallback(
      debounce(state => {
         if (!state) return;
         if (state.type === 'infrastructure') {
            renderReactComponent(state.hint, state);
         } else {
            getDataCard(state.id).then(res => {
               renderReactComponent(state.hint, { ...res, geo: state.geo });
            });
         }
      }, 450),
      []
   );

   function renderReactComponent(container, data) {
      if (data.type === 'infrastructure') {
         ReactDOM.createRoot(container).render(
            <BalloonTooltipInfo
               data={data}
               complexGeo={coordinates}
               routeShow={() => {
                  mapRouteShow(mapRef.current, coordinates, setIsActiveRoute, actionsContainerRef, setRouteInfo, data.geo);
               }}
            />
         );
      } else {
         ReactDOM.createRoot(container).render(
            <BalloonCardSmall
               currentBuilding={currentBuilding}
               data={data}
               complexGeo={coordinates}
               routeShow={() => {
                  mapRouteShow(mapRef.current, coordinates, setIsActiveRoute, actionsContainerRef, setRouteInfo, data.geo);
               }}
            />
         );
      }
   }

   useEffect(() => {
      fetchScript(YMAPS_API).then(() => setIsLoaded(true));
   }, []);

   const getBuildingId = (myMap, placemarks) => {
      const bounds = myMap.getBounds();
      const buildingId = [];
      placemarks.forEach(function (placemark) {
         const id = placemark.mark.properties.get('id');
         const placemarkCoords = placemark.mark.geometry.getCoordinates();
         if (ymaps.util.bounds.contains(bounds, placemarkCoords)) {
            buildingId.push(id);
         }
      });

      setVisibleBuildingId(buildingId);
   };

   const createMap = () => {
      try {
         const currentCity = currentCityId ? cities.find(item => item.id === currentCityId) : null;

         ymaps.ready(() => {
            const myMap = new ymaps.Map(idMap, {
               center:
                  currentCity && currentCity.latitude && currentCity.longitude
                     ? [currentCity.latitude, currentCity.longitude]
                     : cards[0]?.geo || coordinates,
               zoom: zoom,
               controls: [],
            });

            if (!isDesktop && !defaultIsFullscreen) {
               myMap.behaviors.disable('drag');
            }

            fullscrenEnterClasses(myMap, actionsContainerRef, null, setIsFullscreen);
            fullscrenExitClasses(myMap, actionsContainerRef, null, setIsFullscreen, onClose, { setIsActiveRoute, setRouteInfo });

            if (markCoord) {
               const placemarkEl = new ymaps.Placemark(
                  markCoord,
                  {},
                  {
                     preset: 'islands#icon',
                     iconColor: '#0095b6',
                  }
               );
               myMap.geoObjects.add(placemarkEl);
            }

            setMap(myMap);
            mapRef.current = myMap;
            getBuildingId(myMap, placemarks);
            if (options && options.setMap) {
               options.setMap(myMap);
            }
            setTimeout(() => {
               if (defaultIsFullscreen) {
                  myMap.container.enterFullscreen();
               }
            }, 1);
         });
      } catch (error) {
         console.log('error is', error);
      }
   };

   useEffect(() => {
      if (isLoaded && !map) {
         createMap();
      }
   }, [isLoaded, map, coordinates]);

   useEffect(() => {
      if (isLoaded && map) {
         placemarks.forEach(item => {
            map.geoObjects.remove(item.mark);
         });
      }

      if (isLoaded && map && cards.length > 0) {
         setTimeout(() => {
            const newPlacemarks = cards.map(card => {
               const item = PlacemarkCreate(card, [card.geo[0], card.geo[1]], card.type);

               if (!document.querySelector(`[data-placemark-id="${item.id}"]`) && window.innerWidth > 1212) {
                  item.mark.events.add('mouseenter', e => {
                     actionsContainerRef.current.querySelectorAll('[data-balloon]').forEach(item => {
                        item.remove();
                     });

                     isOpenTooltip = true;
                     let hint = document.createElement('div');

                     hint.style.position = 'absolute';
                     hint.style.paddingTop = '12px';
                     hint.style.paddingBottom = '12px';
                     hint.style.zIndex = '20001';
                     hint.style.minWidth = '450px';
                     hint.style.minHeight = '180px';
                     hint.style.pointerEvents = 'all';
                     hint.style.opacity = 0;

                     hint.setAttribute('data-balloon', item.id);

                     actionsContainerRef.current.appendChild(hint);

                     setCurrentTooltip({ ...item, hint });

                     setTimeout(() => {
                        const interval = setInterval(() => {
                           const inner = hint.firstChild;
                           if (inner) {
                              hint.style.minWidth = `${inner.clientWidth}px`;
                              hint.style.minHeight = `${inner.clientHeight}px`;
                              hint.style.opacity = 1;
                              clearInterval(interval);
                           }
                        }, 100);

                        createPopper(item.mark.getOverlaySync().getElement().querySelector('[data-placemark-id]'), hint, {
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
                  });

                  item.mark.events.add('mouseleave', e => {});
               }

               item.mark.events.add('click', e => {
                  if (window.innerWidth > 1212) {
                     if (item.type !== 'infrastructure') {
                        window.location.href = `${RoutesPath.building}${item.id}`;
                     }
                  } else {
                     getDataCard(item.id).then(res => {
                        setMobileModalComplex(res);
                     });
                  }
               });

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

               return { ...item };
            });
            setPlacemarks(newPlacemarks);
         }, 100);
      }
   }, [cards, isLoaded, map]);

   useEffect(() => {
      if (route) return;
      if (isLoaded && map) {
         mapRouteHidden(map, setIsActiveRoute, setRouteInfo);
      }
   }, [route, isLoaded, map]);

   useEffect(() => {
      if (!map) return;
      if (map.getZoom() > 14) {
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

   useEffect(() => {
      if (actionsContainerRef.current && options && options.actionsContainerRef) {
         options.actionsContainerRef.current = actionsContainerRef.current;
      }
   }, [actionsContainerRef.current]);

   const FeaturesBtns = () => {
      return (
         <>
            {/* <Button
               size="Small"
               variant="third"
               className={`gap-4 !font-normal ${!route ? '!hidden' : ''}`}
               onClick={() => {
                  if (!features) return;
                  if (!isActiveRoute) {
                     mapRouteShow(map, coordinates, setIsActiveRoute, actionsContainerRef, setRouteInfo, null);
                  } else {
                     mapRouteHidden(map, setIsActiveRoute, setRouteInfo);
                  }
               }}>
               <IconRoute width={18} height={18} className="fill-primary400" />
               Построить маршрут
            </Button> */}

            {Boolean(buttons) && buttons}
         </>
      );
   };

   return (
      <>
         <div className={`w-full h-[425px] rounded-xl overflow-hidden relative ${className}`}>
            <div id={idMap} className="remove-copyrights-pane" style={stylesMapDefault} />
            {isLoaded && map && (
               <div className="ymap-actions-container" ref={actionsContainerRef}>
                  {(!defaultIsFullscreen || isDesktop || onClose) && (
                     <div className="ymap-actions ymap-actions-group ymap-action-right-top">
                        <button onClick={() => toggleFullscreen(map, actionsContainerRef, setIsFullscreen)} className="ymap-action ymap-action-btn">
                           {!isFullscreen ? <IconFullscreen /> : <IconClose />}
                        </button>
                     </div>
                  )}

                  {(isDesktop || (!isDesktop && isFullscreen)) && (
                     <div className="ymap-actions ymap-top-right-center ymap-actions-group ymap-actions-group-join">
                        <button onClick={() => handleZoomIn(map)} className="ymap-action">
                           <IconPlus className="stroke-black" />
                        </button>
                        <button onClick={() => handleZoomOut(map)} className="ymap-action">
                           <IconMinus />
                        </button>
                     </div>
                  )}

                  {features && (isDesktop || isFullscreen) && (
                     <HorizontalScrollMouse
                        widthScreen={1222}
                        className={`map-horizontal-actions ymap-actions ymap-actions-group ymap-actions-group-row md1:!w-full !gap-2 left-4 ${
                           window.innerWidth > 1222 ? 'top-4' : 'bottom-4'
                        }`}>
                        <FeaturesBtns />
                     </HorizontalScrollMouse>
                  )}

                  {routeInfo && !isEmptyArrObj(routeInfo) && route && (
                     <div className={stylesMap.MapRouteBlock}>
                        {routeInfo.time} {routeInfo.type} {routeInfo.distance}
                     </div>
                  )}
                  {children}
               </div>
            )}
         </div>
         {features && !isDesktop && !isFullscreen && (
            <HorizontalScrollMouse widthScreen={1222} className="ymap-actions ymap-actions-group-row md1:!w-full !gap-2 mt-4">
               <FeaturesBtns />
            </HorizontalScrollMouse>
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
      </>
   );
};

export default MapPlacemarks;
