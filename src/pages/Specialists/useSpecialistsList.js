import { useCallback, useEffect, useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import debounce from 'lodash.debounce';
import { useSelector } from 'react-redux';
import { sendPostRequest } from '../../api/requestsApi';
import { getCurrentCitySelector } from '@/redux';
import { capitalizedWord } from '../../helpers/changeString';
import { declensionWordsName } from '../../helpers/declensionWords';
import { declensionsWordsDataCity } from '../../data/declensionsWordsData';

export const useSpecialistsList = () => {
   const { control, reset, setValue } = useForm();
   const currentCity = useSelector(getCurrentCitySelector);

   const [isLoading, setIsLoading] = useState(true);
   const [dataItems, setDataItems] = useState([]);
   const [currentPage, setCurrentPage] = useState(1);

   const watchedValues = useWatch({
      control,
   });

   const handleSubmitFn = data => {
      setIsLoading(true);

      sendPostRequest('/api/specialists/page', { ...data, page: data.page }).then(res => {
         setIsLoading(false);
         setDataItems(res.data);
         window.scrollTo({
            top: 0,
            behavior: 'smooth',
         });
      });
   };

   const debounceFn = useCallback(
      debounce(state => {
         handleSubmitFn(state);
      }, 400),
      []
   );

   useEffect(() => {
      debounceFn({
         city: watchedValues.city?.value,
         search: watchedValues.search,
         page: currentPage,
      });
   }, [currentPage]);

   useEffect(() => {
      setCurrentPage(1);
      debounceFn({
         city: watchedValues.city?.value || currentCity.id,
         search: watchedValues.search,
         page: 1,
      });
   }, [watchedValues]);

   const titleText = currentCity
      ? `Каталог менеджеров в ${capitalizedWord(declensionWordsName(watchedValues.city?.label || currentCity.name, declensionsWordsDataCity, 1))}`
      : '';

   return {
      control,
      reset,
      setValue,
      currentCity,
      isLoading,
      setIsLoading,
      dataItems,
      setDataItems,
      currentPage,
      setCurrentPage,
      titleText,
   };
};
