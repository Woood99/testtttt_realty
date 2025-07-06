import { useEffect, useState } from 'react';
import { getDataRequest } from '../requestsApi';

export const useObjectTypes = () => {
   const [data, setData] = useState([]);

   const fetchData = async () => {
      try {
         const response = await getDataRequest('/api/object-types');
         setData(response.data);
      } catch (err) {}
   };

   useEffect(() => {
      fetchData();
   }, []);

   return { data, refetch: fetchData };
};
