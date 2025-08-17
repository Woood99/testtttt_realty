import React, { useContext } from 'react';
import FieldRow from '../uiForm/FieldRow';
import MultiSelect from '../uiForm/MultiSelect';
import FieldInput from '../uiForm/FieldInput';
import Input from '../uiForm/Input';
import SelectTag from '../uiForm/SelectTag';
import isEmptyArrObj from '../helpers/isEmptyArrObj';
import { ControllerFieldInput } from '../uiForm/ControllerFields/ControllerFieldInput';
import ControllerFieldTags from '../uiForm/ControllerFields/ControllerFieldTags';
import ControllerFieldTagCheckbox from '../uiForm/ControllerFields/ControllerFieldTagCheckbox';
import { ListingFiltersContext } from '../pages/Listing/ModalForm';
import { filterTypeMultipleSelect } from '../data/selectsField';

export const FiltersFromDataController = props => {
   const { data, control, nameOptions = 'options', defaultValues = [], className = '' } = props;

   const name = data.name?.toString() || '';
   const options =
      data[nameOptions]?.map(item => ({
         label: item,
         value: item,
      })) || [];

   const currentDefaultValueObj = defaultValues.filter(item => item && !isEmptyArrObj(item) && item.name === name);

   let currentDefaultValue = null;

   if (currentDefaultValueObj && !isEmptyArrObj(currentDefaultValueObj)) {
      if (data.type === 'list-multiple') {
         currentDefaultValue = currentDefaultValueObj.map(item => ({
            value: item.value.split(', '),
            label: item.name,
         }));
      } else {
         currentDefaultValue = { value: currentDefaultValueObj[0].value, label: currentDefaultValueObj[0].value };
      }
   }

   if (data.type === 'text-field' || data.type === 'number-field') {
      return (
         <ControllerFieldInput
            className={className}
            control={control}
            onlyNumber={data.type === 'number-field'}
            beforeText={data.name}
            afterText={data.postfix}
            name={name}
            defaultValue={currentDefaultValue?.value || ''}
         />
      );
   }

   if (data.type === 'list-single') {
      return (
         <FieldRow name={data.name} widthChildren={460} className={className}>
            <ControllerFieldTags
               control={control}
               options={options}
               name={data.name}
               type="single"
               defaultValue={currentDefaultValue ? [currentDefaultValue.value] : []}
            />
         </FieldRow>
      );
   }

   if (data.type === 'list-multiple') {
      return (
         <FieldRow name={data.name} widthChildren={460} className={className}>
            <ControllerFieldTags
               control={control}
               options={[{ value: 'all', label: 'Не важно' }, ...options]}
               name={data.name}
               type="placeholder-required"
               defaultValue={currentDefaultValue?.[0]?.value || ['all']}
            />
         </FieldRow>
      );
   }

   if (data.type === 'flag') {
      return (
         <FieldRow name={name} widthChildren={460} className={className}>
            <ControllerFieldTagCheckbox
               control={control}
               options={options}
               name={name}
               defaultValue={currentDefaultValue ? currentDefaultValue.value : options[1].value}
            />
         </FieldRow>
      );
   }
};
