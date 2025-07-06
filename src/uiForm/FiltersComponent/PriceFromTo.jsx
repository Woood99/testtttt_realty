import React from 'react';
import { useDispatch } from 'react-redux';

import FieldInput from '../FieldInput';
import Input from '../Input';

const PriceFromTo = ({ dispatchChange, priceSelector, nameLabelFirst = 'Цена от' }) => {
   const dispatch = useDispatch();
   const onChangeInput = (type, name, value) => {
      dispatch(
         dispatchChange({
            name,
            value,
            path: `filtersMain.${type}`,
         })
      );
   };

   return (
      <FieldInput>
         <Input
            value={priceSelector.value.priceFrom}
            onChange={value => onChangeInput('price', priceSelector.from.name, value)}
            before={nameLabelFirst}
            convertNumber
            onlyNumber
            maxLength={12}
         />
         <Input
            value={priceSelector.value.priceTo}
            onChange={value => onChangeInput('price', priceSelector.to.name, value)}
            before="До"
            after="₽"
            convertNumber
            onlyNumber
            maxLength={12}
         />
      </FieldInput>
   );
};

export default PriceFromTo;
