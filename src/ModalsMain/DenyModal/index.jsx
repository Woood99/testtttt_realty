import React from 'react';

import Modal from '../../ui/Modal';
import { ControllerFieldCheckboxesSingle, getCurrentCheckboxesSingle } from '../../uiForm/ControllerFields/ControllerFieldCheckbox';
import { useForm } from 'react-hook-form';
import { ControllerFieldTextarea } from '../../uiForm/ControllerFields/ControllerFieldTextarea';
import Button from '../../uiForm/Button';

const DenyModal = ({ condition, set, onSubmit }) => {
   const { handleSubmit, control, setValue } = useForm();

   const checkboxes = ['Не подходит время', 'Объект под задатком', 'Объект продан, снимаю объявление с продажи', 'Другое'].map(item => {
      return {
         label: item,
         value: item,
      };
   });

   const onSubmitHandler = data => {
      const resData = {
         cause: getCurrentCheckboxesSingle(checkboxes, data),
         description: data.description,
      };
      onSubmit(resData);
   };

   return (
      <Modal options={{ overlayClassNames: '_right', modalClassNames: '!w-[600px]' }} set={set} condition={condition}>
         <form onSubmit={handleSubmit(onSubmitHandler)}>
            <h3 className="title-3">Укажите параметры по которым вы не сможете показать объект</h3>
            <p className="mt-4 text-small">
               Это поможет менеджерам и собственникам делать более точное предложение и не предлагать вам объект, который не подходит под ваши пожелания.
            </p>
            <div className="mt-6 flex flex-col gap-3">
               <ControllerFieldCheckboxesSingle control={control} setValue={setValue} checkboxes={checkboxes} />
            </div>
            <h3 className="title-3 mt-6 mb-3">Комментарий</h3>
            <ControllerFieldTextarea control={control} maxLength={4000} name="description" placeholder="Расскажите подробнее в чем проблема" />
            <Button className="mt-6 w-full">Отправить</Button>
         </form>
      </Modal>
   );
};

export default DenyModal;
