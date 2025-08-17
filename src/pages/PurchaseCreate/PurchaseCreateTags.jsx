import React, { useContext } from 'react';
import { PurchaseCreateContext } from '../../context';
import ControllerFieldTags from '../../uiForm/ControllerFields/ControllerFieldTags';

const PurchaseCreateTags = () => {
   const { control, isEdit, defaultData, tags } = useContext(PurchaseCreateContext);

   if (!tags.length) return;

   return (
      <div>
         <h2 className="title-2 mb-6">Добавить теги к заявке</h2>
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
               defaultValue={isEdit && defaultData.tags?.length ? defaultData.tags.map(item => item.id) : ['all']}
            />
         </div>
      </div>
   );
};

export default PurchaseCreateTags;
