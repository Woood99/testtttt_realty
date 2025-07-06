import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { ElementTitleSubtitle } from '../../../ui/Elements';
import { ControllerFieldInput } from '../../../uiForm/ControllerFields/ControllerFieldInput';
import Button from '../../../uiForm/Button';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { PrivateRoutesPath } from '../../../constants/RoutesPath';
import { sendPostRequest } from '../../../api/requestsApi';

const checkboxes = [
   {
      label: 'Новостройки',
      value: 'new_building',
   },
   {
      label: 'Жилая',
      value: 'living',
   },
];

const TypesCreate = () => {
   const { handleSubmit, control, setValue, getValues, watch } = useForm();
   const navigate = useNavigate();
   const [currentType, setCurrentType] = useState(null);

   const updateData = data => {
      const resData = {
         ...data,
         type: undefined,
      };

      checkboxes.forEach(item => {
         if (data[item.value]) {
            resData.type = item.value;
         }
         delete resData[item.value];
      });

      return resData;
   };

   const onSubmitHandler = data => {
      let resData = updateData(data);
      resData = { name: resData.name };
      if (resData.name === '') return;
      console.log(resData);

      sendPostRequest('/admin-api/object-types/create', resData).then(() => {
         navigate(PrivateRoutesPath.types.list);
      });
   };

   watch(data => {
      const resData = updateData(data);
      setCurrentType(resData.type);
   });

   return (
      <main className="main">
         <div className="main-wrapper--title">
            <div className="container">
               <ElementTitleSubtitle>
                  Создать <span>типы объектов</span>
               </ElementTitleSubtitle>
            </div>
            <div className="mt-6 container">
               <form onSubmit={handleSubmit(onSubmitHandler)}>
                  <div className="white-block">
                     <h2 className="title-2 mb-6">Параметры</h2>
                     <div className="max-w-[400px]">
                        <ControllerFieldInput control={control} beforeText="Название" name="name" />
                     </div>
                     {/* <div className="flex items-center gap-8 mt-6">
                           <ControllerFieldCheckboxesSingle control={control} setValue={setValue} checkboxes={checkboxes} />
                        </div> */}
                  </div>
                  <Button className="mt-8 w-full">Сохранить</Button>
               </form>
            </div>
         </div>
      </main>
   );
};

export default TypesCreate;
