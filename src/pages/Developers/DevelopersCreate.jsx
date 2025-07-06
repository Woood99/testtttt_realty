import React, { useEffect, useState } from 'react';
import Button from '../../uiForm/Button';
import { ControllerFieldInput } from '../../uiForm/ControllerFields/ControllerFieldInput';
import { useForm } from 'react-hook-form';
import { ControllerFieldTextarea } from '../../uiForm/ControllerFields/ControllerFieldTextarea';
import { ControllerFieldMultiSelect } from '../../uiForm/ControllerFields/ControllerFieldMultiSelect';
import { useSelector } from 'react-redux';
import Tabs from '../../ui/Tabs';
import { ControllerPhoto, ControllerVideo } from '../../uiForm/ControllerFields/ControllerFiles';
import FieldInput from '../../uiForm/FieldInput';
import { refactPhotoStageAppend, refactPhotoStageOne, refactPhotoStageTwo } from '../../helpers/photosRefact';
import { getDataRequest, sendPostRequest } from '../../api/requestsApi';
import { useParams } from 'react-router-dom';
import { PrivateRoutesPath, RoutesPath } from '../../constants/RoutesPath';
import { getCitiesSelector } from '../../redux/helpers/selectors';

const DevelopersCreate = ({ edit = false }) => {
   const params = useParams();
   const citiesData = useSelector(getCitiesSelector);

   const [isInit, setIsInit] = useState(false);

   const { handleSubmit, control } = useForm();

   const [defaultValues, setDefaultValues] = useState(null);

   useEffect(() => {
      if (edit) {
         getDataRequest(`/api/developers/${params.id}`).then(res => {
            setDefaultValues({
               ...res.data,
               image: res.data.photoUrl ? { id: 1, image: res.data.photoUrl } : null,
               photos: res.data.photos
                  ? res.data.photos.map((item, index) => {
                       return { id: index, image: item };
                    })
                  : [],
            });
            setIsInit(true);
         });
      } else {
         setIsInit(true);
      }
   }, []);

   const onSubmitHandler = data => {
      const resData = {
         name: data.name,
         city: data.city.map(item => item.value),
         year: data.year,

         building_houses: data.building_houses,
         ready_houses: data.ready_houses,

         descr: data.descr,

         image: data.photo,
         photos: data.photos,
         video: data.video?.map(item => item.file),
      };

      const formData = new FormData();

      resData.image = refactPhotoStageOne(resData.image);
      resData.photos = refactPhotoStageOne(resData.photos);

      refactPhotoStageAppend(resData.image, formData);
      refactPhotoStageAppend(resData.photos, formData);

      resData.image = refactPhotoStageTwo(resData.image);
      resData.photos = refactPhotoStageTwo(resData.photos);

      resData.image = resData.image[0] || null;

      formData.append('data', JSON.stringify(resData));
      if (edit) {
         formData.append('_method', 'PUT');
      }

      console.log(resData);

      for (let pair of formData.entries()) {
         console.log(pair[0] + ': ' + pair[1]);
      }

      if (edit) {
         sendPostRequest(`/admin-api/developers/${params.id}`, formData, { 'Content-Type': 'multipart/form-data' }).then(() => {
            window.location.reload();
         });
      } else {
         sendPostRequest('/admin-api/developers/create', formData, { 'Content-Type': 'multipart/form-data' }).then(() => {
            window.location.href = RoutesPath.developers.list;
         });
      }
   };

   if (!isInit || citiesData.length === 0) return;

   return (
      <main className="main">
         <div className="main-wrapper--title">
            <div className="container">
               <h2 className="title-2">{!edit ? 'Создать застройщика' : 'Редактировать застройщика'}</h2>
               <form className="mt-6" onSubmit={handleSubmit(onSubmitHandler)}>
                  <div className="white-block">
                     <h2 className="title-2 mb-6">Параметры</h2>
                     <div className="max-w-[400px] mb-2">
                        <ControllerFieldInput
                           control={control}
                           beforeText="Название застройщика"
                           name="name"
                           defaultValue={edit ? defaultValues?.name : ''}
                        />
                     </div>
                     <div className="grid grid-cols-2 gap-2">
                        <ControllerFieldMultiSelect
                           name="city"
                           control={control}
                           nameLabel="Регион работы"
                           defaultValue={
                              edit
                                 ? citiesData
                                      .map(item => {
                                         return {
                                            label: item.name,
                                            value: item.id,
                                         };
                                      })
                                      .filter(item => defaultValues.cities.includes(item.value))
                                 : []
                           }
                           options={citiesData.map(item => {
                              return { label: item.name, value: item.id };
                           })}
                        />
                        <ControllerFieldInput
                           control={control}
                           beforeText="Год основания"
                           name="year"
                           maxLength={4}
                           onlyNumber
                           convertNumber
                           defaultValue={edit && defaultValues.year ? defaultValues.year : ''}
                        />
                        <FieldInput>
                           <ControllerFieldInput
                              control={control}
                              beforeText="Строиться"
                              afterText="домов"
                              name="building_houses"
                              maxLength={4}
                              onlyNumber
                              defaultValue={edit && defaultValues.building_houses ? defaultValues.building_houses : ''}
                           />
                        </FieldInput>
                        <FieldInput>
                           <ControllerFieldInput
                              control={control}
                              beforeText="Сдано"
                              afterText="домов"
                              name="ready_houses"
                              maxLength={4}
                              onlyNumber
                              defaultValue={edit && defaultValues?.ready_houses ? defaultValues.ready_houses : ''}
                           />
                        </FieldInput>
                     </div>
                  </div>
                  <div className="white-block mt-4">
                     <h2 className="title-2 mb-6">Описание</h2>
                     <ControllerFieldTextarea
                        control={control}
                        maxLength={3000}
                        name="descr"
                        placeholder="Введите описание"
                        defaultValue={edit && defaultValues.description ? defaultValues.description : ''}
                     />
                  </div>
                  <div className="white-block mt-4">
                     <h2 className="title-2 mb-6">Логотип</h2>
                     <ControllerPhoto
                        control={control}
                        name="photo"
                        multiple={false}
                        defaultValue={edit && defaultValues.image ? [defaultValues.image] : []}
                     />
                  </div>
                  <div className="white-block mt-4">
                     <h2 className="title-2 mb-6">Фото</h2>
                     <Tabs
                        data={[
                           {
                              name: 'Фото',
                              body: <ControllerPhoto control={control} name="photos" defaultValue={edit ? defaultValues.photos : []} />,
                           },
                           {
                              name: 'Видео',
                              body: <ControllerVideo control={control} name="video" />,
                           },
                        ]}
                     />
                  </div>
                  <Button className="mt-8 w-full">Сохранить</Button>
               </form>
            </div>
         </div>
      </main>
   );
};

export default DevelopersCreate;
