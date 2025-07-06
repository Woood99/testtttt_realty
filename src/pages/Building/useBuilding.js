import { useEffect, useState } from 'react';
import { checkAuthUser, getUserInfo } from '../../redux/helpers/selectors';
import { useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getDataRequest } from '../../api/requestsApi';
import { getDialogId, getUrlNavigateToChatDialog } from '../../api/getDialogId';
import { setSelectAccLogModalOpen } from '../../redux/slices/helpSlice';
import { getSpecialists } from '../../api/Building/getSpecialists';
import { getFrames } from '../../api/other/getFrames';
import { DirectLink, Element, Events, animateScroll as scroll, scrollSpy, scroller } from 'react-scroll';
import dayjs from 'dayjs';
import { CHAT_TYPES } from '../../components/Chat/constants';
import { isBuyer } from '../../helpers/utils';
import { useNavigateToChat } from '../../hooks/useNavigateToChat';
import { useCallingPartner } from '../../hooks/useCallingPartner';

export const useBuilding = id => {
   const location = useLocation();

   const userInfo = useSelector(getUserInfo);
   const authUser = useSelector(checkAuthUser);
   const userIsBuyer = isBuyer(userInfo);

   const [buildingData, setBuildingData] = useState({});
   const [buildingDataError, setBuildingDataError] = useState(false);

   const [specialistsData, setSpecialistsData] = useState([]);

   const [frames, setFrames] = useState([]);
   const [constructItems, setConstructItems] = useState([]);

   const [isOpenChoiceSpecialist, setIsOpenChoiceSpecialist] = useState(false);
   const [isOpenChoiceSpecialistCall, setIsOpenChoiceSpecialistCall] = useState(false);

   const [suggestions, setSuggestions] = useState({});
   const [myDiscount, setMyDiscount] = useState({});

   const [minPriceAllObjects, setMinPriceAllObjects] = useState(0);
   const [maxPriceAllObjects, setMaxPriceAllObjects] = useState(0);

   const [advantages, setAdvantages] = useState([]);
   const [isLoading, setIsLoading] = useState(true);
   const navigateToChat = useNavigateToChat();
   const callingPartner = useCallingPartner();

   const getSuggestions = async building_id => {
      try {
         const { data: result } = await getDataRequest(`/buyer-api/my-application/building/${building_id}`);
         setSuggestions(result);
      } catch (error) {}
   };

   const goToChat = async () => {
      if (specialistsData.length) {
         setIsOpenChoiceSpecialist(true);
      } else {
         await navigateToChat({ building_id: +id, organization_id: buildingData.developer?.id });
      }
   };

   const goToChatCall = async () => {
      await callingPartner({ organization_id: buildingData.developer?.id });
   };

   useEffect(() => {
      const fetch = async () => {
         setIsLoading(true);

         const resultBuilding = await getDataRequest(`/api/building/${id}`)
            .then(res => {
               const data = res?.data;

               if (data) {
                  setBuildingData({
                     ...data,
                     stock: data.stock.filter(item => dayjs().isBefore(dayjs.unix(item.end))),
                     calculations: data.calculations.filter(item => dayjs().isBefore(dayjs.unix(item.end))),
                     news: data.news.filter(item => dayjs().isBefore(dayjs.unix(item.end))),
                  });
                  return data;
               }
            })
            .catch(error => {
               const statusCode = +error.message.split(' ').pop();
               if (statusCode) {
                  setBuildingDataError(+statusCode);
                  return 'error';
               }
            });

         if (resultBuilding === 'error') return;

         await getDataRequest('/api/tags', { type: 'advantages', building_id: id }).then(res => {
            const filteredTags = resultBuilding.advantages.map(item => {
               const currentAdvantage = res.data.find(i => i.id === item.id);
               return currentAdvantage;
            });

            setAdvantages(filteredTags);
         });
         await getSpecialists(id).then(res => setSpecialistsData(res));

         getFrames(id).then(res => setFrames(res));
         getDataRequest(`/api/building/${id}/history`).then(res => setConstructItems(res.data));
         getDataRequest('/api/price-extreme/min').then(res => setMinPriceAllObjects(res.data));
         getDataRequest('/api/price-extreme/max').then(res => setMaxPriceAllObjects(res.data));

         setIsLoading(false);
      };
      fetch();
   }, []);

   useEffect(() => {
      if (!authUser) return;
      if (!userIsBuyer) return;
      getSuggestions(id);
      try {
         getDataRequest(`/buyer-api/my-personal-discount/building/${id}`).then(discountRes => {
            if (!discountRes.data) return;
            getDataRequest(`/api/special-condition/building/${id}`).then(conditionItems => {
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
   }, [userInfo]);

   useEffect(() => {
      if (!buildingData || !location.hash) return;
      const element = document.querySelector(location.hash);
      if (element) {
         setTimeout(() => {
            scroll.scrollTo(element.offsetTop + (-52 - 12), {
               duration: 500,
               smooth: true,
            });
         }, 250);
      }
   }, [location, buildingData]);

   return {
      buildingData,
      minPriceAllObjects,
      maxPriceAllObjects,
      advantages,
      setIsOpenChoiceSpecialist,
      specialistsData,
      goToChat,
      goToChatCall,
      buildingDataError,
      suggestions,
      getSuggestions,
      myDiscount,
      frames,
      constructItems,
      isOpenChoiceSpecialist,
      isLoading,
      isOpenChoiceSpecialistCall,
      setIsOpenChoiceSpecialistCall,
   };
};
