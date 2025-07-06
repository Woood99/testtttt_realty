import { Controller } from 'react-hook-form';

import React, { useEffect } from 'react';
import Checkbox from '../Checkbox';
import isEmptyArrObj from '../../helpers/isEmptyArrObj';
import CheckboxToggle from '../CheckboxToggle';

export const ControllerFieldCheckbox = ({
   control,
   requiredValue = '',
   name = '',
   option = {},
   defaultValue = false,
   errors,
   className = '',
   variant = 'checkbox',
}) => {
   return (
      <Controller
         name={name}
         control={control}
         defaultValue={defaultValue}
         rules={{ required: requiredValue }}
         render={({ field }) => {
            if (variant === 'checkbox') {
               return (
                  <Checkbox
                     className={className}
                     option={option}
                     checked={field.value}
                     onChange={event => field.onChange(event.target.checked)}
                     isValid={errors ? errors[name] : false}
                  />
               );
            }
            if (variant === 'toggle') {
               return <CheckboxToggle checked={field.value} set={event => field.onChange(event.target.checked)} text={option.label} />;
            }
         }}
      />
   );
};

export const ControllerFieldCheckboxesSingle = ({ control, setValue, checkboxes = [], disabledAll, defaultValue = {}, required, watch }) => {
   useEffect(() => {
      if (isEmptyArrObj(defaultValue)) return;
      setValue(defaultValue.value, true);
   }, [defaultValue]);

   const handleCheckboxChange = (name, value) => {
      checkboxes.forEach(item => {
         if (!value) return;
         if (item.value === name) {
            setValue(item.value, true);
         } else {
            setValue(item.value, false);
         }
      });
   };

   return checkboxes.map((item, index) => (
      <Controller
         key={index}
         name={item.value}
         control={control}
         render={({ field }) => (
            <Checkbox
               option={item}
               checked={field.value}
               disabled={disabledAll}
               onChange={e => {
                  if (required && watch) {
                     if (watch()[item.value]) {
                        return;
                     }
                  }

                  field.onChange(e);
                  handleCheckboxChange(item.value, e.target.checked);
               }}
            />
         )}
      />
   ));
};

export const getCurrentCheckboxesSingle = (checkboxes, data) => {
   const currentCheckboxes = Object.keys(data).filter(item => {
      let value = false;
      checkboxes.forEach(chk => {
         if (chk.value === item) {
            value = true;
         }
      });
      return value;
   });
   for (const key of currentCheckboxes) {
      if (data[key]) {
         return key;
      }
   }
};
