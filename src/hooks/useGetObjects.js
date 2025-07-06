import { useEffect, useRef, useState } from 'react';
import getCardsBuildings from '../api/getCardsBuildings';

export const useGetObjects = (data, init) => {
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
         try {
            await getCardsBuildings({ visibleObjects: objects, page: this.page, per_page: this.per_page }).then(res => {
               setObjectsOptions(prev => {
                  return {
                     ...prev,
                     items: res.cards,
                     loading: false,
                  };
               });
            });
         } catch (error) {
            console.log(error);
         }
      },
   });

   useEffect(() => {
      if (!init) return;
      if (!data.objects_ids || !data.objectsCount) {
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

      objectsOptions.fetch(data.objects_ids);
   }, [data.objects_ids?.length, init]);

   useEffect(() => {
      if (!init) return;
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
               top: objectsOptions.ref.current?.offsetTop - (data.offset || 16),
               behavior: 'smooth',
            });
         }, 0);
      });
   }, [objectsOptions.page]);

   return {
      objectsOptions,
      setObjectsOptions,
   };
};
