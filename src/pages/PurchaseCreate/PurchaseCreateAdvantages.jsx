import React, { useContext } from 'react';
import { PurchaseCreateContext } from '../../context';
import { Controller } from 'react-hook-form';
import AdvantageCard from '../../ui/AdvantageCard';

const PurchaseCreateAdvantages = () => {
   const { control, isEdit, defaultData, advantages } = useContext(PurchaseCreateContext);

   if (!advantages.length) return;

   return (
      <div>
         <h2 className="title-2 mb-6">Уникальные преимущества квартиры</h2>
         <div className="grid grid-cols-4 gap-4 md3:grid-cols-2">
            <Controller
               name="advantages"
               control={control}
               defaultValue={isEdit ? defaultData.advantages.map(item => item.id) : []}
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
   );
};

export default PurchaseCreateAdvantages;
