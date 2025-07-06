import React, { useEffect, useRef, useState } from 'react';

const HorizontalScrollMouse = ({ children, className = '',Selector='div', speed = 1000, widthScreen = 300 }) => {
   const containerRef = useRef(null);
   const [isDragging, setIsDragging] = useState(false);


   useEffect(() => {
      const container = containerRef.current;
      if (!container) return;
      const handleMouseMove = e => {
         if (isDragging) {
            container.scrollLeft -= e.movementX;
         }
      };

      const handleMouseDown = () => {
         setIsDragging(true);
         container.style.cursor = 'grabbing';
      };

      const handleMouseUp = () => {
         setIsDragging(false);
         container.style.cursor = 'grab';
      };

      const eventHandlers = [
         { event: 'mousemove', handler: handleMouseMove },
         { event: 'mousedown', handler: handleMouseDown },
         { event: 'mouseup', handler: handleMouseUp },
         { event: 'mouseleave', handler: handleMouseUp },
      ];

      eventHandlers.forEach(({ event, handler }) => {
         container.addEventListener(event, handler);
      });

      return () => {
         eventHandlers.forEach(({ event, handler }) => {
            container.removeEventListener(event, handler);
         });
      };
   }, [isDragging]);

   if (window.innerWidth > widthScreen) {
      if (className) {
         return <div className={className}>{children}</div>;
      } else {
         return children;
      }
   }

   return (
      <Selector
         className={`scrollbar-none ${className}`}
         ref={containerRef}
         style={{
            display: 'flex',
            overflowX: 'auto',
            cursor: 'grab',
            pointerEvents: 'auto',
         }}>
         {children}
      </Selector>
   );
};

export default HorizontalScrollMouse;
