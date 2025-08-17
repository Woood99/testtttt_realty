import { useEffect, useRef, useState } from 'react';

import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { getDataRequest } from '../../../api/requestsApi';
import { getMapBuildings } from '../../../api/getMapBuildings';
import getCardsBuildings from '../../../api/getCardsBuildings';
import { getCitiesSelector, getUserInfo } from '@/redux';
import { combinedArray } from '../../../helpers/arrayMethods';
import { isAdmin } from '../../../helpers/utils';
import { useNavigateToChat } from '../../../hooks/useNavigateToChat';

export const useSpecialistPage = () => {
   const params = useParams();

   const cities = useSelector(getCitiesSelector);

   const [data, setData] = useState({});
   const [dataMap, setDataMap] = useState({});

   const [confirmDeleteModal, setConfirmDeleteModal] = useState(null);
   const navigateToChat = useNavigateToChat();
   const [tabsItems, setTabsItems] = useState([
      {
         name: 'Объекты менеджера',
         value: 'objects',
      },
      {
         name: 'Лента',
         value: 'feed',
      },
   ]);

   const [isFullscreenMap, setIsFullscreenMap] = useState(false);
   const [tabActiveValue, setTabActiveValue] = useState(tabsItems[0].value);

   const userInfo = useSelector(getUserInfo);
   const userIsAdmin = isAdmin(userInfo);

   const [objectsOptions, setObjectsOptions] = useState({
      init: false,
      items: [],
      loading: true,
      page: 1,
      ref: useRef(null),
      per_page: 12,
      fetch: async function (objects) {
         setObjectsOptions(prev => {
            return {
               ...prev,
               init: false,
               loading: true,
            };
         });
         await getCardsBuildings({ visibleObjects: objects, page: this.page, per_page: this.per_page }).then(res => {
            setObjectsOptions(prev => {
               return {
                  ...prev,
                  items: res.cards,
                  loading: false,
               };
            });
         });
      },
   });

   useEffect(() => {
      getDataRequest(`/api/specialists/${params.id}`).then(res => {
         const resData = res.data;
         const feed = combinedArray(
            resData.promos.map(item => ({
               ...item,
               type: 'stock',
            })),
            resData.calculations.map(item => ({
               ...item,
               type: 'calculation',
            })),
            resData.news.map(item => ({
               ...item,
               type: 'news',
            })),
            resData.videos.map(item => ({
               link: item,
               type: 'video',
            })),
            resData.shorts.map(item => ({
               link: item,
               type: 'short',
            }))
         );

         setData({
            id: params.id,
            ...resData,
            feed,
         });

         if (feed.length === 0) {
            setTabsItems(prev => prev.filter(item => item.value !== 'feed'));
         }
      });
   }, []);

   useEffect(() => {
      if (!data.objects_ids || !data.objectsCount || !cities.length) {
         if (!data.objectsCount) {
            setObjectsOptions(prev => {
               return {
                  ...prev,
                  loading: false,
               };
            });
            return;
         }
         return;
      }
      const currentCity = cities.find(item => +item.id === +data.cities[0]);

      if (currentCity) {
         getMapBuildings(currentCity.name, data.objects_ids).then(res => {
            setDataMap(res);
         });
      }

      objectsOptions.fetch(data.objects_ids);
   }, [data.objects_ids, cities]);

   useEffect(() => {
      if (!data.objects_ids || data.objectsCount === 0) {
         if (data.objectsCount === 0) {
            setObjectsOptions(prev => {
               return {
                  ...prev,
                  loading: false,
               };
            });
            return;
         }
         return;
      }
      objectsOptions.fetch(data.objects_ids).then(() => {
         setTimeout(() => {
            window.scrollTo({
               top: objectsOptions.ref.current?.offsetTop - 16,
               behavior: 'smooth',
            });
         }, 0);
      });
   }, [objectsOptions.page]);

   const goToChat = async () => {
      await navigateToChat({ recipients_id: [+data.id] });
   };

   return {
      params,
      data,
      dataMap,
      confirmDeleteModal,
      setConfirmDeleteModal,
      isFullscreenMap,
      setIsFullscreenMap,
      tabActiveValue,
      setTabActiveValue,
      userIsAdmin,
      objectsOptions,
      setObjectsOptions,
      goToChat,
      tabsItems,
   };
};
