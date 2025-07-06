import { useSelector } from 'react-redux';
import { getDataRequest } from '../../api/requestsApi';
import { authLoadingSelector, getCurrentCitySelector, getUserInfo } from '../../redux/helpers/selectors';
import { useEffect, useState } from 'react';
import { isAdmin, isSeller } from '../../helpers/utils';
import { ROLE_ADMIN, ROLE_BUYER, ROLE_SELLER } from '../../constants/roles';
import { mergeArraysFromObject } from '../../helpers/objectMethods';

const IData = {
   loading: true,
   isVisible: true,
   data: [],
};

export const useHomeData = () => {
   const city = useSelector(getCurrentCitySelector);

   const [userRole, setUserRole] = useState(ROLE_BUYER.name);
   const userInfo = useSelector(getUserInfo);
   const authLoading = useSelector(authLoadingSelector);

   const [cashbackCards, setCashbackCards] = useState(IData);
   const [promoCards, setPromoCards] = useState(IData);
   const [videoCards, setVideoCards] = useState(IData);
   const [shortsCards, setShortsCards] = useState(IData);
   const [recommendedCards, setRecommendedCards] = useState(IData);
   const [ordersCards, setOrdersCards] = useState(IData);
   const [banners, setBanners] = useState(IData);

   const getVideo = async () => {
      try {
         const { data } = await getDataRequest('/api/home/video', { per_page_videos: 20, per_page_shorts: 20, city: city.name });

         setVideoCards({
            loading: false,
            data: data.videos,
            isVisible: data.videos.length > 0,
         });
         setShortsCards({
            loading: false,
            data: data.shorts,
            isVisible: data.shorts.length > 0,
         });
      } catch (error) {
         setVideoCards(prev => ({ ...prev, loading: false }));
         setShortsCards(prev => ({ ...prev, loading: false }));
      }
   };

   const getPromo = async () => {
      try {
         const { data } = await getDataRequest('/api/home/promo', { per_page_promo: 3, per_page_news: 3, per_page_calc: 3, city: city.name });

         setPromoCards({
            loading: false,
            data,
         });
      } catch (error) {
         setPromoCards(prev => ({ ...prev, loading: false }));
      }
   };

   useEffect(() => {
      if (!city.id) return;

      const fetchData = async () => {
         await getDataRequest('/api/banners?page=1&limit=10', { city: city.name }).then(res => {
            setBanners({
               loading: false,
               data: res.data.items,
               isVisible: res.data.items.length > 0,
            });
         });

         await getDataRequest('/api/home/cashback', { per_page_cashback: 3, city: city.name }).then(res => {
            setCashbackCards({
               loading: false,
               data: res.data,
               isVisible: res.data.length > 0,
            });
         });

         await getPromo();
         await getVideo();

         await getDataRequest('/api/home/recommended', { per_page_recommended_apartment: 3, per_page_recommended_building: 3, city: city.name }).then(
            res => {
               const mergedData = mergeArraysFromObject(res.data);

               setRecommendedCards({
                  loading: false,
                  data: mergedData,
                  isVisible: mergedData.length > 0,
                  apartments: res.data.apartments,
                  buildings: res.data.buildings,
               });
            }
         );

         getDataRequest('/api/home/orders', { per_page_order: 5, city: city.id }).then(res => {
            setOrdersCards({
               loading: false,
               data: res.data,
               isVisible: res.data.length > 0,
            });
         });
      };

      fetchData();
   }, [city.id]);

   useEffect(() => {
      if (isAdmin(userInfo)) {
         setUserRole(ROLE_ADMIN.name);
      } else if (isSeller(userInfo)) {
         setUserRole(ROLE_SELLER.name);
      } else {
         setUserRole(ROLE_BUYER.name);
      }
   }, [userInfo]);

   return { cashbackCards, promoCards, videoCards, shortsCards, recommendedCards, ordersCards, banners, userRole, authLoading, getVideo, getPromo };
};
