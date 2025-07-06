import { useState, useRef, useEffect } from 'react';
import numberReplace from '../../helpers/numberReplace';

const AnimatedNumber = ({ to = 0, duration = 2000 }) => {
   const [number, setNumber] = useState(0);
   const startTime = useRef(null);
   const prevToRef = useRef(to);

   useEffect(() => {
      if (prevToRef.current !== to || startTime.current === null) {
         startTime.current = null;
         prevToRef.current = to;
      }

      const animate = timestamp => {
         if (!startTime.current) startTime.current = timestamp;
         const progress = timestamp - startTime.current;
         const percentage = Math.min(progress / duration, 1);

         const currentNumber = number + (to - number) * percentage;
         setNumber(currentNumber);

         if (percentage >= 1) {
            setNumber(to);
         } else {
            requestAnimationFrame(animate);
         }
      };

      const animationId = requestAnimationFrame(animate);

      return () => cancelAnimationFrame(animationId);
   }, [to, duration, number]);

   return <>{numberReplace(number.toFixed(2))}</>;
};

export default AnimatedNumber;
