import { mapRouteHidden } from './RouteToggle';

export const addedActiveContainer = (map, container) => {
   container.current.classList.add('ymap-actions-container-active');
   document.querySelectorAll('.modal-overlay').forEach(el => {
      el.classList.add('modal-overlay-null');
   });
   map.container.getElement().id = 'ymap-fulscreen-active';
};

export const removeActiveContainer = (map, container) => {
   container.current.classList.remove('ymap-actions-container-active');
   document.querySelectorAll('.modal-overlay').forEach(el => {
      el.classList.remove('modal-overlay-null');
   });
   map.container.getElement().removeAttribute('id');
};

export const addedActiveMap = container => {
   container.current.classList.add('map-active-fullscreen');
};

export const removeActiveMap = container => {
   container.current.classList.remove('map-active-fullscreen');
};

export const toggleFullscreen = (map, container, set) => {
   if (!map.container.isFullscreen()) {
      map.container.enterFullscreen();
      addedActiveContainer(map, container);
      if (set) set(true);
   } else {
      map.container.exitFullscreen();
      removeActiveContainer(map, container);
      if (set) set(false);
   }
};

export const fullscrenEnterClasses = (map, container, mapRef, set) => {
   map.container.events.add('fullscreenenter', () => {
      addedActiveContainer(map, container);
      if (mapRef) addedActiveMap(mapRef);
      if (window.innerWidth <= 1222) {
         map.behaviors.enable('drag');
      }
      if (set) set(true);
   });
};

export const fullscrenExitClasses = (map, container, mapRef, set, onClose, options = {}) => {
   map.container.events.add('fullscreenexit', () => {
      removeActiveContainer(map, container);
      if (options.setIsActiveRoute && options.setRouteInfo) {
         mapRouteHidden(map, options.setIsActiveRoute, options.setRouteInfo);
      }
      if (mapRef) removeActiveMap(mapRef);
      if (window.innerWidth <= 1222) {
         map.behaviors.disable('drag');
      }
      if (set) set(false);
      if (onClose) onClose();
   });
};
