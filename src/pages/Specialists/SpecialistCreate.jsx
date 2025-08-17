import React, { useEffect, useState } from 'react';
import Button from '../../uiForm/Button';
import { ControllerFieldInput, ControllerFieldInputPhone } from '../../uiForm/ControllerFields/ControllerFieldInput';
import { useForm } from 'react-hook-form';
import { ControllerFieldTextarea } from '../../uiForm/ControllerFields/ControllerFieldTextarea';
import { ControllerFieldMultiSelect } from '../../uiForm/ControllerFields/ControllerFieldMultiSelect';
import { useSelector } from 'react-redux';
import { getDataRequest, sendPostRequest, sendPutRequest } from '../../api/requestsApi';
import { rolesItems } from '../../admin/pages/Roles/RolesList';
import { ControllerFieldSelect } from '../../uiForm/ControllerFields/ControllerFieldSelect';
import Tabs from '../../ui/Tabs';
import { ControllerPhoto, ControllerVideo } from '../../uiForm/ControllerFields/ControllerFiles';
import { refactPhotoStageAppend, refactPhotoStageOne, refactPhotoStageTwo } from '../../helpers/photosRefact';
import { PrivateRoutesPath, RoutesPath } from '../../constants/RoutesPath';
import { useParams } from 'react-router-dom';
import getSrcImage from '../../helpers/getSrcImage';
import { getCitiesSelector } from '@/redux';

const SpecialistCreate = ({ edit = false }) => {
   const params = useParams();

   const {
      handleSubmit,
      control,
      watch,
      resetField,
      formState: { errors },
      reset,
      setValue,
   } = useForm();

   const citiesData = useSelector(getCitiesSelector);

   const [developers, setDevelopers] = useState([]);
   const [complexes, setComplexes] = useState([]);

   const [types, setTypes] = useState([]);

   const [defaultValues, setDefaultValues] = useState(null);
   const [isInit, setIsInit] = useState(false);

   useEffect(() => {
      if (edit) {
         getDataRequest(`/api/specialists/${params.id}`).then(res => {
            setDefaultValues({
               ...res.data,
               phone: res.data.phone[0] === '7' ? `+${res.data.phone}` : res.data.phone,
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

   useEffect(() => {
      getDataRequest('/api/object-types').then(res => {
         if (!res.data) return;
         setTypes(res.data);
      });
   }, []);

   const watchCity = watch('city');
   const watchDeveloper = watch('developer');

   useEffect(() => {
      if (!watchCity?.value) return;

      sendPostRequest('/api/developers/all', { city: watchCity.value })
         .then(res => {
            setDevelopers(
               res.data.map(item => {
                  return {
                     label: item.name,
                     value: item.id,
                     avatar: item.photo,
                  };
               })
            );
         })
         .finally(() => {
            setValue('developer', {});
            setValue('complex', []);
         });
   }, [watchCity]);

   useEffect(() => {
      if (!watchDeveloper?.value) return;

      sendPostRequest('/api/developers/complexes', { developer_ids: [watchDeveloper.value] })
         .then(res => {
            setComplexes(res.data);
         })
         .catch(() => {
            setComplexes([]);
         })
         .finally(() => {
            setValue('complex', []);
         });
   }, [watchDeveloper]);

   const onSubmitHandler = data => {
      const resData = {
         role: 'seller',
         developer: data.developer?.value,
         complex: data.complex?.map(item => item.value),
         city: data.city.value ? [data.city.value] : [],
         type: data.type.map(item => item.value),
         experience: data.experience,

         descr: data.descr,

         surname: data.surname.trim(),
         name: data.name.trim(),
         father_name: data.father_name.trim(),
         phone: data.phone.slice(1),
         email: data.email,
         password: data.password,

         image: data.image,
         photos: data.photos,
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
         sendPostRequest(`/admin-api/specialists/${params.id}`, formData, { 'Content-Type': 'multipart/form-data' }).then(() => {
            window.location.reload();
         });
      } else {
         sendPostRequest('/admin-api/specialists', formData, { 'Content-Type': 'multipart/form-data' }).then(() => {
            window.location.href = RoutesPath.specialists.list;
         });
      }
   };

   if (!isInit) return;

   return (
      <main className="main">
         <div className="main-wrapper--title">
            <div className="container">
               <h2 className="title-2">{!edit ? 'Создать менеджера' : 'Редактировать менеджера'}</h2>
            </div>
            <form className=" mt-6 container" onSubmit={handleSubmit(onSubmitHandler)}>
               <div className="white-block">
                  <h2 className="title-2 mb-6">Параметры</h2>
                  <div className="flex flex-col gap-2">
                     <div className="grid grid-cols-3 gap-2">
                        <ControllerFieldSelect
                           name="city"
                           control={control}
                           nameLabel="Регион работы"
                           requiredValue
                           errors={errors}
                           setValue={edit ? setValue : null}
                           defaultValue={
                              edit
                                 ? citiesData
                                      ?.map(item => {
                                         return {
                                            label: item.name,
                                            value: item.id,
                                         };
                                      })
                                      .filter(item => defaultValues.cities.includes(item.value))[0]
                                 : []
                           }
                           options={citiesData.map(item => {
                              return { label: item.name, value: item.id };
                           })}
                        />
                        <ControllerFieldSelect
                           name="developer"
                           control={control}
                           nameLabel="Застройщик"
                           options={developers}
                           defaultValue={edit && developers.length ? developers.find(item => item.label === defaultValues.agency) : {}}
                           search
                           requiredValue
                           errors={errors}
                           setValue={edit ? setValue : null}
                        />
                        <ControllerFieldMultiSelect
                           name="complex"
                           control={control}
                           nameLabel="Комплекс"
                           options={complexes}
                           defaultValue={edit && complexes.length ? complexes.filter(item => defaultValues.objects_ids.includes(item.value)) : []}
                           search
                           btnsActions
                           requiredValue
                           errors={errors}
                           setValue={setValue}
                        />
                     </div>
                     <div className="grid grid-cols-3 gap-2">
                        <ControllerFieldMultiSelect
                           name="type"
                           control={control}
                           nameLabel="Направление"
                           requiredValue
                           errors={errors}
                           defaultValue={
                              edit
                                 ? types
                                      .map(item => {
                                         return {
                                            label: item.name,
                                            value: item.id,
                                         };
                                      })
                                      .filter(item => defaultValues.types.includes(item.value))
                                 : []
                           }
                           options={types.map(item => {
                              return { label: item.name, value: item.id };
                           })}
                        />
                        <ControllerFieldInput
                           control={control}
                           beforeText="Стаж"
                           afterText="лет"
                           name="experience"
                           onlyNumber
                           convertNumber
                           maxLength={3}
                           defaultValue={edit && defaultValues.experience ? defaultValues.experience : ''}
                        />
                     </div>
                  </div>
               </div>
               <div className="white-block mt-4">
                  <h2 className="title-2 mb-6">О себе</h2>
                  <ControllerFieldTextarea
                     control={control}
                     maxLength={3000}
                     name="descr"
                     placeholder="Введите описание"
                     defaultValue={edit && defaultValues.description ? defaultValues.description : ''}
                  />
               </div>
               <div className="white-block mt-4">
                  <h2 className="title-2 mb-6">Контакты</h2>
                  <div className="grid grid-cols-4 gap-2">
                     <ControllerFieldInput
                        control={control}
                        beforeText="Фамилия"
                        name="surname"
                        requiredValue
                        errors={errors}
                        defaultValue={edit ? defaultValues.surname : ''}
                     />
                     <ControllerFieldInput
                        control={control}
                        beforeText="Имя"
                        name="name"
                        requiredValue
                        errors={errors}
                        defaultValue={edit ? defaultValues.name : ''}
                     />
                     <ControllerFieldInput control={control} beforeText="Отчество" name="father_name" />
                     <ControllerFieldInputPhone
                        control={control}
                        requiredValue={!edit}
                        errors={!edit ? errors : null}
                        defaultValue={edit ? defaultValues.phone : ''}
                     />
                     <ControllerFieldInput control={control} beforeText="Email" name="email" defaultValue={edit ? defaultValues.email || '' : ''} />
                     <ControllerFieldInput control={control} beforeText="Пароль" name="password" type="password" readOnly disabled={edit} />
                  </div>
               </div>
               <div className="white-block mt-4">
                  <h2 className="title-2 mb-6">Аватарка</h2>
                  <ControllerPhoto
                     control={control}
                     name="image"
                     defaultValue={edit && defaultValues.image ? [defaultValues.image] : []}
                     multiple={false}
                  />
               </div>
               <div className="white-block mt-4">
                  <h2 className="title-2 mb-6">Дипломы и награды</h2>
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
      </main>
   );
};

export default SpecialistCreate;
