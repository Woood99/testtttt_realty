import React, { useContext } from 'react';
import { PurchaseCreateContext } from '../../context';
import { ControllerFieldTextarea } from '../../uiForm/ControllerFields/ControllerFieldTextarea';

const PurchaseCreateDescr = () => {
   const { control, errors, isEdit, defaultData } = useContext(PurchaseCreateContext);

   return (
      <div className="flex flex-col gap-8" data-block="descr">
         <div>
            <h2 className="title-2 mb-4">Описание</h2>
            <ControllerFieldTextarea
               maxLength={4000}
               control={control}
               name="description"
               placeholder="Напишите подробное описание о недвижимости, собственниках, соседях, транспортной доступности иинфраструктуре"
               errors={errors}
               requiredValue
               defaultValue={isEdit ? defaultData.description || '' : ''}
            />
         </div>
         <div>
            <h2 className="title-2 mb-4">Укажите важные детали в поиске объекта</h2>
            <ControllerFieldTextarea
               maxLength={4000}
               control={control}
               name="details"
               placeholder="Напишите что важно при выборе будующего объекта недвижимости. Например: близость метро, дом с подземным паркингом или минимальный ежемесячный платеж"
               defaultValue={isEdit ? defaultData.details || '' : ''}
            />
         </div>
      </div>
   );
};

export default PurchaseCreateDescr;
