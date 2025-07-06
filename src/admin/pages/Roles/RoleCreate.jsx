import React from 'react';
import { ElementTitleSubtitle } from '../../../ui/Elements';
import Button from '../../../uiForm/Button';
import { ControllerFieldInput } from '../../../uiForm/ControllerFields/ControllerFieldInput';
import { useForm } from 'react-hook-form';

const RoleCreate = () => {
   const {
      handleSubmit,
      control,
      formState: { errors },
   } = useForm();

   const onSubmitHandler = data => {
   };

   return (
      <main className="main mt-6">
         <div className="container">
            <ElementTitleSubtitle>
               Создать <span>роль</span>
            </ElementTitleSubtitle>
         </div>
         <div className="bg-pageColor pt-4 mt-6 pb-6">
            <div className="container">
               <form onSubmit={handleSubmit(onSubmitHandler)}>
                  <div className="white-block">
                     <h2 className="title-2 mb-6">Параметры</h2>
                     <div className="max-w-[400px]">
                        <ControllerFieldInput control={control} beforeText="Название" name="name" requiredValue errors={errors} />
                     </div>
                  </div>
                  <Button className="mt-8 w-full">Сохранить</Button>
               </form>
            </div>
         </div>
      </main>
   );
};

export default RoleCreate;
