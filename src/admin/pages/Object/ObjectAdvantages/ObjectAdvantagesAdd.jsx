import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useParams } from 'react-router-dom';
import ModalHeader from '../../../../ui/Modal/ModalHeader';
import Button from '../../../../uiForm/Button';
import { sendPostRequest } from '../../../../api/requestsApi';
import { choiceApartmentsFilterOptions, roomsOptions } from '../../../../data/selectsField';
import Modal from '../../../../ui/Modal';
import { ControllerFieldCheckboxesSingle } from '../../../../uiForm/ControllerFields/ControllerFieldCheckbox';
import { ControllerFieldMultiSelect } from '../../../../uiForm/ControllerFields/ControllerFieldMultiSelect';
import ChoiceApartmentsFilter from '../../../../components/ChoiceApartmentsFilter';

const ObjectAdvantagesAdd = ({ conditionModal, setModal, mainData, frames, advantages = [], tags = [] }) => {
   const {
      handleSubmit,
      control,
      setValue,
      watch,
      formState: { errors },
   } = useForm();
   const params = useParams();

   const [selectedApartments, setSelectedApartments] = useState([]);
   const [filterFields, setFilterFields] = useState(choiceApartmentsFilterOptions);

   const typeTagsWatch = watch('type_tags');
   const typeAdvantagesWatch = watch('type_advantages');

   const ModalHeaderLayout = () => {
      return (
         <ModalHeader set={setModal} className="px-10 py-6 mb-8">
            <h2 className="title-2">Добавить теги/уникальные преимущества</h2>
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
      const resData = {
         apartments_ids: selectedApartments.map(item => item.value),
         advantage_ids: data.advantages?.map(item => item.value),
         tag_ids: data.tags?.map(item => item.value),
         filtersInfo: filterFields
      };
      if (data.type_tags) {
         delete resData.advantage_ids;
      }
      if (data.type_advantages) {
         delete resData.tag_ids;
      }
      console.log(resData);

      if (resData.apartments_ids.length) {
         sendPostRequest(`${data.type_advantages ? '/admin-api/massive/advantage/attach' : '/admin-api/massive/tags/attach'}`, resData).then(res => {
            setModal(false);
         });
      } else {
         setModal(false);
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
         <h3 className="title-3">Выберите тип</h3>
         <div className="mt-4 flex items-center gap-8 mb-6">
            <ControllerFieldCheckboxesSingle
               control={control}
               setValue={setValue}
               checkboxes={[
                  {
                     value: 'type_tags',
                     label: 'Теги',
                  },
                  {
                     value: 'type_advantages',
                     label: 'Уникальные преимущества',
                  },
               ]}
            />
         </div>
         {Boolean(typeTagsWatch) && (
            <div className="max-w-[400px] mb-8">
               <ControllerFieldMultiSelect
                  name="tags"
                  control={control}
                  nameLabel="Выбрать тег"
                  options={tags.map(item => {
                     return {
                        value: item.id,
                        label: item.name,
                     };
                  })}
                  errors={errors}
                  requiredValue
                  defaultOption
               />
            </div>
         )}
         {Boolean(typeAdvantagesWatch) && (
            <div className="max-w-[400px] mb-8">
               <ControllerFieldMultiSelect
                  name="advantages"
                  control={control}
                  nameLabel="Выбрать преимущество"
                  options={advantages.map(item => {
                     return {
                        value: item.id,
                        label: item.name,
                     };
                  })}
                  errors={errors}
                  requiredValue
                  defaultOption
               />
            </div>
         )}

         <ChoiceApartmentsFilter
            building_id={params.id}
            frames={frames}
            setData={setSelectedApartments}
            filterFields={filterFields}
            setFilterFields={setFilterFields}
         />
      </Modal>
   );
};

export default ObjectAdvantagesAdd;
