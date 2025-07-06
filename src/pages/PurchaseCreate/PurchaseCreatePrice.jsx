import React, { useContext } from 'react';
import { PurchaseCreateContext } from '../../context';
import { ControllerFieldMultiSelect } from '../../uiForm/ControllerFields/ControllerFieldMultiSelect';
import { calcPropsOptions } from '../../data/selectsField';
import isEmptyArrObj from '../../helpers/isEmptyArrObj';
import { ControllerFieldInput } from '../../uiForm/ControllerFields/ControllerFieldInput';

const PurchaseCreatePrice = () => {
   const { control, errors, isEdit, defaultData, calcPropsWatch, setValue } = useContext(PurchaseCreateContext);

   return (
      <div data-block="price">
         <h2 className="title-2 mb-6">Способ расчёта и цена</h2>
         <div className="grid grid-cols-2 gap-4 md3:grid-cols-1">
            <div className="mmd3:row-start-1">
               <ControllerFieldMultiSelect
                  name="calc_props"
                  nameLabel="Способ расчёта"
                  control={control}
                  calcProp
                  options={calcPropsOptions}
                  defaultValue={
                     isEdit && defaultData?.pricing_attributes
                        ? calcPropsOptions.filter(item => defaultData?.pricing_attributes.includes(item.label))
                        : []
                  }
                  setValue={setValue}
                  errors={errors}
                  requiredValue
                  setValuePermit
               />
            </div>
            {calcPropsWatch && !isEmptyArrObj(calcPropsWatch) && (
               <>
                  {calcPropsWatch.find(i => i.id === 1) && (
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
                  {calcPropsWatch.find(i => i.id === 2 || i.id === 3 || i.id === 6) && (
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
                        {calcPropsWatch.find(i => i.id === 2) && (
                           <div className={`${calcPropsWatch.find(i => i.id === 2) ? 'mmd3:row-start-1 mmd3:row-end-1' : ''}`}>
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
                        {!calcPropsWatch.find(i => i.id === 4) && (
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
                  {calcPropsWatch.find(i => i.id === 5) && (
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
