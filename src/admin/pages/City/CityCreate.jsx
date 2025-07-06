import React, { useState } from 'react';
import { ControllerFieldInput } from '../../../uiForm/ControllerFields/ControllerFieldInput';
import { useForm } from 'react-hook-form';
import { ElementTitleSubtitle } from '../../../ui/Elements';
import Button from '../../../uiForm/Button';
import { sendPostRequest } from '../../../api/requestsApi';
import { PrivateRoutesPath } from '../../../constants/RoutesPath';
import MapSetPlacemark from '../../../components/MapSetPlacemark';

const CityCreate = () => {
   const {
      handleSubmit,
      control,
      formState: { errors },
   } = useForm();

   const [dataGeo, setDataGeo] = useState([]);

   const onSubmitHandler = data => {
      const resData = {
         ...data,
         latitude: dataGeo[0]?.toString() || null,
         longitude: dataGeo[1]?.toString() || null,
      };
      sendPostRequest('/admin-api/cities/create', resData).then(res => {
         if (res.data.success) {
            window.location.href = `${PrivateRoutesPath.cities.list}`;
         }
      });
   };

   return (
      <main className="main">
         <div className="main-wrapper--title">
            <div className="container">
               <ElementTitleSubtitle>
                  Создать <span>город</span>
               </ElementTitleSubtitle>
            </div>
            <div className="mt-6">
               <div className="container">
                  <form onSubmit={handleSubmit(onSubmitHandler)}>
                     <div className="white-block">
                        <h2 className="title-2 mb-6">Параметры</h2>
                        <div className="max-w-[400px]">
                           <ControllerFieldInput control={control} beforeText="Название" name="name" errors={errors} requiredValue />
                        </div>
                        <h2 className="title-2 mt-8 mb-4">Укажите центр города на карте</h2>
                        <MapSetPlacemark data={dataGeo} setData={setDataGeo} zoom={8} />
                     </div>
                     <Button className="mt-8 w-full">Сохранить</Button>
                  </form>
               </div>
            </div>
         </div>
      </main>
   );
};

export default CityCreate;
