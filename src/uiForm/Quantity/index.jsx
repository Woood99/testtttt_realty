import React, { useEffect, useState } from 'react';
import LoadingDots from '../../ui/LoadingDots';
import Button from '../Button';

const Quantity = ({ count = 0, setCount = () => {}, onChangeIncrement = () => {}, onChangeDecrement = () => {}, disabledIncrement = false }) => {
   const [isLoading, setIsLoading] = useState(false);

   useEffect(() => {
      animate();
   }, []);

   const decrement = () => {
      setCount(count - 1);
      onChangeDecrement();
      animate();
   };

   const increment = () => {
      setCount(count + 1);
      onChangeIncrement();
      animate();
   };

   const animate = () => {
      setIsLoading(true);
      setTimeout(() => {
         setIsLoading(false);
      }, 750);
   };

   return (
      <Button
         Selector="div"
         variant="secondary"
         size="34"
         className="w-max min-w-[114px] mt-auto z-50 relative flex items-center !justify-between gap-2 !px-0 md3:w-full">
         <button type="button" onClick={decrement} className="font-medium text-default h-full w-6 ml-2">
            -
         </button>
         {isLoading ? <LoadingDots /> : <span className="w-6 flex items-center justify-center font-medium leading-none text-default">{count}</span>}
         <button type="button" disabled={disabledIncrement} onClick={increment} className="font-medium text-default h-full w-6 mr-2">
            +
         </button>
      </Button>
   );
};

export default Quantity;
