import { getCities } from '../../api/cities/getCities';
import { useEffect, useState } from 'react';

export const useGetCities = () => {
   const [cities, setCities] = useState([]);
   const [loading, setLoading] = useState(true);

   useEffect(() => {
      getCities().then(res => {
         setCities(res);
         setLoading(false);
      });
   }, []);

   return { cities, loading };
};
