import React, { useContext } from 'react';
import { PurchaseCreateContext } from '../../context';
import { ControllerFieldSelect } from '../../uiForm/ControllerFields/ControllerFieldSelect';
import { view_start_data } from '../../data/selectsField';

const PurchaseCreateStartView = () => {
   const { control, isEdit, defaultData } = useContext(PurchaseCreateContext);

   return (
      <div data-block="start-view">
         <h2 className="title-2 mb-6">Когда планируете начинать просмотр</h2>
         <ControllerFieldSelect
            control={control}
            nameLabel="Дата"
            defaultValue={isEdit ? view_start_data.find(item => item.value === defaultData.view_start) : view_start_data[0]}
            options={view_start_data}
            name="view_start"
            className="max-w-[400px] md3:max-w-none"
         />
      </div>
   );
};

export default PurchaseCreateStartView;
