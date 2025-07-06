import React, { useRef, useEffect, useState } from 'react';
import noUiSlider from 'nouislider';
import 'nouislider/dist/nouislider.css';
import wNumb from 'wnumb';

import Input from '.';
import InputStyle from './Input.module.scss';
import numberReplace from '../../helpers/numberReplace';

const RangeSlider = ({ range = { min: 0, max: 100 }, step = 1, beforeText, value, onChange = () => {} }) => {
   const sliderRef = useRef(null);

   const [currentValue, setCurrentValue] = useState(value.toString());

   useEffect(() => {
      if (sliderRef.current) {
         const slider = noUiSlider.create(sliderRef.current, {
            start: value,
            connect: 'lower',
            step: step,
            range: range,
            format: wNumb({
               decimals: 0,
            }),
         });

         slider.on('update', newValues => {
            setCurrentValue(newValues);
            onChange(newValues[0]);
         });

         return () => {
            slider.destroy();
         };
      }
   }, [JSON.stringify(range)]);

   const handleInputChange = value => {
      let currentValue = +value.toString().replace(/\D/g, '');
      if (currentValue > range[1]) currentValue = range[1];
      setCurrentValue([currentValue]);
      onChange(currentValue);
      if (sliderRef.current && sliderRef.current.noUiSlider) {
         sliderRef.current.noUiSlider.set(currentValue);
      }
   };

   return (
      <div className={InputStyle.InputRangeSlider}>
         <Input
            before={beforeText}
            value={numberReplace(String(currentValue))}
            maxValue={range[1]}
            onlyNumber
            convertNumber
            onChange={handleInputChange}
         />
         <div ref={sliderRef}></div>
      </div>
   );
};

export default RangeSlider;
