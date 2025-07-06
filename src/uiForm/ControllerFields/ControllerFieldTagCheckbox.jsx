import { Controller } from 'react-hook-form';
import Tag from '../../ui/Tag';

const ControllerFieldTagCheckbox = ({ control, errors, name = '', options = [], defaultValue = [], className = '' }) => {
   const onChange = (value, field) => {
      if (value) {
         field.onChange([options[0].value]);
      } else {
         field.onChange([options[1].value]);
      }
   };

   return (
      <Controller
         name={name}
         control={control}
         defaultValue={defaultValue}
         render={({ field }) => {
            return (
               <Tag
                  color="select"
                  onClick={value => {
                     onChange(value, field);
                  }}
                  value={field.value.includes(options[0].value)}>
                  {options[0].label}
               </Tag>
            );
         }}
      />
   );
};

export default ControllerFieldTagCheckbox;
