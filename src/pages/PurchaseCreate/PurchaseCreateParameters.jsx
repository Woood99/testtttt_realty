import React, { useContext } from 'react';
import { PurchaseCreateContext } from '../../context';
import FieldRow from '../../uiForm/FieldRow';
import ControllerFieldTags from '../../uiForm/ControllerFields/ControllerFieldTags';
import { ControllerFieldMultiSelect } from '../../uiForm/ControllerFields/ControllerFieldMultiSelect';
import { roomsOptions } from '../../data/selectsField';
import { ControllerFieldInput } from '../../uiForm/ControllerFields/ControllerFieldInput';
import FieldInput from '../../uiForm/FieldInput';
import AdvantageCard from '../../ui/AdvantageCard';
import { Controller } from 'react-hook-form';
import { PURCHASE_CREATE_FLOOR_OPTIONS } from './purchaseCreateConstants';

const PurchaseCreateParameters = () => {
   const { control, isEdit, defaultData, setValue, developers, complexes, tags, advantages, errors } = useContext(PurchaseCreateContext);

   return (
      <div data-block="parameters">
         <h2 className="title-2 mb-8 md1:mb-6">Параметры заявки</h2>
         <div className="flex flex-col gap-8">
            <FieldRow name="Застройщик" widthChildren={460}>
               <ControllerFieldMultiSelect
                  control={control}
                  search
                  btnsActions
                  options={developers}
                  name="developers"
                  setValue={setValue}
                  setValuePermit
                  placeholderText="Не важно"
               />
            </FieldRow>
            <FieldRow name="Комплекс" widthChildren={460}>
               <ControllerFieldMultiSelect
                  control={control}
                  search
                  btnsActions
                  options={complexes}
                  name="complexes"
                  setValue={setValue}
                  setValuePermit
                  placeholderText="Не важно"
               />
            </FieldRow>
            <FieldRow name="Комнатность" widthChildren={460}>
               <ControllerFieldTags
                  control={control}
                  options={roomsOptions}
                  name="rooms"
                  type="multiple"
                  requiredValue
                  errors={errors}
                  defaultValue={isEdit && defaultData.rooms ? defaultData.rooms : []}
               />
            </FieldRow>
            <FieldRow name="Площадь общая" widthChildren={460}>
               <FieldInput>
                  <ControllerFieldInput
                     name="area_total_from"
                     control={control}
                     convertNumber
                     onlyNumber
                     maxLength={3}
                     beforeText="От"
                     defaultValue={isEdit ? defaultData.area_from || '' : ''}
                  />
                  <ControllerFieldInput
                     name="area_total_to"
                     control={control}
                     convertNumber
                     onlyNumber
                     maxLength={3}
                     beforeText="До"
                     afterText="м²"
                     defaultValue={isEdit ? defaultData.area_to || '' : ''}
                  />
               </FieldInput>
            </FieldRow>
            <FieldRow name="Площадь кухни" widthChildren={460}>
               <FieldInput>
                  <ControllerFieldInput
                     name="area_kitchen_from"
                     control={control}
                     convertNumber
                     onlyNumber
                     maxLength={3}
                     beforeText="От"
                     defaultValue={isEdit ? defaultData.area_kitchen_from || '' : ''}
                  />
                  <ControllerFieldInput
                     name="area_kitchen_to"
                     control={control}
                     convertNumber
                     onlyNumber
                     maxLength={3}
                     beforeText="До"
                     afterText="м²"
                     defaultValue={isEdit ? defaultData.area_kitchen_to || '' : ''}
                  />
               </FieldInput>
            </FieldRow>
            <FieldRow name="Этаж" widthChildren={8000} classNameChildren="grid grid-cols-[1fr_max-content] gap-8 md3:grid-cols-1 md3:gap-4">
               <FieldInput>
                  <ControllerFieldInput
                     name="floor_from"
                     control={control}
                     convertNumber
                     onlyNumber
                     maxLength={3}
                     beforeText="От"
                     defaultValue={isEdit ? defaultData.floor_from || '' : ''}
                  />
                  <ControllerFieldInput
                     name="floor_to"
                     control={control}
                     convertNumber
                     onlyNumber
                     maxLength={3}
                     beforeText="До"
                     afterText="эт."
                     defaultValue={isEdit ? defaultData.floor_to || '' : ''}
                  />
               </FieldInput>
               <ControllerFieldTags
                  className="w-full"
                  control={control}
                  options={PURCHASE_CREATE_FLOOR_OPTIONS}
                  name="floor_options"
                  type="multiple"
                  defaultValue={
                     isEdit
                        ? PURCHASE_CREATE_FLOOR_OPTIONS.filter(item => {
                             if (defaultData.floor_not_first) {
                                return item.value;
                             }
                             if (defaultData.floor_not_last) {
                                return item.value;
                             }
                          }).map(item => item.value)
                        : []
                  }
               />
            </FieldRow>
         </div>
         {Boolean(tags.length) && (
            <div className="mt-12">
               <h2 className="title-2 mb-4">Добавить теги к заявке</h2>
               <div className="flex flex-wrap gap-2">
                  <ControllerFieldTags
                     className="w-full"
                     control={control}
                     tagColor="default"
                     tagSize="medium"
                     options={[
                        { value: 'all', label: 'Не важно' },
                        ...tags.map(item => ({
                           value: item.id,
                           label: item.name,
                        })),
                     ]}
                     name="tags"
                     type="placeholder-required"
                     defaultValue={['all']}
                  />
               </div>
            </div>
         )}
         {Boolean(advantages.length) && (
            <div className="mt-12">
               <h2 className="title-2 mb-4">Уникальные преимущества объекта</h2>
               <div className="grid grid-cols-4 gap-4 md3:grid-cols-2">
                  <Controller
                     name="advantages"
                     control={control}
                     defaultValue={[]}
                     render={({ field }) => {
                        return advantages.map(item => (
                           <AdvantageCard
                              textVisible={false}
                              key={item.id}
                              data={item}
                              onChange={value => {
                                 if (value) {
                                    field.onChange([...field.value, item.id]);
                                 } else {
                                    field.onChange(field.value.filter(currentItem => currentItem !== item.id));
                                 }
                              }}
                              value={field.value.includes(item.id)}
                           />
                        ));
                     }}
                  />
               </div>
            </div>
         )}
      </div>
   );
};

export default PurchaseCreateParameters;
