import React from 'react';
import { useDispatch } from 'react-redux';

import FieldInput from '../FieldInput';
import Input from '../Input';

const PriceFromTo = ({
   dispatchChange,
   priceSelector,
   nameLabelFirst = 'Цена от',
   variant = 'default',
   priceFromVisible = true,
   priceToVisible = true,
   priceToBefore = 'До',
}) => {
   const dispatch = useDispatch();
   const onChangeInput = (type, name, value) => {
      if (dispatchChange) {
         dispatch(
            dispatchChange({
               name,
               value,
               path: `filtersMain.${type}`,
            })
         );
      }
   };

   return (
      <FieldInput>
         {priceFromVisible && (
            <Input
               value={priceSelector.value.priceFrom}
               onChange={value => onChangeInput('price', priceSelector.from.name, value)}
               before={nameLabelFirst}
               convertNumber
               onlyNumber
               maxLength={12}
               variant={variant}
            />
         )}
         {priceToVisible && (
            <Input
               value={priceSelector.value.priceTo}
               onChange={value => onChangeInput('price', priceSelector.to.name, value)}
               before={priceToBefore}
               after="₽"
               convertNumber
               onlyNumber
               maxLength={12}
               variant={variant}
            />
         )}
      </FieldInput>
   );
};

export default PriceFromTo;
