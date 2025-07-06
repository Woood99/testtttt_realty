import { useCallback, useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { getIsDesktop } from '../../../redux/helpers/selectors';

export const useResizeSidebar = (defaultMini = false) => {
   const currentLocalStorageStart = +localStorage.getItem('chat-sidebar-width') || 350;

   const options = {
      start_width: currentLocalStorageStart,
      min_width: 200,
      max_width: 350,
      mini_width: 95,
   };

   const isDesktop = useSelector(getIsDesktop);
   const [sidebarWidth, setSidebarWidth] = useState(defaultMini ? options.mini_width : options.start_width);
   const [isResizing, setIsResizing] = useState(false);
   const sidebarRef = useRef(null);
   const startXRef = useRef(0);
   const startWidthRef = useRef(defaultMini ? options.mini_width : options.start_width);

   const startResizing = useCallback(
      e => {
         setIsResizing(true);
         startXRef.current = e.clientX;
         startWidthRef.current = sidebarWidth;
         document.body.style.cursor = 'col-resize';
         document.body.style.userSelect = 'none';
      },
      [sidebarWidth]
   );

   const stopResizing = useCallback(() => {
      setIsResizing(false);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
   }, []);

   const resize = useCallback(
      e => {
         if (isResizing) {
            const dx = e.clientX - startXRef.current;
            const newWidth = startWidthRef.current + dx;

            const clampedWidth = Math.min(Math.max(newWidth, options.min_width), options.max_width);
            localStorage.setItem('chat-sidebar-width', clampedWidth);

            setSidebarWidth(clampedWidth);
         }
      },
      [isResizing]
   );

   useEffect(() => {
      window.addEventListener('mousemove', resize);
      window.addEventListener('mouseup', stopResizing);
      return () => {
         window.removeEventListener('mousemove', resize);
         window.removeEventListener('mouseup', stopResizing);
      };
   }, [resize, stopResizing]);

   return {
      sidebarWidth,
      sidebarRef,
      startResizing,
      sidebarMini: sidebarWidth <= options.min_width && isDesktop,
      sidebarOptions: options,
   };
};
