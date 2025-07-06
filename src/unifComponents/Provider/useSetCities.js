import { useDispatch } from 'react-redux';
import { setCities, updateMainInfo } from '../../redux/slices/mainInfoSlice';
import { sendPostRequest } from '../../api/requestsApi';
import { setInitApp } from '../../redux/slices/helpSlice';
import { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import isEmptyArrObj from '../../helpers/isEmptyArrObj';

export const useSetCities = (cities, userInfo) => {
   const [cookies] = useCookies();
   const [initCities, setInitCities] = useState(false);
   const dispatch = useDispatch();

   const setCity = async city => {
      const cityInfo = await sendPostRequest('/api/city/get-info', { city: city.id }).then(res => res.data);

      const data = {
         ...city,
         data: cityInfo,
      };

      localStorage.setItem('cityData', JSON.stringify(data));
      dispatch(updateMainInfo(data));
   };

   const setCityDefault = async cities => {
      if (!cities?.length) return;

      const defaultCity = cities.find(item => +item.id === 3);
      await setCity({
         id: defaultCity.id,
         name: defaultCity.name,
         geo: [defaultCity.latitude, defaultCity.longitude],
      });
   };

   useEffect(() => {
      const cityData = JSON.parse(localStorage.getItem('cityData'));
      if (cityData) {
         dispatch(updateMainInfo(cityData));
      }
   }, []);

   useEffect(() => {
      if (!cities?.length) return;

      if (cookies.loggedIn) {
         if (isEmptyArrObj(userInfo)) return;
      }

      dispatch(setCities(cities));

      const fetch = async () => {
         const cityData = JSON.parse(localStorage.getItem('cityData'));

         if (!cityData) {
            await setCityDefault(cities);
         }

         dispatch(setInitApp(true));
         setInitCities(true);
      };

      fetch();
   }, [cities, userInfo]);

   return { initCities, setCity, setCityDefault };
};
