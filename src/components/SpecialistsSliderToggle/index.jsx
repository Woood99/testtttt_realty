import React from 'react';
import { Controller } from 'react-hook-form';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';

import CheckboxToggle from '../../uiForm/CheckboxToggle';
import styles from './SpecialistsSliderToggle.module.scss';
import Specialist from '../../ui/Specialist';

const SpecialistsSliderToggle = ({ specialists = [], options = {}, className = '', classNameBtn = '', slidesPerView = 3 }) => {
   if (specialists.length === 0) return;
   return (
      <div className="mt-8">
         <div className={`${className} ${classNameBtn}`}>
            <Controller
               name="isSpecialist"
               control={options.control}
               defaultValue={false}
               render={({ field }) => {
                  return (
                     <CheckboxToggle
                        checked={field.value}
                        set={e => {
                           field.onChange(e.target.checked);
                           options.setValue('specialist', undefined);
                        }}
                        text={`Выбрать менеджера отдела продаж застройщика ${options.developName}`}
                     />
                  );
               }}
            />
         </div>
         <div className={`${styles.SpecialistsSliderToggle} ${options.isSpecialistValue ? styles.SpecialistsSliderToggleActive : ''}`}>
            <Swiper
               slidesPerView={1}
               spaceBetween={16}
               modules={[Navigation]}
               className={`${className} -my-3 py-3`}
               wrapperClass="items-stretch"
               breakpoints={{
                  520: {
                     slidesPerView: 2,
                     spaceBetween: 24,
                  },
                  799: {
                     slidesPerView: 3,
                     spaceBetween: 24,
                  },
                  1222: {
                     slidesPerView: slidesPerView,
                     spaceBetween: 24,
                  },
               }}>
               {specialists.map((specialist, index) => {
                  return (
                     <SwiperSlide key={index}>
                        <Controller
                           name="specialist"
                           control={options.control}
                           rules={{ required: options.isSpecialistValue }}
                           render={({ field }) => {
                              return (
                                 <div onClick={() => field.onChange(specialist.id)} className="cursor-pointer h-full">
                                    <Specialist {...specialist} active={field.value === specialist.id} error={options.errors.specialist} />
                                 </div>
                              );
                           }}
                        />
                     </SwiperSlide>
                  );
               })}
            </Swiper>
         </div>
      </div>
   );
};

export default SpecialistsSliderToggle;
