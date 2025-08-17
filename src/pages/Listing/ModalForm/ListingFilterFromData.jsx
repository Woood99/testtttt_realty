import React, { useContext } from 'react';

import FieldRow from '../../../uiForm/FieldRow';
import MultiSelect from '../../../uiForm/MultiSelect';
import FieldInput from '../../../uiForm/FieldInput';
import Input from '../../../uiForm/Input';
import SelectTag from '../../../uiForm/SelectTag';
import isEmptyArrObj from '../../../helpers/isEmptyArrObj';
import { ListingFiltersContext } from '.';
import { filterTypeMultipleSelect } from '../../../data/selectsField';

export const ListingFilterFromData = ({ name, tooltipLayout }) => {
   const { filtersSelector, handleChangeInput, handleChange } = useContext(ListingFiltersContext);

   const widthChildren = 512;
   const data = filtersSelector[name];

   if (!data) return;
   if (isEmptyArrObj(data.options?.length)) {
      return;
   }

   let currentType = data.type;

   if (data.type === 'list-multiple' && !filterTypeMultipleSelect(data.label)) currentType = 'tags-multiple';
   if (data.type === 'list-single') currentType = 'tags-single';

   if (currentType === 'list-multiple') {
      return (
         <FieldRow name={data.nameLabel || data.label} widthChildren={widthChildren} classNameName="font-medium">
            <MultiSelect
               options={data.options}
               value={data.value}
               onChange={value => handleChange(data.name, value, currentType)}
               search
               btnsActions
            />
         </FieldRow>
      );
   }

   if (currentType === 'tags-single') {
      return (
         <FieldRow name={data.nameLabel || data.label} widthChildren={widthChildren} classNameName="font-medium">
            <SelectTag
               onChange={value => handleChange(data.name, value, currentType)}
               value={data.value}
               options={data.options.filter(item => item.value)}
            />
         </FieldRow>
      );
   }

   if (currentType === 'tags-multiple') {
      return (
         <FieldRow name={data.nameLabel || data.label} widthChildren={99999} classNameName="font-medium" infoTooltip={tooltipLayout}>
            <SelectTag
               type="multiple"
               onChange={value => handleChange(data.name, value, currentType)}
               value={data.value}
               options={data.options.filter(item => item.value)}
            />
         </FieldRow>
      );
   }

   if (currentType === 'field-fromTo') {
      const { from, to } = data;
      return (
         <FieldRow name={data.nameLabel || data.label} widthChildren={widthChildren} classNameName="font-medium">
            <FieldInput>
               <Input
                  value={filtersSelector[data.name].value[from.name]}
                  onChange={value => handleChangeInput(data.name, from.name, value)}
                  before={from.label}
                  convertNumber
                  onlyNumber
                  maxLength={3}
               />
               <Input
                  value={filtersSelector[data.name].value[to.name]}
                  onChange={value => handleChangeInput(data.name, to.name, value)}
                  before={to.label}
                  after={data.postfix}
                  convertNumber
                  onlyNumber
                  maxLength={3}
               />
            </FieldInput>
         </FieldRow>
      );
   }
};
