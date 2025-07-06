import React, { useEffect, useState } from 'react';
import { ControllerFieldInput } from '../../../uiForm/ControllerFields/ControllerFieldInput';
import { useForm } from 'react-hook-form';
import { ElementTitleSubtitle } from '../../../ui/Elements';
import Button from '../../../uiForm/Button';
import { useSelector } from 'react-redux';
import { getDataRequest, sendPostRequest } from '../../../api/requestsApi';
import { ControllerFieldCheckbox } from '../../../uiForm/ControllerFields/ControllerFieldCheckbox';
import { ControllerFieldSelect } from '../../../uiForm/ControllerFields/ControllerFieldSelect';
import { useNavigate } from 'react-router-dom';
import { PrivateRoutesPath } from '../../../constants/RoutesPath';
import { ControllerPhoto } from '../../../uiForm/ControllerFields/ControllerFiles';
import { refactPhotoStageAppend, refactPhotoStageOne, refactPhotoStageTwo } from '../../../helpers/photosRefact';
import isEmptyArrObj from '../../../helpers/isEmptyArrObj';
import { getCitiesSelector } from '../../../redux/helpers/selectors';

const TagCreate = ({ type = 'tag' }) => {
   const citiesItems = useSelector(getCitiesSelector);
   const navigate = useNavigate();

   const [types, setTypes] = useState([]);

   const {
      handleSubmit,
      control,
      formState: { errors },
   } = useForm();

   useEffect(() => {
      getDataRequest('/api/object-types').then(res => {
         if (!res.data) return;
         setTypes(res.data);
      });
   }, []);

   const onSubmitHandler = data => {
      const resData = {
         name: data.name,
         city: data.city.label,
         types: [],
         is_sticker: type === 'sticker',
         is_advantage: type === 'advantage',
         image: data.image || null,
         link: data.link,
      };

      types.forEach(type => {
         if (data[type.name]) {
            resData.types.push(type.id);
         }
      });

      const formData = new FormData();
      if (resData.image && !isEmptyArrObj(data.image)) {
         resData.image = refactPhotoStageOne(resData.image);
         refactPhotoStageAppend(resData.image, formData);
         resData.image = refactPhotoStageTwo(resData.image);
         resData.image = resData.image[0];
      } else {
         resData.image = null;
      }

      formData.append('data', JSON.stringify(resData));
      console.log(resData);

      if (resData.types.length !== 0) {
         sendPostRequest('/admin-api/tags/create', formData, { 'Content-Type': 'multipart/form-data' }).then(res => {
            navigate(`${PrivateRoutesPath.tags.list}?type=${type}s`);
         });
      }
   };

   return (
      <main className="main">
         <div className="main-wrapper--title">
            <div className="container">
               <ElementTitleSubtitle>
                  Создать
                  <span className="ml-2">
                     {type === 'tag' ? 'тег' : type === 'sticker' ? 'стикер' : type === 'advantage' ? 'уникальное преимущество объекта' : ''}
                  </span>
               </ElementTitleSubtitle>
            </div>
            <div className="mt-6">
               <div className="container">
                  <form onSubmit={handleSubmit(onSubmitHandler)}>
                     <div className="white-block">
                        <h2 className="title-2 mb-6">Параметры</h2>
                        <div className="grid grid-cols-3 gap-3">
                           <ControllerFieldInput control={control} beforeText="Название" name="name" errors={errors} requiredValue />
                           <ControllerFieldSelect
                              name="city"
                              control={control}
                              nameLabel="Город"
                              options={citiesItems.map(item => {
                                 return {
                                    label: item.name,
                                    value: item.id,
                                 };
                              })}
                              search
                              btnsActions
                              errors={errors}
                              requiredValue
                           />
                           <ControllerFieldInput control={control} beforeText="Ссылка на скидку/новость" name="link" />
                        </div>
                        <div className="mt-4 flex items-center gap-8">
                           {types.map(item => {
                              return <ControllerFieldCheckbox key={item.id} control={control} option={{ label: item.name }} name={item.name} />;
                           })}
                        </div>
                        {type === 'advantage' && (
                           <div className="mt-8">
                              <h2 className="title-2 mb-6">Фото</h2>
                              <ControllerPhoto control={control} name="image" multiple={false} />
                           </div>
                        )}
                     </div>
                     <Button className="mt-8 w-full">Сохранить</Button>
                  </form>
               </div>
            </div>
         </div>
      </main>
   );
};

export default TagCreate;
