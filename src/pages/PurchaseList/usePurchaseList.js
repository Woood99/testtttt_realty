import { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import debounce from 'lodash.debounce';
import { useLocation, useSearchParams } from 'react-router-dom';
import { useForm, useWatch } from 'react-hook-form';
import { getCitiesValuesSelector, getCurrentCitySelector, getUserInfo } from '../../redux/helpers/selectors';
import { isAdmin, isSeller } from '../../helpers/utils';
import { useFiltersDataChainInitFields } from '../../hooks/useFiltersDataChainInitFields';
import { getCountOfSelectedFilterObj } from '../../helpers/getCountOfSelectedFilter';
import { getDataRequest, sendPostRequest } from '../../api/requestsApi';
import { ROLE_ADMIN, ROLE_SELLER } from '../../constants/roles';

export const usePurchaseList = (role_id, namePage) => {
   const userInfo = useSelector(getUserInfo);
   const userIsSeller = userInfo.role ? isSeller(userInfo) : role_id === ROLE_SELLER.id;
   const userIsAdmin = userInfo.role ? isAdmin(userInfo) : role_id === ROLE_ADMIN.id;
   const currentCity = useSelector(getCurrentCitySelector);
   const [searchParams, setSearchParams] = useSearchParams();
   const [initFieldsForm, setInitFieldsForm] = useFiltersDataChainInitFields();
   const location = useLocation();
   const cities = useSelector(getCitiesValuesSelector);

   const { control, reset, setValue } = useForm({
      defaultValues: {
         search: '',
         calc_props: [],
         complexes: [],
         developers: [],
         rooms: [],
         city: cities.find(item => item.value === currentCity.id),
      },
   });

   const [types, setTypes] = useState([]);
   const [developers, setDevelopers] = useState([]);
   const [complexes, setComplexes] = useState([]);
   const [activeType, setActiveType] = useState(null);
   const [isLoading, setIsLoading] = useState(true);
   const [currentPage, setCurrentPage] = useState(1);
   const [filterCount, setFilterCount] = useState(0);
   const [isOpenMoreFilter, setIsOpenMoreFilter] = useState(false);

   const [data, setData] = useState({
      total: 0,
      pages: 0,
      items: [],
   });

   const watchedValues = useWatch({
      control,
   });

   const handleSubmitFn = data => {
      setIsLoading(true);
      setFilterCount(getCountOfSelectedFilterObj(data, ['defaultCity', 'userIsSeller', 'userIsAdmin', 'activeType'], { city: data.defaultCity }));

      const params = {
         ...data,
         page: data.page,
         per_page: 16,
         show_all_purchase_orders: data.activeType === 'all' && data.userIsSeller,
      };

      // show_all_purchase_orders
      // 1 - на основе моего города (мой город)
      // 0 - все заявки где есть suggest...

      // 1 вкладка - мой город
      // 2 вкладка - все заявки где есть suggest...

      delete params.defaultCity;
      delete params.userIsSeller;
      delete params.userIsAdmin;
      delete params.activeType;

      sendPostRequest(`/${data.userIsSeller ? 'seller-api' : data.userIsAdmin ? 'admin-api' : 'api'}/purchase-orders`, params).then(res => {
         setIsLoading(false);
         setData(res.data);
      });
   };

   const debounceFn = useCallback(
      debounce(state => {
         handleSubmitFn(state);
      }, 400),
      []
   );

   useEffect(() => {
      if (cities.length > 0 && currentCity.id) {
         setValue(
            'city',
            cities.find(item => item.value === currentCity.id)
         );
      }
   }, [cities, currentCity]);

   useEffect(() => {
      getDataRequest('/api/object-types').then(res => {
         if (!res.data) return;
         setTypes(
            res.data.map(item => ({
               value: item.id,
               label: item.name,
            }))
         );
      });
   }, []);

   useEffect(() => {
      if (userIsSeller) {
         setActiveType(namePage);
      }
   }, [userIsSeller]);

   useEffect(() => {
      window.scrollTo({
         top: 0,
         behavior: 'smooth',
      });
   }, [currentPage]);

   useEffect(() => {
      if (!watchedValues.city) return;
      setIsLoading(true);

      fetchData();
   }, [JSON.stringify(watchedValues), currentPage, currentCity.id, userIsSeller, , userIsAdmin, activeType, location.pathname]);

   const fetchData = () => {
      debounceFn({
         rooms: watchedValues.rooms,
         type: watchedValues.type?.value,
         calc_props: watchedValues.calc_props?.map(item => item.label),
         developers: watchedValues.developers?.map(item => item.value),
         complexes: watchedValues.complexes?.map(item => item.value),
         city: watchedValues.city?.value,
         page: currentPage,
         defaultCity: currentCity.id,
         userIsSeller: userIsSeller,
         userIsAdmin: userIsAdmin,
         activeType: activeType || 'all',
         search: watchedValues.search || '',
      });
   };

   return {
      data,
      filterCount,
      isOpenMoreFilter,
      setIsOpenMoreFilter,
      currentCity,
      control,
      reset,
      types,
      setDevelopers,
      developers,
      complexes,
      setComplexes,
      setValue,
      watchedValues,
      initFieldsForm,
      setInitFieldsForm,
      userIsSeller,
      userIsAdmin,
      isLoading,
      currentPage,
      setCurrentPage,
      searchParams,
      setSearchParams,
      activeType,
      setActiveType,
      userInfo,
      fetchData,
   };
};
