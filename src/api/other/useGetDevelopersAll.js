import { useEffect, useState } from 'react';
import { sendPostRequest } from '../requestsApi';

export const useGetDevelopersAll = (params = {}, format = 'default', condition = true) => {
   const [data, setData] = useState([]);
    
   useEffect(() => {
      if (!condition) return;
      const fetchData = async () => {
         try {
            const response = await sendPostRequest('/api/developers/all', params);
            
            if (format === 'default') {
               setData(response.data);
               return;
            }
            if (format === 'values') {
               setData(
                  response.data.map(item => ({
                     label: item.name,
                     value: item.id,
                     avatar: item.photo,
                  }))
               );
               return;
            }
         } catch (err) {}
      };

      fetchData();
   }, [condition]);

   return { developers: data };
};
