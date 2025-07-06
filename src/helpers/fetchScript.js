import { useEffect } from 'react';
import { YMAPS_API } from '../constants/api';

let isYandexMapsLoading = false;
let ymapsPromise = null;

const fetchScript = url => {
   return new Promise((resolve, reject) => {
      const script = document.createElement('script');

      script.type = 'text/javascript';
      script.onload = resolve;
      script.onerror = reject;
      script.src = url;
      script.async = 'async';

      document.head.appendChild(script);
   });
};

export default fetchScript;

export const fetchScriptMap = () => {
   if (typeof ymaps === 'undefined') {
      return fetchScript(YMAPS_API);
   }
};

export const loadYandexMaps = () => {
   return new Promise((resolve, reject) => {
      if (window.ymaps) {
         resolve(window.ymaps);
         return;
      }

      const script = document.createElement('script');
      script.src = YMAPS_API;
      script.type = 'text/javascript';
      script.onload = () => {
         resolve(window.ymaps);
      };
      script.onerror = error => {
         reject(error);
      };
      document.head.appendChild(script);
   });
};
