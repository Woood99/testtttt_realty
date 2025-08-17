import { Controller, useFormContext } from 'react-hook-form';
import cn from 'classnames';

import Tag from '../../ui/Tag';
import { calcPropsOptions, calcPropsOptionsValues } from '../../data/selectsField';
import isEmptyArrObj from '../../helpers/isEmptyArrObj';

const ControllerFieldTagsCalcProp = ({ name = '', defaultValue = [], className, required, options = calcPropsOptions }) => {
   const {
      control,
      setValue,
      formState: { errors },
   } = useFormContext();

   const isValid = errors ? errors[name] : false;

   return (
      <Controller
         name={name}
         control={control}
         defaultValue={defaultValue}
         rules={{
            required,
            validate: value => {
               if (!required) return;
               return !isEmptyArrObj(value);
            },
         }}
         render={({ field }) => {
            return (
               <div data-error={isValid ? isValid.ref.name : undefined} className={cn('flex flex-wrap gap-2', className)}>
                  {options.map((option, index) => {
                     const values = field.value;

                     const disabledConditionMap = {
                        default: option.id !== 1 && option.id !== 2 && option.id !== 3 && option.id !== 6,
                        cash: option.id !== 5 && option.id !== 1,
                        installment_plan: option.id !== 5 && option.id !== 6,
                        mortgage_approval_bank: option.id === 1 || option.id === 3 || option.id === 6,
                        mortgage_no_approval_bank: option.id === 1 || option.id === 2 || option.id === 6,
                     };

                     const disabledCondition = values.includes('cash')
                        ? disabledConditionMap.cash
                        : values.includes('installment_plan')
                        ? disabledConditionMap['installment_plan']
                        : values.includes('mortgage_approval_bank')
                        ? disabledConditionMap['mortgage_approval_bank']
                        : values.includes('mortgage_no_approval_bank')
                        ? disabledConditionMap['mortgage_no_approval_bank']
                        : disabledConditionMap.default;

                     return (
                        <Tag
                           key={index}
                           size="medium"
                           color="select"
                           onClick={value => {
                              const newValue = value
                                 ? [...field.value, option.value]
                                 : field.value.filter(item => item !== option.value && item !== disabledConditionMap[item]);
                              field.onChange(newValue);

                              if (
                                 newValue.length !== 0 &&
                                 !newValue.includes(calcPropsOptionsValues.cash) &&
                                 !newValue.includes(calcPropsOptionsValues.mortgage_approval_bank) &&
                                 !newValue.includes(calcPropsOptionsValues.mortgage_no_approval_bank) &&
                                 !newValue.includes(calcPropsOptionsValues.installment_plan)
                              ) {
                                 setValue(name, []);
                              }
                           }}
                           className={cn(disabledCondition && 'order-1')}
                           value={field.value.includes(option.value)}
                           isError={isValid}
                           disabled={disabledCondition && errors[name] !== values.includes(option.value)}>
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

export default ControllerFieldTagsCalcProp;
