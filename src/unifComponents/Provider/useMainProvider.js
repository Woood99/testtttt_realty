import { useCookies } from 'react-cookie';
import { useDispatch, useSelector } from 'react-redux';
import { getCurrentCitySelector, getUserInfo } from '../../redux/helpers/selectors';
import { useEffect } from 'react';
import { useGetCities } from './useGetCities';
import isEmptyArrObj from '../../helpers/isEmptyArrObj';
import { useMainHelpers } from './useMainHelpers';
import { setCities, setUserInfo } from '../../redux/slices/mainInfoSlice';
import { useSetCities } from './useSetCities';
import { ROLE_ADMIN, ROLE_BUYER, ROLE_SELLER } from '../../constants/roles';
import { cityExclusionsBuyer, cityExclusionsSeller } from './cityExclusions';
import { useUserAuth } from './useUserAuth';

export const useMainProvider = () => {
   const [cookies] = useCookies();
   const dispatch = useDispatch();

   useMainHelpers();

   const { cities } = useGetCities();

   const userInfo = useSelector(getUserInfo);
   const { initCities, setCity, setCityDefault } = useSetCities(cities, userInfo);
   const { setAuthUser, userConnectionEcho } = useUserAuth();
   const currentCity = useSelector(getCurrentCitySelector);

   useEffect(() => {
      if (!cookies.loggedIn) {
         dispatch(setUserInfo({}));
         return;
      }
      
      setAuthUser().then(userConnectionEcho);
   }, []);

   useEffect(() => {
      if (!initCities) return;
      if (isEmptyArrObj(userInfo) || userInfo.role?.id === ROLE_BUYER.id) {
         const userCities = cityExclusionsBuyer(cities);

         if (!userCities.find(city => city.id === currentCity?.id)) {
            setCityDefault(cities);
         }
         dispatch(setCities(userCities));
      } else {
         if (userInfo.role?.id === ROLE_ADMIN.id) {
            dispatch(setCities(cities));
         }
         if (userInfo.role?.id === ROLE_SELLER.id) {
            const userCities = cityExclusionsSeller(cities, userInfo);
            const firstCity = userCities[0];
            if (firstCity) {
               dispatch(setCities(userCities));
               setCity({
                  id: firstCity.id,
                  name: firstCity.name,
                  geo: [firstCity.latitude, firstCity.longitude],
               });
            }
         }
      }
   }, [initCities, userInfo]);

   return { userInfo };
};
