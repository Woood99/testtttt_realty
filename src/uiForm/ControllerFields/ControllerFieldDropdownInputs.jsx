import React from 'react';
import { Controller } from 'react-hook-form';

import FieldError from '../FieldError';
import { DropdownInputs } from '../Select';

export const ControllerFieldDropdownInputs = ({
   control,
   errors,
   requiredValue = '',
   placeholderName = 'Не выбрано',
   name = '',
   nameLabel = '',
   options = [],
   defaultValue = {},
   className = '',
   defaultOption,
}) => {
   const onChange = (field, obj) => {
      const { value, id, type } = obj;
      if (type === 'checkbox') {
         field.onChange({
            id: id,
            value: '',
         });
      }
      if (type === 'value') {
         if (field.value.id === id) {
            field.onChange({
               id: id,
               value: value,
            });
         }
      }
   };
   return (
      <Controller
         name={name}
         control={control}
         defaultValue={defaultValue}
         rules={{
            required: requiredValue,
            validate: value => {
               if (!requiredValue) return;
               return String(value.value).length > 0;
            },
         }}
         render={({ field }) => {
            return (
               <DropdownInputs
                  options={options}
                  nameLabel={nameLabel}
                  placeholderName={placeholderName}
                  onChange={obj => onChange(field, obj)}
                  value={field.value}
                  className={className}
                  isValid={errors ? errors[name] : false}
                  defaultOption={defaultOption}>
                  <FieldError errors={errors} field={name} />
               </DropdownInputs>
            );
         }}
      />
   );
};
