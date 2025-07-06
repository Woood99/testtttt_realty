import { useCallback, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import io from 'socket.io-client';
import debounce from 'lodash.debounce';

import { setWindowSize } from '../../redux/slicesHelp/windowSizeSlice';

export const useMainHelpers = () => {
   const dispatch = useDispatch();

   const handleResize = useCallback(
      debounce(() => {
         const vh = window.innerHeight;
         dispatch(setWindowSize({ width: window.innerWidth, height: vh }));
         document.documentElement.style.setProperty('--vh', `${vh}px`);
      }, 200),
      []
   );

   useEffect(() => {
      window.addEventListener('resize', handleResize);

      return () => {
         window.removeEventListener('resize', handleResize);
      };
   }, []);

   useEffect(() => {
      handleResize();
   }, []);

   useEffect(() => {
      window.io = io;

      // Очистка (если нужно)
      return () => {
         delete window.io;
      };
   }, []);
};
