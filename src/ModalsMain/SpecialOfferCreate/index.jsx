import React, { useEffect, useState } from 'react';
import dayjs from 'dayjs';

import Modal from '../../ui/Modal';
import Button from '../../uiForm/Button';

import styles from './SpecialOfferCreate.module.scss';
import { ControllerFieldSelect } from '../../uiForm/ControllerFields/ControllerFieldSelect';
import { useForm } from 'react-hook-form';
import { ControllerFieldInput } from '../../uiForm/ControllerFields/ControllerFieldInput';

import convertToDate from '../../helpers/convertToDate';
import { ControllerFieldMultiSelect } from '../../uiForm/ControllerFields/ControllerFieldMultiSelect';
import { getDataRequest, sendPostRequest } from '../../api/requestsApi';
import { useSelector } from 'react-redux';
import { ControllerFieldCheckboxesSingle } from '../../uiForm/ControllerFields/ControllerFieldCheckbox';
import { SpinnerForBtn } from '../../ui/Spinner';
import { getFrames } from '../../api/other/getFrames';
import ChoiceApartmentsFilter from '../../components/ChoiceApartmentsFilter';
import { choiceApartmentsFilterOptions } from '../../data/selectsField';
import isEmptyArrObj from '../../helpers/isEmptyArrObj';
import CardSmall from '../../ui/CardSmall';
import { getIsDesktop } from '../../redux/helpers/selectors';

const checkboxes = [
   {
      label: 'ЖК',
      value: 'complex',
   },
   {
      label: 'Квартиры',
      value: 'apartments',
   },
];

const SpecialOfferCreate = ({ condition, set, id, defaultRecipient = null, defaultBuilding = null, request = null }) => {
   const {
      handleSubmit,
      control,
      watch,
      setValue,
      reset,
      formState: { errors },
   } = useForm();

   const [typeOptions, setTypeOptions] = useState([
      {
         label: 'Скидка в рублях',
         value: 'price',
      },
      {
         label: 'Скидка в процентах',
         value: 'percent',
      },
   ]);

   const isDesktop = useSelector(getIsDesktop);

   const typeWatch = watch('type');
   const complexTypeWatch = watch('complex');
   const apartmentsTypeWatch = watch('apartments');

   const discountPriceWatch = watch('discount-price');
   const discountPrcWatch = watch('discount-percent');
   const specialConditionWatch = watch('special-condition');

   const [selectedApartments, setSelectedApartments] = useState([]);

   const [frames, setFrames] = useState([]);

   const dateEndWatch = watch('date');

   const [recipients, setRecipients] = useState([]);
   const [specialCondition, setSpecialCondition] = useState([]);

   const [requestIsLoading, setRequestIsLoading] = useState(false);

   const [filterFields, setFilterFields] = useState(choiceApartmentsFilterOptions);

   const defaultRecipientData = defaultRecipient
      ? {
           label: `${defaultRecipient.name || ''} ${defaultRecipient.surname || ''}`,
           value: defaultRecipient.id,
           image: defaultRecipient.image || 'default',
        }
      : {};

   useEffect(() => {
      setValue('type', typeOptions[0]);
      getDataRequest(`/api/special-condition/building/${id}`).then(res => {
         setSpecialCondition(res.data);
         if (res.data.length > 0) {
            setTypeOptions(prev => [
               ...prev,
               {
                  label: 'Специальное условие',
                  value: 'special-condition',
               },
            ]);
         }
      });
      if (isEmptyArrObj(defaultRecipientData)) {
         getDataRequest(`/seller-api/expanded-metrics`, { type: 'users', building_id: id }).then(res => {
            console.log(res);

            setRecipients(res.data);
         });
      }
      getFrames(id).then(res => {
         setFrames(res);
      });
   }, []);

   const onSubmitHandler = data => {
      const resData = {
         users: data.users.map(item => item.value),
         type: data.type.value,
         discountable_type: data.complex ? 'building' : data.apartments ? 'apartment' : null,
         discountable_ids: data.complex ? [id] : data.apartments ? selectedApartments.map(item => item.value) : null,
         discount: data.type.value === 'price' ? data['discount-price'] : data['discount-percent'],
         'special-condition': data.type.value === 'special-condition' ? data['special-condition'].value : null,
         valid_till: data.date,
      };
      if (defaultRecipient && defaultBuilding) {
         resData.discountable_ids = [defaultBuilding.id];
         resData.discountable_type = 'building';
      } else {
         if (!resData.discountable_type) return;
      }

      if (resData['discount-price'] === null) delete resData['discount-price'];
      if (resData['discount-percent'] === null) delete resData['discount-percent'];
      if (resData['special-condition'] === null) delete resData['special-condition'];

      setRequestIsLoading(true);
      sendPostRequest('/seller-api/special-offers/send', resData).then(res => {
         reset();
         setRequestIsLoading(false);
         set(false);
         if (request) request();
      });
   };

   return (
      <Modal options={{ overlayClassNames: '_right', modalClassNames: styles.SpecialOfferCreateRoot }} set={set} condition={condition}>
         <form onSubmit={handleSubmit(onSubmitHandler)} className="grid mmd1:grid-cols-[350px_1fr] gap-8">
            <div>
               <h3 className="title-2">Специальное предложение</h3>
               <p className="mt-4">Отправим его тем, кто интересовался вашим объявлением, но пока не связался с вами.</p>
               <div className="mt-6 flex flex-col gap-6">
                  <ControllerFieldMultiSelect
                     control={control}
                     nameLabel="Получатели"
                     options={
                        defaultRecipient
                           ? [defaultRecipientData]
                           : recipients.map(item => {
                                return {
                                   label: `${item.name} ${item.surname}`,
                                   value: item.id,
                                   image: item.image || 'default',
                                };
                             })
                     }
                     name="users"
                     search
                     btnsActions
                     searchLabel="Поиск по имени"
                     requiredValue
                     errors={errors}
                     disabled={!isEmptyArrObj(defaultRecipientData)}
                     defaultValue={defaultRecipient ? [defaultRecipientData] : []}
                  />
                  {defaultBuilding ? (
                     <CardSmall
                        data={{
                           ...defaultBuilding,
                           title: defaultBuilding.name || defaultBuilding.title,
                        }}
                     />
                  ) : (
                     <>
                        <div className="flex items-center gap-4">
                           <ControllerFieldCheckboxesSingle
                              control={control}
                              setValue={setValue}
                              checkboxes={checkboxes}
                              defaultValue={checkboxes[0]}
                           />
                        </div>
                        {Boolean(apartmentsTypeWatch) && (
                           <ChoiceApartmentsFilter
                              building_id={id}
                              frames={frames}
                              setData={setSelectedApartments}
                              title=""
                              className="!flex !flex-col"
                              areaField={false}
                              filterFields={filterFields}
                              setFilterFields={setFilterFields}
                           />
                        )}
                     </>
                  )}

                  <ControllerFieldSelect
                     control={control}
                     nameLabel="Тип предложения"
                     options={typeOptions}
                     name="type"
                     requiredValue
                     errors={errors}
                  />
                  {typeWatch?.value === 'price' && (
                     <ControllerFieldInput
                        control={control}
                        name="discount-price"
                        beforeText="Скидка"
                        afterText="₽"
                        requiredValue
                        errors={errors}
                        onlyNumber
                        convertNumber
                     />
                  )}
                  {typeWatch?.value === 'percent' && (
                     <ControllerFieldInput
                        control={control}
                        name="discount-percent"
                        beforeText="Скидка"
                        afterText="%"
                        requiredValue
                        errors={errors}
                        onlyNumberSemicolon
                        maxLength={4}
                     />
                  )}
                  {typeWatch?.value === 'special-condition' && (
                     <ControllerFieldSelect
                        control={control}
                        nameLabel="Специальное условие"
                        options={specialCondition.map(item => {
                           return {
                              value: item.id,
                              label: item.name,
                           };
                        })}
                        name="special-condition"
                        requiredValue
                        errors={errors}
                     />
                  )}
                  <ControllerFieldInput control={control} datePicker={true} beforeText="Срок действия до" name="date" requiredValue errors={errors} />
               </div>

               <Button className="mt-4 w-full" disabled={requestIsLoading}>
                  {requestIsLoading ? <SpinnerForBtn size={16} variant="second" /> : 'Отправить предложение'}
               </Button>
            </div>
            {isDesktop && (
               <div>
                  <h3 className="title-3">Покупатели получат такое сообщение</h3>
                  <div className="white-block-small mt-6">
                     <p>
                        Продавец предлагает вам&nbsp;
                        {typeWatch?.value === 'price' && `скидку ${discountPriceWatch || 0} ₽`}
                        {typeWatch?.value === 'percent' && `скидку ${discountPrcWatch || 0} %`}
                        {typeWatch?.value === 'special-condition' && `${specialConditionWatch?.label || ''}`}. Это потому, что вы интересовались его
                        объявлением.
                     </p>
                     <p className="mt-3">
                        Если вам интересно это предложение, нажмите кнопку ниже. <br /> Оно будет действовать до&nbsp;
                        {dateEndWatch
                           ? `${dayjs(convertToDate(dateEndWatch, 'DD-MM-YYYY'), 'DD.MM.YYYY').format('D MMMM')} включительно — до 23:59 по Москве. `
                           : '...'}
                     </p>
                  </div>
               </div>
            )}
         </form>
      </Modal>
   );
};

export default SpecialOfferCreate;
