import React, { useContext } from 'react';
import { PurchaseCreateContext } from '../../context';
import { PURCHASE_CREATE_TYPES } from './purchaseCreateConstants';
import CardIcon from '../../ui/CardIcon';

const PurchaseCreateStart = () => {
   const { locationRef, typeActiveId, setTypeActiveId } = useContext(PurchaseCreateContext);

   return (
      <div data-block="type">
         <h2 className="title-2 mb-6">Что ищете?</h2>
         <div className="flex gap-4 md3:flex-wrap">
            {PURCHASE_CREATE_TYPES.map(item => {
               return (
                  <CardIcon
                     data={item}
                     key={item.id}
                     active={item.id === typeActiveId}
                     activeOpacity={item.id === typeActiveId || !typeActiveId}
                     onClick={() => {
                        setTypeActiveId(item.id);
                        setTimeout(() => {
                           window.scrollTo({
                              top: locationRef.current?.offsetTop - 16,
                              behavior: 'smooth',
                           });
                        }, 100);
                     }}
                     className="w-[190px] min-h-[132px] md1:w-2/4 md3:w-full"
                  />
               );
            })}
         </div>
      </div>
   );
};

export default PurchaseCreateStart;
