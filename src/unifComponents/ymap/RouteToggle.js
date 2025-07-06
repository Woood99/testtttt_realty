import { addedActiveContainer } from './YmapFullscreen';

const findAllPlacemarks = map => {
   const placemarks = [];
   const geoObjects = map.geoObjects;
   const length = geoObjects.getLength();

   for (let i = 0; i < length; i++) {
      const geoObject = geoObjects.get(i);
      if (geoObject instanceof ymaps.Placemark) {
         placemarks.push(geoObject);
      }
   }

   return placemarks;
};

export const mapRouteShow = (map, coordinatesFrom = [], set = null, actionsContainerRef, setRouteInfo, coordinatesTo = null) => {
   if (!map) return;

   if (!map.container.isFullscreen()) {
      map.container.enterFullscreen();
      addedActiveContainer(map, actionsContainerRef);
   }

   setTimeout(() => {
      const mapHorizontalActions = document.querySelector('.map-horizontal-actions');
      if (mapHorizontalActions && window.innerWidth < 1222) {
         mapHorizontalActions.style.opacity = 0;
         mapHorizontalActions.style.visibility = 'hidden';
      }

      map.controls.add('routePanelControl', {
         showHeader: true,
         title: 'Построить маршрут',
         float: 'left',
         maxWidth: window.innerWidth > 1222 ? 230 : '100%',
         position: {
            left: 0,
            right: window.innerWidth > 1222 ? 'auto' : 0,
            top: window.innerWidth > 1222 ? 16 + 40 + 4 : 'auto',
            bottom: window.innerWidth > 1222 ? 'auto' : 0,
         },
         autoFocus: true,
      });

      const routePanelControl = map.controls.get('routePanelControl');

      routePanelControl.routePanel.state.set({
         fromEnabled: false,
         from: coordinatesFrom,
         to: coordinatesTo,
         type: 'pedestrian',
      });

      setTimeout(() => {
         const container = routePanelControl._layout._parentElement;
         if (container) {
            const content = container.querySelector('.ymaps-2-1-79-control-popup__content');
            if (content) {
               const closeButton = document.createElement('div');
               closeButton.innerHTML = `
                 <svg xmlns="http://www.w3.org/2000/svg" id="Outline" viewBox="0 0 24 24" width="20" height="20" class="fill-blue">
                  <path d="M18,6h0a1,1,0,0,0-1.414,0L12,10.586,7.414,6A1,1,0,0,0,6,6H6A1,1,0,0,0,6,7.414L10.586,12,6,16.586A1,1,0,0,0,6,18H6a1,1,0,0,0,1.414,0L12,13.414,16.586,18A1,1,0,0,0,18,18h0a1,1,0,0,0,0-1.414L13.414,12,18,7.414A1,1,0,0,0,18,6Z" />
                </svg>
            `;
               closeButton.style.position = 'absolute';
               closeButton.style.top = '16px';
               closeButton.style.right = '16px';
               closeButton.style.cursor = 'pointer';
               content.appendChild(closeButton);

               closeButton.addEventListener('click', function () {
                  mapRouteHidden(map, set, setRouteInfo);
               });
            }
         }
         if (set) {
            set(true);
         }
      }, 1);

      var multiRoutePromise = routePanelControl.routePanel.getRouteAsync();

      multiRoutePromise.then(
         function (multiRoute) {
            multiRoute.model.events.add('requestsuccess', function () {
               const activeRoute = multiRoute.getActiveRoute();

               if (activeRoute) {
                  const type = activeRoute.properties.get('type');
                  const info = {
                     type:
                        type === 'pedestrian'
                           ? 'пешком'
                           : type === 'driving'
                           ? 'на машине'
                           : type === 'masstransit'
                           ? 'транспортом'
                           : type === 'bicycle'
                           ? 'на велосипеде'
                           : '',
                     distance: activeRoute.properties.get('distance').text,
                     time: activeRoute.properties.get('duration').text,
                  };

                  setRouteInfo(info);
               } else {
                  setRouteInfo({});
               }
            });
            multiRoute.events.add('activeroutechange', function () {
               const activeRoute = multiRoute.getActiveRoute();

               if (activeRoute) {
                  const type = activeRoute.properties.get('type');
                  const info = {
                     type:
                        type === 'pedestrian'
                           ? 'пешком'
                           : type === 'driving'
                           ? 'на машине'
                           : type === 'masstransit'
                           ? 'транспортом'
                           : type === 'bicycle'
                           ? 'на велосипеде'
                           : '',
                     distance: activeRoute.properties.get('distance').text,
                     time: activeRoute.properties.get('duration').text,
                  };

                  setRouteInfo(info);
               } else {
                  setRouteInfo({});
               }
            });
         },
         function (err) {
            console.log(err);
         }
      );
   }, 5);
};

export const mapRouteHidden = (map, set, setRouteInfo) => {
   if (!map) return;
   map.controls.remove('routePanelControl');
   const mapHorizontalActions = document.querySelector('.map-horizontal-actions');
   if (mapHorizontalActions && window.innerWidth < 1222) {
      mapHorizontalActions.style.opacity = 1;
      mapHorizontalActions.style.visibility = 'visible';
   }
   if (set) {
      set(false);
   }
   setRouteInfo({});
};
