import { useEffect, useState } from 'react';
import { getSpecialists } from '../../../api/Building/getSpecialists';
import { getFrames } from '../../../api/other/getFrames';
import CreatePromo from './CreatePromo';
import { sendPostRequest } from '../../../api/requestsApi';
import { getBuilding } from '../../../api/getBuilding';
import { refactPhotoStageAppend, refactPhotoStageOne, refactPhotoStageTwo } from '../../../helpers/photosRefact';

const ControlsPromoEditModal = ({ data, set, refetchData }) => {
   const [promoData, setPromoData] = useState({});

   const onSubmitForm = async (dataSubmit, reset, type, currentPromoId) => {
      const resData = { ...dataSubmit, building_id: promoData.building.id, is_calculation: data.is_calculation, is_news: data.is_news };

      const formData = new FormData();

      resData.image = refactPhotoStageOne(resData.image);
      refactPhotoStageAppend(resData.image, formData);
      resData.image = refactPhotoStageTwo(resData.image);
      resData.image = resData.image[0];

      if (resData.is_banner) {
         resData.banner_image = refactPhotoStageOne(resData.banner_image);
         refactPhotoStageAppend(resData.banner_image, formData);
         resData.banner_image = refactPhotoStageTwo(resData.banner_image);
         resData.banner_image = resData.banner_image[0];
      }

      formData.append('data', JSON.stringify(resData));

      const { data: responsePromo } = await sendPostRequest(`/admin-api/promo/${currentPromoId}/update`, formData, {
         'Content-Type': 'multipart/form-data',
      });

      await sendPostRequest(`/admin-api/assign/promo/${responsePromo.id}/apartments`, { apartments_ids: resData.apartments_ids });

      set(false);
      if (refetchData) {
         refetchData();
      }
   };

   useEffect(() => {
      if (!data) return;

      const fetchData = async () => {
         const building = await getBuilding(data.building_id);
         const frames = await getFrames(data.building_id);
         const specialists = await getSpecialists(data.building_id);
         let promo = building[`${data.type === 'calculation' ? 'calculations' : data.type === 'news' ? 'news' : 'stock'}`].find(
            item => item.id === data.id
         );

         if (!promo) return;

         const resData = {
            frames,
            specialists: specialists.map(item => ({
               avatar: item.avatar,
               label: item.name,
               value: item.id,
            })),
            building,
            promo,
         };
         setPromoData(resData);
      };

      fetchData();
   }, [data]);

   if (!promoData?.promo) return;

   return (
      <CreatePromo
         conditionModal={Boolean(data)}
         setModal={set}
         specialists={promoData.specialists || []}
         dataObject={promoData.building || {}}
         values={promoData.promo}
         frames={promoData.frames}
         type="edit"
         options={{ title: 'Редактировать скидку', onSubmitForm }}
      />
   );
};

export default ControlsPromoEditModal;
