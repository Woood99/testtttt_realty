import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useGetTagsAllTypes } from '../../../api/other/useGetTags';
import { getApartment } from '../../../api/getApartment';
import { getFrames } from '../../../api/other/getFrames';
import { sendPostRequest } from '../../../api/requestsApi';
import { useParams } from 'react-router-dom';
import { refactPhotoStageAppend, refactPhotoStageOne, refactPhotoStageTwo } from '../../../helpers/photosRefact';
import { useQueryParams } from '../../../hooks/useQueryParams';
import { getBuilding } from '../../../api/getBuilding';
import { PrivateRoutesPath } from '../../../constants/RoutesPath';

export const useApartment = (defaultCreateData = null, type) => {
   const {
      handleSubmit,
      control,
      formState: { errors },
      setValue,
   } = useForm();

   const params = useParams();
   const queryParams = useQueryParams();

   const [data, setData] = useState(type === 'create' ? defaultCreateData : null);
   const [buildingData, setBuildingData] = useState(null);
   const [frames, setFrames] = useState([]);
   const [dataPhotos, setDataPhotos] = useState([]);
   const [customFrame, setCustomFrame] = useState(false);

   const { data: tagsAllData } = useGetTagsAllTypes(true, false, true);
   const tags = tagsAllData.tags?.filter(item => item.city === data?.city || item.city === buildingData?.city) || [];
   const advantages = tagsAllData.advantages?.filter(item => item.city === data?.city || item.city === buildingData?.city) || [];

   useEffect(() => {
      if (type === 'create' && !queryParams.copy) {
         getBuilding(params.objectId).then(res => {
            setBuildingData(res);
         });

         getFrames(params.objectId).then(res => {
            setFrames(res);
         });
      }
      if (type === 'edit' || queryParams.copy) {
         getApartment(params.id || queryParams.copy).then(res => {
            setData({
               id: res.id,
               attributes: res.attributes,
               rooms: res.rooms,
               price: res.price,
               priceOld: res.priceOld,
               area: res.area,
               photos: res.images,
               building_id: res.building_id,
               deadline: res.deadline,
               apartment_tags: res.apartment_tags,
               advantages: res.advantages,
               housing: res.housing,
               floor: res.floor,
               show_cashback_on_homepage: res.show_cashback_on_homepage,
               show_on_homepage: res.show_on_homepage,
               city: res.city,
            });

            setDataPhotos(
               res.images.map((item, index) => {
                  return {
                     id: index,
                     image: item,
                  };
               })
            );

            getFrames(res.building_id).then(res => {
               setFrames(res);
            });
         });
      }
      if (queryParams.copy) {
      }
   }, []);

   const onSubmitHandler = async dataForm => {
      try {
         const resData = {
            rooms: dataForm.room[0],
            area: dataForm.area.replace(/,/g, '.'),
            description: dataForm.description,
            price: dataForm.price,
            floor: dataForm.floor.value,
            'recommend-catalog': dataForm['recommend-catalog'],
            'cashback-catalog': dataForm['cashback-catalog'],
            photos: dataPhotos,
            attributes: [],
            tags:
               dataForm.tags && dataForm.advantages
                  ? [...dataForm.tags?.map(item => item.value), ...dataForm.advantages?.map(item => item.value)]
                  : [],
            deadline: dataForm.deadline,
         };

         if (customFrame) {
            resData.housing = dataForm.custom_frame;
         } else {
            resData.housing = dataForm.frame.value;
         }

         const formData = new FormData();

         resData.photos = refactPhotoStageOne(resData.photos);
         refactPhotoStageAppend(resData.photos, formData);
         resData.photos = refactPhotoStageTwo(resData.photos);

         formData.append('data', JSON.stringify(resData));

         if (type === 'create') {
            const { data:{apartment_id} } = await sendPostRequest(`/admin-api/create/apartment/building/${params.objectId}`, formData, {
               'Content-Type': 'multipart/form-data',
            });

            window.location.href = `${PrivateRoutesPath.apartment.edit}${apartment_id}`;
         }

         if (type === 'edit') {
            sendPostRequest(`/admin-api/update/apartment/${data.id}`, formData, { 'Content-Type': 'multipart/form-data' }).then(res => {
               window.location.reload();
            });
         }
      } catch (error) {
         console.log(error);
      }
   };

   return {
      onSubmitHandler,
      data,
      setData,
      frames,
      setFrames,
      dataPhotos,
      setDataPhotos,
      customFrame,
      setCustomFrame,
      tags,
      advantages,
      control,
      errors,
      handleSubmit,
   };
};
