import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import dayjs from 'dayjs';

import { choiceApartmentsFilterOptions } from '../../../data/selectsField';
import convertToDate from '../../../helpers/convertToDate';
import { stringToNumber } from '../../../helpers/changeString';
import { sendPostRequest } from '../../../api/requestsApi';
import { isNumber } from '../../../helpers/isEmptyArrObj';
import { OPTIONS_SUMM, OPTIONS_TYPE } from './constants';

export const useDiscountCashbackApartmentsForm = optionsData => {
   const {
      handleSubmit,
      control,
      setValue,
      watch,
      formState: { errors },
   } = useForm();
   const { condition, set, options, fetchData } = optionsData;

   const [selectedApartments, setSelectedApartments] = useState([]);
   const [filterFields, setFilterFields] = useState(choiceApartmentsFilterOptions);
   const [defaultApartmentIds, setDefaultApartmentsIds] = useState([]);
   const [isLoading, setIsLoading] = useState(true);

   const [defaultData, setDefaultData] = useState({});

   useEffect(() => {
      const getDataById = async () => {
         if (!isNumber(condition) || !options.is_edit) {
            setIsLoading(false);
            return;
         }
         const url = options.type === 'discount' ? '/admin-api/building-discount/show' : '/admin-api/building-cashback/show';
         const requestDataOptions = {
            building_id: +options.id,
         };
         if (options.type === 'discount') requestDataOptions.discount_id = +condition;
         if (options.type === 'cashback') requestDataOptions.cashback_id = +condition;

         const {
            data: { result },
         } = await sendPostRequest(url, requestDataOptions);

         setFilterFields(JSON.parse(result.filters_info));
         setDefaultApartmentsIds(result.apartments.map(item => item.id));
         setValue('start_date', dayjs(result.start_date).format('DD.MM.YYYY'));
         setValue('end_date', dayjs(result.end_date).format('DD.MM.YYYY'));
         setValue(
            'type',
            OPTIONS_TYPE.find(item => item.id === result.type)
         );
         if (result.type === 1 || options.type === 'cashback') {
            setValue('type_prc', String(result.value));
         }

         if (result.type === 2) {
            setValue('type_summ', String(result.value));
         }

         if (options.type === 'discount') {
            const currentUnit = OPTIONS_SUMM.find(item => item.id === result.unit);
            if (currentUnit) {
               setValue(currentUnit.value, true);

               if (currentUnit.value === 'discount_summ') {
                  setValue('discount_square', false);
               }
               if (currentUnit.value === 'discount_square') {
                  setValue('discount_summ', false);
               }
            }
         }

         setDefaultData(result);

         setTimeout(() => {
            setIsLoading(false);
         }, 200);
      };
      getDataById();
   }, [condition]);

   const onSubmitHandler = async data => {
      if (selectedApartments.length === 0) return;
      const type = data.type?.value;
      const is_prc = type === 'prc';
      const is_summ = type === 'summ';

      const requestDataOptions = {
         building_id: +options.id,
         start_date: dayjs(convertToDate(data.start_date, 'DD-MM-YYYY'), 'DD.MM.YYYY').format('YYYY-MM-DD'),
         end_date: dayjs(convertToDate(data.end_date, 'DD-MM-YYYY'), 'DD.MM.YYYY').format('YYYY-MM-DD'),
         apartment_ids: selectedApartments.map(item => item.value),
         filters_info: JSON.stringify(filterFields),
         value: is_prc ? stringToNumber(data.type_prc) : is_summ ? stringToNumber(data.type_summ) : null,
      };

      if (options.type === 'discount') {
         const requestData = {
            building_id: requestDataOptions.building_id,
            type: is_prc ? 1 : is_summ ? 2 : null,
            unit: is_summ ? (data.discount_summ ? 1 : data.discount_square ? 2 : null) : 1,
            value: is_prc ? stringToNumber(data.type_prc) : is_summ ? stringToNumber(data.type_summ) : null,
            filters_info: requestDataOptions.filters_info,
            start_date: requestDataOptions.start_date,
            end_date: requestDataOptions.end_date,
            apartment_ids: requestDataOptions.apartment_ids,
         };

         if (options.is_edit) {
            await sendPostRequest('/admin-api/building-discount/update', { ...requestData, discount_id: defaultData.id });
         } else {
            await sendPostRequest('/admin-api/building-discount/create', requestData);
         }
      }

      if (options.type === 'cashback') {
         const requestData = {
            building_id: requestDataOptions.building_id,
            unit: 1,
            value: stringToNumber(data.type_prc),
            filters_info: requestDataOptions.filters_info,
            start_date: requestDataOptions.start_date,
            end_date: requestDataOptions.end_date,
            apartment_ids: requestDataOptions.apartment_ids,
         };

         if (options.is_edit) {
            await sendPostRequest('/admin-api/building-cashback/update', { ...requestData, cashback_id: defaultData.id });
         } else {
            await sendPostRequest('/admin-api/building-cashback/create', requestData);
         }
      }

      set(false);
      if (fetchData) await fetchData();
   };

   const watch_type = options.type === 'discount' ? watch('type') : OPTIONS_TYPE[1];

   const isCreateDiscountTitle = options.type === 'discount' && !options.is_edit && 'Добавить скидку на квартиры';
   const isCreateCashbackTitle = options.type === 'cashback' && !options.is_edit && 'Добавить скидку на квартиры';
   const isEditDiscountTitle = options.type === 'discount' && options.is_edit && 'Редактировать скидку на квартиры';
   const isEditCashbackTitle = options.type === 'cashback' && options.is_edit && 'Редактировать кешбэк на квартиры';

   return {
      setSelectedApartments,
      filterFields,
      setFilterFields,
      defaultApartmentIds,
      isLoading,
      handleSubmit,
      control,
      setValue,
      watch,
      errors,
      onSubmitHandler,
      isCreateDiscountTitle,
      isCreateCashbackTitle,
      isEditDiscountTitle,
      isEditCashbackTitle,
      watch_type,
   };
};
