import React from 'react';
import Button from '../../../uiForm/Button';
import { ControllerFieldRooms } from '../../../uiForm/ControllerFields/ControllerFieldRooms';
import { ControllerFieldTextarea } from '../../../uiForm/ControllerFields/ControllerFieldTextarea';
import { ControllerFieldInput } from '../../../uiForm/ControllerFields/ControllerFieldInput';

import ApartmentPhoto from './ApartmentPhoto';
import { ControllerFieldCheckbox } from '../../../uiForm/ControllerFields/ControllerFieldCheckbox';
import { ControllerFieldSelect } from '../../../uiForm/ControllerFields/ControllerFieldSelect';
import { ControllerFieldMultiSelect } from '../../../uiForm/ControllerFields/ControllerFieldMultiSelect';
import CheckboxToggle from '../../../uiForm/CheckboxToggle';
import { defaultApartData } from './constants';

const ApartmentForm = ({ options }) => {
   const { onSubmitHandler, data, frames, dataPhotos, setDataPhotos, customFrame, setCustomFrame, tags, advantages, control, errors, handleSubmit } =
      options;

   if (!data) return;

   return (
      <form onSubmit={handleSubmit(onSubmitHandler)} className="mt-6">
         <div className="container">
            <div className="white-block">
               <h2 className="title-2 mb-6">Параметры</h2>
               <div className="grid grid-cols-[max-content_1fr_1fr_1fr] gap-2">
                  <ControllerFieldRooms
                     type="single"
                     control={control}
                     options={defaultApartData.rooms}
                     name="room"
                     requiredValue
                     errors={errors}
                     defaultValue={data.rooms?.toString()}
                  />
                  <ControllerFieldInput
                     control={control}
                     name="area"
                     beforeText="Площадь"
                     afterText="м²"
                     requiredValue
                     errors={errors}
                     defaultValue={data.area}
                     onlyNumberSemicolon
                  />
                  <ControllerFieldInput control={control} beforeText="Срок сдачи" name="deadline" defaultValue={data.deadline} />
                  <ControllerFieldSelect
                     control={control}
                     nameLabel="Этаж"
                     options={defaultApartData.floor}
                     defaultValue={
                        data.floor
                           ? {
                                value: data.floor,
                                label: data.floor,
                             }
                           : {}
                     }
                     name="floor"
                     requiredValue
                     errors={errors}
                  />
               </div>
               <div className="mt-2 grid grid-cols-3 gap-2">
                  {/* <ControllerFieldSelect
                     control={control}
                     nameLabel="Этаж дома"
                     options={defaultApartData.floor}
                     name="floor-max"
                     requiredValue
                     errors={errors}
                  /> */}
                  <ControllerFieldMultiSelect
                     name="tags"
                     control={control}
                     nameLabel="Теги"
                     options={tags.map(item => {
                        return {
                           value: item.id,
                           label: item.name,
                        };
                     })}
                     defaultValue={data.apartment_tags?.map(item => {
                        return {
                           value: item.id,
                           label: item.name,
                        };
                     })}
                  />
                  <ControllerFieldMultiSelect
                     name="advantages"
                     control={control}
                     nameLabel="Уникальные преимущества квартиры"
                     options={advantages.map(item => {
                        return {
                           value: item.id,
                           label: item.name,
                        };
                     })}
                     defaultValue={data.advantages?.map(item => {
                        return {
                           value: item.id,
                           label: item.name,
                        };
                     })}
                  />
               </div>
               <div className="mt-6">
                  <h3 className="title-3 mb-4">Корпус</h3>
                  <div className="grid grid-cols-[400px_max-content] gap-2 items-center">
                     {customFrame ? (
                        <ControllerFieldInput control={control} beforeText="Корпус" name="custom_frame" requiredValue errors={errors} />
                     ) : (
                        <ControllerFieldSelect
                           control={control}
                           nameLabel="Корпус"
                           options={frames}
                           defaultValue={
                              data.housing
                                 ? {
                                      value: data.housing,
                                      label: data.housing,
                                   }
                                 : {}
                           }
                           name="frame"
                        />
                     )}
                     <CheckboxToggle
                        checked={customFrame}
                        set={e => {
                           setCustomFrame(e.target.checked);
                        }}
                        text="Другой корпус"
                     />
                  </div>
               </div>
            </div>
            {/* <div className="white-block mt-4">
               <h2 className="title-2 mb-6">Описание</h2>
               <ControllerFieldTextarea
                  control={control}
                  maxLength={4000}
                  name="description"
                  defaultValue={data.description}
                  placeholder="Расскажите о недвижимости, транспортной доступности и инфраструктуре"
               />
            </div> */}
            <ApartmentPhoto images={dataPhotos} setImages={setDataPhotos} />
            <div className="white-block mt-4">
               <h2 className="title-2 mb-6">Выводить в каталог</h2>
               <div className="flex gap-8">
                  <ControllerFieldCheckbox
                     defaultValue={data.show_on_homepage}
                     control={control}
                     option={{ label: 'Определенно рекомендуем' }}
                     name="recommend-catalog"
                  />
                  <ControllerFieldCheckbox
                     defaultValue={data.show_cashback_on_homepage}
                     control={control}
                     option={{ label: 'Повышенный кешбэк' }}
                     name="cashback-catalog"
                  />
               </div>
            </div>
            <div className="white-block mt-4">
               <h2 className="title-2 mb-6">Цена</h2>
               <div className="grid grid-cols-3 gap-2">
                  <ControllerFieldInput
                     control={control}
                     beforeText="Цена"
                     afterText="₽"
                     name="price"
                     defaultValue={data.priceOld}
                     convertNumber
                     onlyNumber
                     requiredValue
                     errors={errors}
                  />
               </div>
            </div>
         </div>
         <div className="container">
            <Button type="submit" className="w-full mt-8">
               Сохранить
            </Button>
         </div>
      </form>
   );
};

export default ApartmentForm;
