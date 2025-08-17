import { useRef } from 'react';

export const useLongPress = (callback = () => {}, ms = 500) => {
   const timerRef = useRef(null);
   const movedRef = useRef(false);

   const start = () => {
      movedRef.current = false;
      timerRef.current = setTimeout(() => {
         if (!movedRef.current) {
            callback();
         }
      }, ms);
   };

   const stop = () => {
      if (timerRef.current) {
         clearTimeout(timerRef.current);
      }
   };

   const move = () => {
      movedRef.current = true;
      stop();
   };

   return {
      onTouchStart: start,
      onTouchEnd: stop,
      onTouchMove: move,
   };
};
