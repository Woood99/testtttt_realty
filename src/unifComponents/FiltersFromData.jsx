import React from 'react';
import FieldRow from '../uiForm/FieldRow';
import MultiSelect from '../uiForm/MultiSelect';
import FieldInput from '../uiForm/FieldInput';
import Input from '../uiForm/Input';
import SelectTag from '../uiForm/SelectTag';
import isEmptyArrObj from '../helpers/isEmptyArrObj';
import { ControllerFieldInput } from '../uiForm/ControllerFields/ControllerFieldInput';
import Select from '../uiForm/Select';
import ControllerFieldTags from '../uiForm/ControllerFields/ControllerFieldTags';
import ControllerFieldTagCheckbox from '../uiForm/ControllerFields/ControllerFieldTagCheckbox';

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

export const FiltersFromDataRow = props => {
   const { data, filtersSelector, widthChildren = 460 } = props;

   if (data.type === 'list-multiple' && !isEmptyArrObj(data.options)) {
      return (
         <FieldRow name={data.nameLabel || data.label} widthChildren={widthChildren} classNameName="font-medium">
            <MultiSelect
               options={data.options}
               value={data.value}
               onChange={value => props.handleChange(data.name, value, data.type)}
               search
               btnsActions
            />
         </FieldRow>
      );
   }

   if (data.type === 'list-single' && !isEmptyArrObj(data.options)) {
      return (
         <FieldRow name={data.nameLabel || data.label} widthChildren={widthChildren} classNameName="font-medium">
            <Select options={data.options} value={data.value} onChange={value => props.handleChange(data.name, value, data.type)} defaultOption />
         </FieldRow>
      );
   }

   if (data.type === 'tags-single' && !isEmptyArrObj(data.options)) {
      return (
         <FieldRow name={data.nameLabel || data.label} widthChildren={widthChildren} classNameName="font-medium">
            <SelectTag
               onChange={value => props.handleChange(data.name, value, data.type)}
               value={data.value}
               options={data.options.filter(item => item.value)}
            />
         </FieldRow>
      );
   }

   if (data.type === 'tags-multiple' && !isEmptyArrObj(data.options)) {
      return (
         <FieldRow
            name={data.nameLabel || data.label}
            widthChildren={99999}
            classNameName="font-medium"
            infoTooltip={
               data.name === 'Отделка' && (
                  <div className="max-w-[220px] flex flex-col gap-6">
                     <div>
                        <h4 className="title-4 !text-white">Черновая</h4>
                        <p className="mt-1.5">
                           В черновой отделке встречаются помещения без межкомнатных перегородок. Электричество проведено до щитка в подъезде.
                           Радиаторов отопления может не быть — только трубы. Стены не оштукатурены. Нет откосов, подоконников и сантехники
                        </p>
                     </div>

                     <div>
                        <h4 className="title-4 !text-white">Предчистовая</h4>
                        <p className="mt-1.5">
                           В предчистовой отделке или whitebox стены и потолки белые, покрыты шпаклёвкой. На полу ровная чистовая стяжка. Сделана
                           электрика. Трубы в ванной и на кухне разведены
                        </p>
                     </div>
                     <div>
                        <h4 className="title-4 !text-white">Чистовая</h4>

                        <p className="mt-1.5">
                           Квартира с такой отделкой готова к переезду: на стенах — обои или краска, на полу — ламинат или линолеум. Розетки и
                           выключатели установлены. Есть сантехника. Иногда застройщики устанавливают базовую мебель
                        </p>
                     </div>
                  </div>
               )
            }>
            <SelectTag
               type="multiple"
               onChange={value => props.handleChange(data.name, value, data.type)}
               value={data.value}
               options={data.options.filter(item => item.value)}
            />
         </FieldRow>
      );
   }

   if (data.type === 'field-fromTo' && !isEmptyArrObj(data.options)) {
      const { from, to } = data;
      return (
         <FieldRow name={data.nameLabel || data.label} widthChildren={widthChildren} classNameName="font-medium">
            <FieldInput>
               <Input
                  value={filtersSelector[data.name].value[from.name]}
                  onChange={value => props.handleChangeInput(data.name, from.name, value)}
                  before={from.label}
                  convertNumber
                  onlyNumber
                  maxLength={3}
               />
               <Input
                  value={filtersSelector[data.name].value[to.name]}
                  onChange={value => props.handleChangeInput(data.name, to.name, value)}
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
