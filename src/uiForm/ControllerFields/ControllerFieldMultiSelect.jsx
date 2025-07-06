import { Controller } from 'react-hook-form';

import React, { useEffect, useState } from 'react';
import MultiSelect from '../MultiSelect';
import isEmptyArrObj from '../../helpers/isEmptyArrObj';
import { useSearchParams } from 'react-router-dom';

export const ControllerFieldMultiSelect = ({
   control,
   errors,
   requiredValue = '',
   placeholderText = 'Не выбрано',
   name = '',
   nameLabel = '',
   options = [],
   defaultValue = [],
   search,
   btnsActions,
   searchLabel,
   calcProp,
   setValue,
   paramsVisible = false,
   disabled = false,
   onClose = () => {},
   setValuePermit = false,
}) => {
   const [init, setInit] = useState(false);

   const [searchParams, setSearchParams] = useSearchParams();

   useEffect(() => {
      if (setValuePermit) return;
      if (setValue) {
         if (options.length > 0) {
            setValue(
               name,
               defaultValue.filter(item => {
                  return options.find(currentItem => currentItem.value === item.value);
               })
            );
         } else {
            setValue(name, []);
         }
      }
   }, [options, init]);

   useEffect(() => {
      if (setValuePermit) return;

      if (!defaultValue || !defaultValue.length || !setValue) return;
      if (!init) {
         setValue(name, defaultValue);
         setInit(true);
      }
   }, [defaultValue.length, setValue, name]);

   const onChange = (field, selectedOption) => {
      if (calcProp) {
         const values = selectedOption.map(item => item.id);
         field.onChange(selectedOption);

         if (values.length !== 0 && !values.includes(1) && !values.includes(2) && !values.includes(3) && !values.includes(6)) {
            setValue(name, []);
         }
      } else {
         field.onChange(selectedOption);
         if (paramsVisible) {
            const newParams = new URLSearchParams(searchParams);

            if (selectedOption.length > 0) {
               selectedOption.forEach(item => {
                  newParams.set([name], item.value || '');
                  setSearchParams(newParams);
               });
            } else {
               newParams.delete([name]);
               setSearchParams(newParams);
            }
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
               if (isEmptyArrObj(value)) {
                  return typeof requiredValue === 'string' ? requiredValue : false;
               }
            },
         }}
         render={({ field }) => {
            return (
               <MultiSelect
                  nameLabel={nameLabel}
                  options={options}
                  value={field.value}
                  onChange={selectedOption => onChange(field, selectedOption)}
                  search={search}
                  btnsActions={btnsActions}
                  isValid={errors ? errors[name] : false}
                  searchLabel={searchLabel}
                  calcProp={calcProp}
                  placeholderText={placeholderText}
                  onClose={onClose}
                  disabled={disabled}
               />
            );
         }}
      />
   );
};
