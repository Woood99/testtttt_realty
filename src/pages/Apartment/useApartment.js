import React, { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import { useDispatch, useSelector } from 'react-redux';

import { getApartment } from '../../api/getApartment';
import isEmptyArrObj from '../../helpers/isEmptyArrObj';
import { getDataRequest } from '../../api/requestsApi';
import { getSpecialists } from '../../api/Building/getSpecialists';
import { getApartmentTitle } from '../../helpers/getApartmentTitle';
import { getFirstElementArray } from '../../helpers/arrayMethods';
import { ROLE_BUYER } from '../../constants/roles';
import { checkAuthUser, getUserInfo } from '../../redux/helpers/selectors';
import { getDialogId, getUrlNavigateToChatDialog } from '../../api/getDialogId';
import { setSelectAccLogModalOpen } from '../../redux/slices/helpSlice';
import { useQueryParams } from '../../hooks/useQueryParams';
import dayjs from 'dayjs';
import { CHAT_TYPES } from '../../components/Chat/constants';
import { priceByDiscountApartment } from '../../helpers/priceByDiscountApartment';
import { isBuyer } from '../../helpers/utils';
import { useNavigateToChat } from '../../hooks/useNavigateToChat';
import { useCallingPartner } from '../../hooks/useCallingPartner';

export const useApartment = id => {
   const params = useQueryParams();
   const userInfo = useSelector(getUserInfo);
   const authUser = useSelector(checkAuthUser);
   const userIsBuyer = isBuyer(userInfo);

   const [types, setTypes] = useState([]);

   const [apartmentData, setApartmentData] = useState(null);
   const [specialistsData, setSpecialistsData] = useState([]);

   const [isOpenChoiceSpecialist, setIsOpenChoiceSpecialist] = useState(false);
   const [isOpenChoiceSpecialistCall, setIsOpenChoiceSpecialistCall] = useState(false);

   const [suggestions, setSuggestions] = useState({});
   const [myDiscount, setMyDiscount] = useState(null);

   const [purchaseRequest, setPurchaseRequest] = useState(null);
   const [isLoading, setIsLoading] = useState(true);

   const apartmentSelector = useSelector(state => state.apartment);

   const navigateToChat = useNavigateToChat();
   const callingPartner = useCallingPartner();

   const getSuggestions = async apartment_id => {
      try {
         const { data: result } = await getDataRequest(`/buyer-api/my-application/apartment/${apartment_id}`);
         setSuggestions(result);
      } catch (error) {}
   };

   const goToChat = async () => {
      if (specialistsData.length) {
         setIsOpenChoiceSpecialist(true);
      } else {
         await navigateToChat({ building_id: apartmentData.building_id, organization_id: apartmentData.developer?.id });
      }
   };

   const goToChatCall = async () => {
      await callingPartner({ organization_id: apartmentData.developer?.id });
   };

   useEffect(() => {
      const fetchData = async () => {
         setIsLoading(true);

         const apartRes = await getApartment(id);
         const gift_group = Object.values(apartRes.gift_groups)
            .flat(2)
            .filter(item => !item.is_main_group)
            .slice(-1)[0];

         const priceByDiscount = priceByDiscountApartment(apartRes?.buildingDiscount, apartRes?.priceOld, apartRes?.area);
         const cashbackValue = ((apartRes.bd_price || apartRes.price) / 100) * ((apartRes.cashback || 0) + (apartRes.buildingCashback?.value || 0));

         setApartmentData({
            ...apartRes,
            title: getApartmentTitle(apartRes),
            history_price_old: !isEmptyArrObj(apartRes.historyPrice) ? getFirstElementArray(apartRes.historyPrice).value : apartRes.priceOld,
            gift_group:
               gift_group && !isEmptyArrObj(gift_group)
                  ? {
                       count: gift_group.count || null,
                       sum: gift_group.sum || null,
                       max_sum: gift_group.max_sum || null,
                    }
                  : {},
            promos: apartRes.promos.filter(item => dayjs().isBefore(dayjs.unix(item.end))),
            cashbackValue,
            priceByDiscount,
         });

         getSpecialists(apartRes.building_id).then(res => setSpecialistsData(res));

         setIsLoading(false);
      };

      fetchData();

      if (params.purchase) {
         getDataRequest('/api/object-types').then(res => {
            if (!res.data) return;
            setTypes(
               res.data.map(item => ({
                  value: item.id,
                  label: item.name,
               }))
            );
         });
         getDataRequest(`/api/purchase-orders/${params.purchase}`).then(res => setPurchaseRequest(res.data));
      }
   }, []);

   useEffect(() => {
      if (!authUser) return;
      if (!userIsBuyer) return;
      if (!apartmentData) return;

      getSuggestions(id);

      try {
         getDataRequest(`/buyer-api/my-personal-discount/apartment/${id}`).then(discountRes => {
            if (!discountRes.data) return;

            getDataRequest(`/api/special-condition/building/${apartmentData.building_id}`).then(conditionItems => {
               setMyDiscount(
                  discountRes.data.map(data => {
                     const currentCondition = conditionItems.data.find(i => i.id === data.special_condition_id);
                     return {
                        id: data.id,
                        property_type: data.discountable_type === 'App\\Models\\Building' ? 'complex' : 'apartment',
                        type: data.is_absolute ? 'price' : data.is_special_condition ? 'special-condition' : 'prc',
                        object_id: data.discountable_id,
                        valid_till: data.valid_till,
                        discount: data.discount,
                        author: data.author,
                        special_condition: data.special_condition_id !== null ? currentCondition : null,
                     };
                  })
               );
            });
         });
      } catch (error) {}
   }, [userInfo, apartmentData]);

   return {
      apartmentData,
      types,
      myDiscount,
      goToChat,
      goToChatCall,
      purchaseRequest,
      isOpenChoiceSpecialist,
      setIsOpenChoiceSpecialist,
      specialistsData,
      apartmentSelector,
      suggestions,
      getSuggestions,
      isLoading,
   };
};
