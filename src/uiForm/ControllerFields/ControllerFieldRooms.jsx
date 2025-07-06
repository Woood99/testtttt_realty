import { Controller } from 'react-hook-form';

import React from 'react';
import RoomsContainer from '../CheckboxRoom/RoomsContainer';
import CheckboxRoom from '../CheckboxRoom';
import isEmptyArrObj from '../../helpers/isEmptyArrObj';

export const ControllerFieldRooms = ({ control, errors, requiredValue, name = '', options = [], defaultValue = [], type = 'multiple' }) => {
   return (
      <RoomsContainer>
         <Controller
            name={name}
            control={control}
            defaultValue={defaultValue}
            rules={{
               required: requiredValue,
               validate: value => {
                  if (!requiredValue) return;
                  return !isEmptyArrObj(value);
               },
            }}
            render={({ field }) => {
               return options.map((option, index) => {
                  return (
                     <CheckboxRoom
                        key={index}
                        checked={field.value.includes(option.value)}
                        onChange={e => {
                           if (type === 'single') {
                              field.onChange([option.value]);
                           }
                           if (type === 'multiple') {
                              if (e.target.checked) {
                                 field.onChange([...field.value, option.value]);
                              } else {
                                 field.onChange(field.value.filter(item => item !== option.value));
                              }
                           }
                        }}
                        label={option.label}
                        size={option.value === 0 ? 'Studio' : 'Default'}
                        isValid={errors ? errors[name] : false}
                     />
                  );
               });
            }}
         />
      </RoomsContainer>
   );
};
