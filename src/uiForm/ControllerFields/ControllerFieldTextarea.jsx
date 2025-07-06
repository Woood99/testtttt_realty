import { Controller } from 'react-hook-form';

import React from 'react';
import Textarea from '../Textarea';
import FieldError from '../FieldError';

export const ControllerFieldTextarea = ({
   control,
   errors,
   requiredValue = '',
   name = '',
   defaultValue = '',
   maxLength,
   placeholder,
   minHeight = 140,
}) => {
   return (
      <Controller
         control={control}
         name={name}
         defaultValue={defaultValue}
         rules={{
            required: requiredValue,
         }}
         render={({ field }) => {
            return (
               <Textarea
                  maxLength={maxLength}
                  value={field.value}
                  onChange={value => field.onChange(value)}
                  placeholder={placeholder}
                  minHeight={minHeight}
                  isValid={errors ? errors[name] : false}>
                  <FieldError errors={errors} field={name} />
               </Textarea>
            );
         }}
      />
   );
};
