import { Controller } from 'react-hook-form';

import React, { useEffect, useState } from 'react';
import FieldError from '../FieldError';
import Select from '../Select';
import isEmptyArrObj from '../../helpers/isEmptyArrObj';
import { useSearchParams } from 'react-router-dom';

export const ControllerFieldSelect = ({
   control,
   errors,
   requiredValue = '',
   placeholderName = 'Не выбрано',
   name = '',
   nameLabel = '',
   options = [],
   defaultValue = {},
   className = '',
   search,
   defaultOption,
   searchLabel,
   setValue = null,
   paramsVisible = false,
   disabled = false,
   onClose = () => {},
}) => {
   const [init, setInit] = useState(false);

   const [searchParams, setSearchParams] = useSearchParams();

   useEffect(() => {
      if (!defaultValue || !defaultValue.value) {
         return;
      }
      if (!setValue) {
         setInit(true);
      }
      if (!init && setValue) {
         setValue(name, defaultValue);
         setInit(true);
      }
   }, [defaultValue, name]);

   return (
      <Controller
         name={name}
         control={control}
         defaultValue={defaultValue}
         rules={{
            required: requiredValue,
            validate: value => {
               if (!requiredValue) return;
               if (isEmptyArrObj(value)) {
                  return typeof requiredValue === 'string' ? requiredValue : false;
               }
            },
         }}
         render={({ field }) => {
            return (
               <Select
                  options={options}
                  nameLabel={nameLabel}
                  placeholderName={placeholderName}
                  onChange={selectedOption => {
                     field.onChange(selectedOption);
                     if (paramsVisible) {
                        const newParams = new URLSearchParams(searchParams);
                        newParams.set([name], selectedOption.label || placeholderName);
                        setSearchParams(newParams);
                     }
                  }}
                  value={field.value}
                  className={className}
                  isValid={errors ? errors[name] : false}
                  search={search}
                  searchLabel={searchLabel}
                  defaultOption={defaultOption}
                  disabled={disabled}
                  onClose={onClose}>
                  <FieldError errors={errors} field={name} />
               </Select>
            );
         }}
      />
   );
};
