import React, { useState } from 'react';
import Modal from '../../../ui/Modal';
import ModalHeader from '../../../ui/Modal/ModalHeader';
import Button from '../../../uiForm/Button';
import { useForm } from 'react-hook-form';
import { ControllerFieldInput } from '../../../uiForm/ControllerFields/ControllerFieldInput';
import { ControllerFieldCheckboxesSingle } from '../../../uiForm/ControllerFields/ControllerFieldCheckbox';
import { sendPostRequest, sendPutRequest } from '../../../api/requestsApi';
import { choiceApartmentsFilterOptions } from '../../../data/selectsField';
import numberReplace from '../../../helpers/numberReplace';
import ChoiceApartmentsFilter from '../../../components/ChoiceApartmentsFilter';

const checkboxes = [
   {
      label: 'По сумме',
      value: 'typeSum',
   },
   {
      label: 'По Количеству',
      value: 'typeQuantity',
   },
];

const CreatePresentGroup = ({ mainData, conditionModal, setModal, frames, fetchData, edit = false, defaultValues = null, title, type = 'main' }) => {
   const {
      handleSubmit,
      control,
      setValue,
      watch,
      reset,
      formState: { errors },
   } = useForm();

   const [filterFields, setFilterFields] = useState(
      defaultValues?.filters_info ? JSON.parse(defaultValues?.filters_info) : choiceApartmentsFilterOptions
   );
   const [selectedApartments, setSelectedApartments] = useState([]);

   const watchTypeSum = watch('typeSum');
   const watchTypeQuantity = watch('typeQuantity');

   const ModalHeaderLayout = () => {
      return (
         <ModalHeader set={setModal} className="px-10 py-6 mb-8">
            <h2 className="title-2">{title}</h2>
         </ModalHeader>
      );
   };

   const ModalFooterLayout = () => {
      return (
         <div className="px-14 py-6">
            <Button onClick={handleSubmit(onSubmitHandler)} className="w-full">
               Сохранить
            </Button>
         </div>
      );
   };

   const onSubmitHandler = data => {
      if (selectedApartments.length === 0) return;

      const resData = {
         building_id: mainData.id,
         filtersInfo: JSON.stringify(filterFields),
      };
      if (type === 'main') {
         resData.type = data.typeSum ? 'sum' : data.typeQuantity ? 'quantity' : null;
         if (!resData.type) return;

         if (resData.type === 'sum') {
            resData.max_sum = data.sum.replace(/ /g, '');
         }
         if (resData.type === 'quantity') {
            resData.count = data.count.replace(/ /g, '');
            resData.sum = data.max_sum.replace(/ /g, '');
         }
      } else {
         resData.is_main_group = true;
      }
      resData.included_apartments = selectedApartments.map(item => item.value);

      if (edit) {
         sendPutRequest(`/admin-api/gift_group/${defaultValues.id}`, resData).then(res => {
            fetchData().then(() => {
               reset();
               setModal(false);
            });
         });
      } else {
         sendPostRequest('/admin-api/gift_group', resData).then(res => {
            fetchData().then(() => {
               reset();
               setModal(false);
            });
         });
      }
   };

   return (
      <Modal
         set={setModal}
         options={{ modalClassNames: 'HeaderSticky', modalContentClassNames: 'flex flex-col !py-0 !px-10 md1:!px-4' }}
         condition={conditionModal}
         style={{
            '--modal-space': '40px',
            '--modal-height': 'calc(var(--vh) - 80px)',
            '--modal-width': '1150px',
         }}
         closeBtn={false}
         ModalHeader={ModalHeaderLayout}
         ModalFooter={ModalFooterLayout}>
         {type === 'main' && (
            <div className="mb-6">
               <h3 className="title-3">Выберите тип</h3>
               <div className="mt-4 flex items-center gap-8">
                  <ControllerFieldCheckboxesSingle
                     control={control}
                     setValue={setValue}
                     checkboxes={checkboxes}
                     defaultValue={
                        edit && defaultValues
                           ? !defaultValues.count
                              ? checkboxes.find(item => item.value === 'typeSum')
                              : checkboxes.find(item => item.value === 'typeQuantity')
                           : {}
                     }
                  />
               </div>
               {watchTypeSum && (
                  <div className="flex gap-2 mt-4">
                     <ControllerFieldInput
                        control={control}
                        beforeText="Введите сумму"
                        onlyNumber
                        convertNumber
                        afterText="₽"
                        name="sum"
                        requiredValue
                        errors={errors}
                        defaultValue={edit && defaultValues?.max_sum ? numberReplace(defaultValues.max_sum || 0) : ''}
                     />
                  </div>
               )}
               {watchTypeQuantity && (
                  <div className="flex gap-2 mt-4">
                     <ControllerFieldInput
                        control={control}
                        beforeText="Введите количество"
                        onlyNumber
                        afterText="шт."
                        name="count"
                        maxLength={3}
                        requiredValue
                        errors={errors}
                        defaultValue={edit && defaultValues?.count ? defaultValues.count : ''}
                     />
                     <ControllerFieldInput
                        control={control}
                        beforeText="Введите максимальную сумму"
                        afterText="₽"
                        name="max_sum"
                        onlyNumber
                        convertNumber
                        requiredValue
                        errors={errors}
                        defaultValue={edit && defaultValues?.sum ? numberReplace(defaultValues.sum || 0) : ''}
                     />
                  </div>
               )}
            </div>
         )}
         <ChoiceApartmentsFilter
            building_id={mainData.id}
            frames={frames}
            setData={setSelectedApartments}
            defaultValue={defaultValues ? defaultValues.included_apartments : []}
            filterFields={filterFields}
            setFilterFields={setFilterFields}
         />
      </Modal>
   );
};

export default CreatePresentGroup;
