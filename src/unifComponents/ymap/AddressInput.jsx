import React, { useState, useEffect, useRef, useCallback } from 'react';
import { YMAPS_API, YMAPS_KEY } from '../../constants/api';
import fetchScript from '../../helpers/fetchScript';
import { fullscrenEnterClasses, fullscrenExitClasses, toggleFullscreen } from './YmapFullscreen';
import { IconClose, IconFullscreen, IconMinus, IconPlus } from '../../ui/Icons';
import { handleZoomIn, handleZoomOut } from './YmapZoom';
import { createPortal } from 'react-dom';
import { usePopper } from 'react-popper';

import stylesSelect from '../../uiForm/Select/Select.module.scss';
import debounce from 'lodash.debounce';
import { SpinnerForBtn } from '../../ui/Spinner';

let visibleListValue = false;

const MapAddressInput = ({ value = '', setValue = () => {}, target = null, setGeoValue = () => {}, geoValue = [], currentCity }) => {
   const [isInit, setIsInit] = useState(false);
   const [query, setQuery] = useState('');
   const [isLoaded, setIsLoaded] = useState(false);
   const [suggestions, setSuggestions] = useState([]);
   const [map, setMap] = useState(null);
   const actionsContainerRef = useRef(null);
   const [visibleList, setVisibleList] = useState(false);

   const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);

   const [popperEl, setPopperEl] = useState(null);

   useEffect(() => {
      const handleDocumentClick = event => {
         if (window.innerWidth <= 1222) return;
         if (target && !target.contains(event.target)) {
            setVisibleList(false);
            visibleListValue = false;
            setSuggestions([]);
         }
      };

      document.addEventListener('click', handleDocumentClick, {
         capture: true,
      });

      return () => {
         document.removeEventListener('click', handleDocumentClick, {
            capture: true,
         });
      };
   }, []);

   const debounceFn = useCallback(
      debounce(state => {
         setIsLoadingSuggestions(false);
         setQuery(state.value || '');
      }, 400),
      []
   );

   useEffect(() => {
      setIsLoadingSuggestions(true);
      visibleListValue = true;

      if (isInit) {
         debounceFn({
            value: value,
            isInit: isInit,
         });
      } else {
         setTimeout(() => {
            setIsInit(true);
         }, 250);
      }
   }, [value, currentCity?.label]);

   useEffect(() => {
      fetchScript(YMAPS_API).then(() => setIsLoaded(true));
   }, []);

   useEffect(() => {
      if (!map || !currentCity?.label) return;
      map.setCenter(currentCity.geo, 10, {
         duration: 500,
      });
   }, [currentCity?.label]);

   const createMap = () => {
      try {
         ymaps.ready(() => {
            const myMap = new ymaps.Map('customMap', {
               center: geoValue.length ? geoValue : (currentCity.geo||[55.7558, 37.6173]),
               zoom: 10,
               controls: [],
            });
            fullscrenEnterClasses(myMap, actionsContainerRef);
            fullscrenExitClasses(myMap, actionsContainerRef);

            if (geoValue.length) {
               updatePlacemark(myMap, geoValue);
            }

            setMap(myMap);
         });
      } catch (error) {}
   };

   const updatePlacemark = (map, coords) => {
      if (!map) return;
      map.geoObjects.removeAll();
      const newPlacemark = new ymaps.Placemark(coords, {});

      map.geoObjects.add(newPlacemark);
      const currentZoomValue = map.getZoom();
      map.setCenter(coords, currentZoomValue >= 18 ? currentZoomValue : 18, {
         duration: 500,
      });
   };

   useEffect(() => {
      if (isLoaded && !map) {
         createMap();
      }
   }, [isLoaded, map]);

   useEffect(() => {
      if (!currentCity?.label || !map || !isLoaded) return;
      setVisibleList(false);
      visibleListValue = false;
      setSuggestions([]);

      const clickHandler = e => {
         const newCoordinates = e.get('coords');
         updatePlacemark(map, newCoordinates);
         setGeoValue(newCoordinates);

         ymaps
            .geocode(newCoordinates, {
               results: 1,
            })
            .then(function (res) {
               const firstGeoObject = res.geoObjects.get(0);
               let address = firstGeoObject.getAddressLine();
               address = address
                  .split(',')
                  .slice(1)
                  .join(',')
                  .trim()
                  .replace(/, подъезд \d+/, '');
               setVisibleList(false);
               visibleListValue = false;
               setValue(address);
            });
      };

      map.events.add('click', clickHandler);

      return () => {
         if (map) {
            map.events.remove('click', clickHandler);
         }
      };
   }, [currentCity?.label, map, isLoaded]);

   useEffect(() => {
      if (!map) return;

      if (query.length > 0 && currentCity?.label) {
         new ymaps.suggest(`${currentCity?.label}, ${query}`, {
            results: 8,
         }).then(items => {
            const filteredItems = items.map(item => {
               const filteredAddress = item.value
                  .split(',')
                  .slice(1)
                  .filter(item => !item.includes('область'))
                  .join(',')
                  .trim()
                  .replace(/, подъезд \d+/, '');
               return {
                  ...item,
                  value: filteredAddress,
               };
            });

            const uniqueArray = filteredItems
               .reduce((acc, current) => {
                  const x = acc.find(item => item.value === current.value);
                  if (!x) {
                     return acc.concat([current]);
                  } else {
                     return acc;
                  }
               }, [])
               .filter(item => item.value);

            setVisibleList(true);
            visibleListValue = true;
            setSuggestions(uniqueArray);
         });
      } else {
         setVisibleList(false);
         visibleListValue = false;
         setSuggestions([]);
      }
   }, [query]);

   const handleSuggestionClick = suggestion => {
      setVisibleList(false);
      visibleListValue = false;
      setQuery('');
      setValue(suggestion.value);
      setSuggestions([]);

      ymaps
         .geocode(`${currentCity?.label}, ${suggestion.value}`, {
            boundedBy: [
               [55.5, 30],
               [75, 190],
            ],
            results: 1,
         })
         .then(res => {
            const firstGeoObject = res.geoObjects.get(0);
            const coords = firstGeoObject.geometry.getCoordinates();

            updatePlacemark(map, coords);
            setGeoValue(coords);
         });
   };

   const { styles, attributes } = usePopper(target, popperEl, {
      placement: 'bottom-start',
      modifiers: [
         {
            name: 'offset',
            options: {
               offset: [0, 5],
            },
         },
      ],
   });

   return (
      <div>
         {visibleList && visibleListValue && (isLoadingSuggestions || suggestions.length > 1)
            ? createPortal(
                 <div
                    ref={setPopperEl}
                    style={{ ...styles.popper, width: target.clientWidth }}
                    {...attributes.popper}
                    className={`!z-[10000] ${stylesSelect.SelectDropdown}`}>
                    <button
                       type="button"
                       className={`${stylesSelect.SelectClose} z-[999]`}
                       onClick={() => {
                          setVisibleList(false);
                          visibleListValue = false;
                          setSuggestions([]);
                       }}>
                       <IconClose />
                    </button>
                    <ul className={`w-auto ${stylesSelect.SelectDropdownList} scrollbarPrimary ${isLoadingSuggestions ? 'min-h-[50px]' : ''}`}>
                       {!isLoadingSuggestions ? (
                          suggestions.map((suggestion, index) => (
                             <li key={index} onClick={() => handleSuggestionClick(suggestion)} className={`${stylesSelect.SelectDropdownItem}`}>
                                {suggestion.value}
                             </li>
                          ))
                       ) : (
                          <SpinnerForBtn className="mx-auto" />
                       )}
                    </ul>
                 </div>,
                 target
              )
            : ''}
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
      </div>
   );
};

export default MapAddressInput;
