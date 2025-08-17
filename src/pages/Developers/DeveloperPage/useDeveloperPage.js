import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';

import { getDataRequest } from '../../../api/requestsApi';
import getCardsBuildings from '../../../api/getCardsBuildings';
import { getSpecialistsOrganization } from '../../../api/Building/getSpecialists';
import { getMapBuildings } from '../../../api/getMapBuildings';
import isEmptyArrObj from '../../../helpers/isEmptyArrObj';
import { getCitiesSelector, getUserInfo } from '@/redux';
import { getFilteredObject, mergeArraysFromObject } from '../../../helpers/objectMethods';
import { useQueryParams } from '../../../hooks/useQueryParams';
import { isAdmin } from '../../../helpers/utils';

export const useDeveloperPage = () => {
   const params = useParams();
   const paramsString = useQueryParams();

   const citiesItems = useSelector(getCitiesSelector);

   const [tabActiveValue, setTabActiveValue] = useState(0);

   const [data, setData] = useState({});
   const userInfo = useSelector(getUserInfo);
   const userIsAdmin = isAdmin(userInfo);

   const [confirmDeleteModal, setConfirmDeleteModal] = useState(null);
   const [specialistsData, setSpecialistsData] = useState([]);

   const [isFullscreenMap, setIsFullscreenMap] = useState(false);

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
      const fetch = async () => {
         const developerData = await getDataRequest(`/api/developers/${params.id}`, { city: paramsString.city || '' }).then(res => res.data);

         const specialists = await getSpecialistsOrganization(params.id);

         const feedData = {
            stocks: developerData.stocks,
            calculations: developerData.calculations,
            news: developerData.news,
            videos: developerData.videos,
            shorts: developerData.shorts,
         };
         setData({
            id: +params.id,
            ...developerData,
            tabsData: [
               getFilteredObject(mergeArraysFromObject(feedData).length, {
                  name: 'Всё',
                  valueName: 'all',
                  data: feedData,
               }),
               getFilteredObject(developerData.objects.length, {
                  name: 'Объекты застройщика',
                  valueName: 'objects',
                  data: developerData.objects,
               }),
               getFilteredObject(specialists.length, {
                  name: 'Менеджеры отдела продаж',
                  valueName: 'specialists',
                  data: specialists,
               }),
               getFilteredObject(feedData.shorts.length, {
                  name: 'Клипы',
                  valueName: 'shorts',
                  data: feedData.shorts,
               }),
               getFilteredObject(feedData.videos.length, {
                  name: 'Видео',
                  valueName: 'videos',
                  data: feedData.videos,
               }),

               getFilteredObject(feedData.stocks.length, {
                  name: 'Скидки',
                  valueName: 'stocks',
                  data: feedData.stocks,
               }),
               getFilteredObject(feedData.news.length, {
                  name: 'Подарки',
                  valueName: 'news',
                  data: feedData.news,
               }),
               getFilteredObject(feedData.calculations.length, {
                  name: 'Расчеты',
                  valueName: 'calculations',
                  data: feedData.calculations,
               }),
            ].filter(item => !isEmptyArrObj(item)),
         });

         setSpecialistsData(specialists);
      };
      fetch();
   }, []);

   useEffect(() => {
      if (!citiesItems.length) return;

      if (!data.objects || data.objectsCount === 0) {
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

      getMapBuildings(paramsString.city || citiesItems.find(item => item.id === data.cities[0])?.name, data.objects).then(res => {
         setObjectsOptions(prev => {
            return {
               ...prev,
               mapData: res,
            };
         });
      });
      objectsOptions.fetch(data.objects);
   }, [data.objects, citiesItems]);

   useEffect(() => {
      if (!data.objects || data.objectsCount === 0) {
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
      objectsOptions.fetch(data.objects).then(() => {
         setTimeout(() => {
            window.scrollTo({
               top: objectsOptions.ref.current?.offsetTop - 16,
               behavior: 'smooth',
            });
         }, 0);
      });
   }, [objectsOptions.page]);

   return {
      params,
      paramsString,
      citiesItems,
      tabActiveValue,
      setTabActiveValue,
      data,
      userIsAdmin,
      specialistsData,
      confirmDeleteModal,
      setConfirmDeleteModal,
      isFullscreenMap,
      setIsFullscreenMap,
      objectsOptions,
      setObjectsOptions,
   };
};
