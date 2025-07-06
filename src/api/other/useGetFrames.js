import { useEffect, useState } from 'react';
import { getDataRequest } from '../requestsApi';

export const useGetFrames = id => {
   const [data, setData] = useState([]);

   useEffect(() => {
      if (!id) return;
      const fetchData = async () => {
         try {
            const response = await getDataRequest(`/api/building/${id}/frames`);
            const arrayOfObjects = Object.keys(response.data).map(key => {
               const item = response.data[key];
               return {
                  label: item,
                  value: item,
               };
            });
            setData(arrayOfObjects);
         } catch (err) {}
      };

      fetchData();
   }, []);

   return { frames: data };
};
