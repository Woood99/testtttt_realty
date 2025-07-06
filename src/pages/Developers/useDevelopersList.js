import { useCallback, useEffect, useState } from 'react';
import debounce from 'lodash.debounce';
import { useForm, useWatch } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { sendPostRequest } from '../../api/requestsApi';
import {  getCurrentCitySelector } from '../../redux/helpers/selectors';
import { capitalizedWord } from '../../helpers/changeString';
import { declensionWordsName } from '../../helpers/declensionWords';
import { declensionsWordsDataCity } from '../../data/declensionsWordsData';

export const useDevelopersList = () => {
   const currentCity = useSelector(getCurrentCitySelector);

   const { control, reset, setValue } = useForm();
   const [isLoading, setIsLoading] = useState(true);

   const [currentPage, setCurrentPage] = useState(1);

   const watchedValues = useWatch({
      control,
   });

   const [dataItems, setDataItems] = useState({
      total: 0,
   });

   const handleSubmitFn = data => {
      setIsLoading(true);
      sendPostRequest('/api/developers/page', { ...data, page: data.page }).then(res => {
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
      ? `Каталог застройщиков в ${capitalizedWord(declensionWordsName(watchedValues.city?.label || currentCity.name, declensionsWordsDataCity, 1))}`
      : '';

   return { currentCity, control, reset, setValue, isLoading, currentPage, setCurrentPage, watchedValues, dataItems, titleText };
};
