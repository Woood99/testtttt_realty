import { useEffect, useState } from 'react';
import { getDataRequest } from '../requestsApi';
import { capitalizeWords } from '../../helpers/changeString';

export const useGetSpecialistsAll = (id, format = 'default') => {
   const [data, setData] = useState([]);

   useEffect(() => {
      if (!id) return;
      const fetchData = async () => {
         try {
            const response = await getDataRequest(`/api/building/${id}/specialists`);
            if (format === 'default') {
               setData(response.data);
               return;
            }
            if (format === 'values') {
               setData(
                  response.data.map(item => ({
                     value: item.id,
                     label: capitalizeWords(item.name, item.surname),
                     avatar: item.avatar,
                  }))
               );
               return;
            }
         } catch (err) {}
      };

      fetchData();
   }, []);

   return { specialists: data };
};
