import { useEffect } from 'react';

const ParallaxComponent = ({ children, block, container, condition, heightGap = 0 }) => {
   const throttle = (func, limit) => {
      let lastFunc;
      let lastRan;
      return function () {
         const context = this;
         const args = arguments;
         if (!lastRan) {
            func.apply(context, args);
            lastRan = Date.now();
         } else {
            clearTimeout(lastFunc);
            lastFunc = setTimeout(() => {
               if (Date.now() - lastRan >= limit) {
                  func.apply(context, args);
                  lastRan = Date.now();
               }
            }, limit - (Date.now() - lastRan));
         }
      };
   };

   useEffect(() => {
      if (!block || !container) return;
      if (!condition) {
         block.style.position = 'relative';
         return;
      }

      const handleScroll = () => {
         if (!condition) {
            container.style.marginTop = '0px';
            return;
         }
         const height = block.clientHeight - 40;
         if (window.scrollY >= height - heightGap) return;

         container.style.marginTop = `${height - window.scrollY}px`;
      };

      const onScroll = throttle(handleScroll, 0);

      block.style.position = 'absolute';

      container.style.position = 'relative';
      container.style.zIndex = '99';
      container.style.transition = 'margin-top 0.2s linear';
      handleScroll();

      window.addEventListener('scroll', onScroll, { passive: true });

      return () => {
         window.removeEventListener('scroll', onScroll, { passive: true });
      };
   }, [block, container, condition]);

   return children;
};

export default ParallaxComponent;
