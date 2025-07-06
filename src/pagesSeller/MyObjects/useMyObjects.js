import { useEffect, useState } from 'react';
import { getDataRequest } from '../../api/requestsApi';

export const useMyObjects = () => {
   const fetchObjects = (endpoint, set) => {
      getDataRequest(endpoint, { all: 1 })
         .then(res => {
            setDataCards(prev => {
               return {
                  ...prev,
                  [set]: {
                     items: res.data.items || res.data,
                     isLoading: false,
                  },
               };
            });
         })
         .finally(() => {
            setDataCards(prev => {
               return {
                  ...prev,
                  [set]: {
                     ...prev[set],
                     isLoading: false,
                  },
               };
            });
         });
   };

   const [dataCards, setDataCards] = useState({
      complexes: {
         isLoading: true,
         items: [],
      },
   });

   useEffect(() => {
      fetchObjects('/seller-api/associated-objects', 'complexes');
   }, []);

   return {
      dataCards,
   };
};
