import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { useParams } from 'react-router-dom';

import { getDataRequest } from '../../api/requestsApi';

import { getSpecialists } from '../../api/Building/getSpecialists';

import { getApartmentsFromType } from '../../api/other/getApartmentsFromType';
import { checkAuthUser } from '../../redux/helpers/selectors';
import { isArray } from '../../helpers/isEmptyArrObj';
import { setSelectAccLogModalOpen } from '../../redux/slices/helpSlice';
import { isActualDate } from '../../helpers/isActualDate';
import { useNavigateToChat } from '../../hooks/useNavigateToChat';

export const usePromo = () => {
   const params = useParams();

   const authUser = useSelector(checkAuthUser);

   const [data, setData] = useState(null);
   const [apartmentIds, setApartmentIds] = useState([]);
   const [specialistsData, setSpecialistsData] = useState([]);

   const [isOpenChoiceSpecialist, setIsOpenChoiceSpecialist] = useState(false);

   const dispatch = useDispatch();
   const navigateToChat = useNavigateToChat();

   useEffect(() => {
      const fetch = async () => {
         const promoData = await getDataRequest(`/api/promo/${params.id}`).then(res => {
            return {
               ...res.data,
               currentUser: res.data.author || res.data.user,
               typeUser: res.data.author ? 'author' : 'developer',
               isActual: isActualDate(res.data.date_start, res.data.date_end),
            };
         });

         await getApartmentsFromType(params.id, 'promo', 10).then(res => {
            if (isArray(res.data)) {
               setData(promoData);
               return;
            }
            res.data.then(res => {
               promoData.apartments = res.items;
               setData(promoData);
            });
            setApartmentIds(res.apartments);
         });

         await getSpecialists(promoData.building_id).then(res => {
            setSpecialistsData(res);
         });
      };
      fetch();
   }, []);

   const goToChat = async () => {
      if (authUser) {
         if (data.typeUser === 'author') {
            await navigateToChat({ building_id: data.building_id, recipients_id: [data.author.id] });
         } else {
            if (specialistsData.length) {
               setIsOpenChoiceSpecialist(true);
            } else {
               await navigateToChat({ building_id: data.building_id, organization_id: data.user?.id });
            }
         }
      } else {
         dispatch(setSelectAccLogModalOpen(true));
      }
   };

   return {
      data,
      specialistsData,
      isOpenChoiceSpecialist,
      setIsOpenChoiceSpecialist,
      goToChat,
   };
};
