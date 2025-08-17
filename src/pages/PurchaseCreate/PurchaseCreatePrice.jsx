import React, { useContext } from 'react';
import { PurchaseCreateContext } from '../../context';
import { calcPropsOptions, calcPropsOptionsValues } from '../../data/selectsField';
import isEmptyArrObj from '../../helpers/isEmptyArrObj';
import { ControllerFieldInput } from '../../uiForm/ControllerFields/ControllerFieldInput';
import ControllerFieldTagsCalcProp from '../../uiForm/ControllerFields/ControllerFieldTagsCalcProp';

const PurchaseCreatePrice = () => {
   const { control, errors, isEdit, defaultData, calcPropsWatch } = useContext(PurchaseCreateContext);

   return (
      <div data-block="price">
         <h2 className="title-2 mb-6">Способ покупки и цена</h2>
         <div className="grid grid-cols-2 gap-4 md3:grid-cols-1">
            <div className="mmd3:col-span-2">
               <ControllerFieldTagsCalcProp
                  name="calc_props"
                  required
                  defaultValue={
                     isEdit ? calcPropsOptions.filter(item => defaultData.pricing_attributes.includes(item.label)).map(item => item.value) : []
                  }
               />
            </div>
            {calcPropsWatch && !isEmptyArrObj(calcPropsWatch) && (
               <>
                  {calcPropsWatch.find(i => i === calcPropsOptionsValues.cash) && (
                     <ControllerFieldInput
                        onlyNumber
                        convertNumber
                        maxLength={13}
                        beforeText="Стоимость объекта"
                        afterText="₽"
                        name="object_price"
                        control={control}
                        requiredValue={`${!isEmptyArrObj(calcPropsWatch) ? 'Обязательное поле' : ''}`}
                        errors={errors}
                        defaultValue={isEdit && defaultData?.price_type === 'object_price_from' ? defaultData?.price : ''}
                        disabled={isEmptyArrObj(calcPropsWatch)}
                     />
                  )}
                  {calcPropsWatch.find(
                     i =>
                        i === calcPropsOptionsValues.mortgage_approval_bank ||
                        i === calcPropsOptionsValues.mortgage_no_approval_bank ||
                        i === calcPropsOptionsValues.installment_plan
                  ) && (
                     <>
                        <ControllerFieldInput
                           onlyNumber
                           convertNumber
                           maxLength={11}
                           beforeText="Ежемесячный платёж до"
                           afterText="₽/мес"
                           name="month_payment"
                           control={control}
                           requiredValue="Обязательное поле"
                           errors={errors}
                           defaultValue={isEdit && defaultData?.price_type === 'month_payment' ? defaultData?.price : ''}
                        />
                        {calcPropsWatch.find(i => i === calcPropsOptionsValues.mortgage_approval_bank) && (
                           <div>
                              <ControllerFieldInput
                                 onlyNumber
                                 convertNumber
                                 maxLength={11}
                                 beforeText="Одобренная сумма"
                                 afterText="₽"
                                 name="approved_amount"
                                 control={control}
                                 defaultValue={isEdit && defaultData?.approved_amount ? defaultData.approved_amount : ''}
                              />
                           </div>
                        )}
                        {!calcPropsWatch.find(i => i === calcPropsOptionsValues.no_down_payment) && (
                           <ControllerFieldInput
                              onlyNumber
                              convertNumber
                              maxLength={11}
                              beforeText="Первоначальный взнос"
                              afterText="₽"
                              name="initial_payment"
                              control={control}
                              defaultValue={isEdit && defaultData?.initial_payment ? defaultData.initial_payment : ''}
                           />
                        )}
                     </>
                  )}
                  {calcPropsWatch.find(i => i === calcPropsOptionsValues.certificate) && (
                     <div>
                        <ControllerFieldInput
                           onlyNumber
                           convertNumber
                           maxLength={11}
                           beforeText="Сумма сертификата"
                           afterText="₽"
                           name="certificate_amount"
                           control={control}
                           requiredValue="Обязательное поле"
                           errors={errors}
                           defaultValue={isEdit && defaultData?.certificate_amount ? defaultData.certificate_amount : ''}
                        />
                     </div>
                  )}
               </>
            )}
         </div>
      </div>
   );
};

export default PurchaseCreatePrice;
