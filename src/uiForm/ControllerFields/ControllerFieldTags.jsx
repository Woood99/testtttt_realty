import { Controller } from 'react-hook-form';
import Tag from '../../ui/Tag';

const ControllerFieldTags = ({
   control,
   name = '',
   options = [],
   defaultValue = [],
   type = 'single',
   customChange = () => {},
   className = '',
   tagColor = 'select',
   tagSize='default'
}) => {
   const onChangeSingle = (value, field, option) => {
      if (value) {
         field.onChange([option.value]);
      } else {
         field.onChange([]);
      }
   };

   const onChangeMultiple = (value, field, option) => {
      if (value) {
         field.onChange([...field.value, option.value]);
      } else {
         field.onChange(field.value.filter(item => item !== option.value));
      }
   };

   const onChangeSingleRequired = (field, option) => {
      field.onChange([option.value]);
   };

   const onChangePlaceholderRequired = (value, field, option) => {
      if (option.value === 'all' || (!value && field.value.length === 1)) {
         field.onChange(['all']);
      } else {
         if (!value) {
            field.onChange(field.value.filter(item => item !== option.value));
         } else {
            field.onChange([...field.value, option.value].filter(item => item !== 'all'));
         }
      }
   };

   return (
      <Controller
         name={name}
         control={control}
         defaultValue={defaultValue}
         render={({ field }) => {
            return (
               <div className={`flex flex-wrap gap-2 ${className}`}>
                  {options.map((option, index) => {
                     return (
                        <Tag
                           key={index}
                           color={tagColor}
                           size={tagSize}
                           onClick={value => {
                              if (type === 'single') {
                                 onChangeSingle(value, field, option);
                              }
                              if (type === 'multiple') {
                                 onChangeMultiple(value, field, option);
                              }
                              if (type === 'single-required') {
                                 onChangeSingleRequired(field, option);
                              }
                              if (type === 'placeholder-required') {
                                 onChangePlaceholderRequired(value, field, option);
                              }
                              if (type === 'custom') {
                                 customChange(value, field, option);
                              }
                           }}
                           value={field.value.includes(option.value)}>
                           {option.label}
                        </Tag>
                     );
                  })}
               </div>
            );
         }}
      />
   );
};

export default ControllerFieldTags;
