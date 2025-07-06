import { useState } from 'react';
import { sendPostRequest } from '../../api/requestsApi';
import { suggestionsDateRange, suggestionsStatuses, suggestionsTypes } from './suggestions-types';
import { suggestionsCreateDateRange } from './suggestions-create-date-range';

export const useSuggestions = ({ buyer_id, order_id, suggestions_type, customUpdate }) => {
   const [data, setData] = useState({
      items: [],
      pages: 0,
      total: 0,
   });
   const [isLoading, setIsLoading] = useState(true);
   const [cancelModalOpen, setCancelModalOpen] = useState(false);
   const [changeDateModalOpen, setChangeDateModalOpen] = useState(false);
   const [actionsModalOpen, setActionsModalOpen] = useState(false);
   const [notificationData, setNotificationData] = useState(null);
   const [againSuggestionsModalOpen, setAgainSuggestionsModalOpen] = useState(false);

   const [filterFields, setFilterFields] = useState({
      per_page: 15,
      page: 1,
      ...(suggestions_type.author_is_user && { author_is_user: suggestions_type.author_is_user[0].value }),
      ...(suggestions_type.id === suggestionsTypes.sellerHistory.id && { buyer_id }),
      order_id,
      status: suggestionsStatuses[0].value,
      dateRange: suggestionsDateRange[0].value,
      ...suggestionsCreateDateRange(suggestionsDateRange[0].days),
      order_by_created_at: 0,
      order_by_view_time: null,
   });

   const getSuggestions = async state => {
      try {
         const params = {
            ...state,
         };
         delete params.dateRange;

         const { data: result } = await sendPostRequest(suggestions_type.endpoint, params);
         setData(result);
         setIsLoading(false);
      } catch (error) {
         console.log(error);
      }
   };

   const onHandlerConfirmed = async dataConfirm => {
      setActionsModalOpen(false);
      setIsLoading(true);

      const params = {
         date: dataConfirm.date,
         time: dataConfirm.time,
      };
      await sendPostRequest(`${suggestions_type.endpoint}/${dataConfirm.status_id}/confirm`, params);

      if (customUpdate) {
         await customUpdate();
      } else {
         await getSuggestions({
            ...filterFields,
            page: 1,
         });
      }

      setNotificationData({
         title: 'Вы успешно подтвердили заявку на просмотр',
      });
   };

   const onHandlerCancel = async dataCancel => {
      try {
         setCancelModalOpen(false);
         setActionsModalOpen(false);
         setIsLoading(true);

         await sendPostRequest(`${suggestions_type.endpoint}/${dataCancel.status_id}/decline`, dataCancel);

         if (customUpdate) {
            await customUpdate();
         } else {
            await getSuggestions({
               ...filterFields,
               page: 1,
            });
         }

         setNotificationData({
            title: 'Вы успешно отменили заявку на просмотр',
         });
      } catch (error) {
         console.log(error);
      }
   };

   const onHandlerChangeDate = async dataChangeDate => {
      try {
         setChangeDateModalOpen(false);
         setActionsModalOpen(false);
         setIsLoading(true);

         const params = {
            date: dataChangeDate.date,
            time: dataChangeDate.time,
         };

         await sendPostRequest(`${suggestions_type.endpoint}/${dataChangeDate.status_id}/update`, params);

         if (customUpdate) {
            await customUpdate();
         } else {
            await getSuggestions({
               ...filterFields,
               page: 1,
            });
         }

         setNotificationData({
            title: 'Вы успешно изменили дату',
         });
      } catch (error) {
         console.log(error);
      }
   };
   const onHandlerAgainDate = async dataAgainDate => {
      try {
         setAgainSuggestionsModalOpen(false);
         setIsLoading(true);

         const params = {
            date: dataAgainDate.date,
            time: dataAgainDate.time,
         };

         await sendPostRequest(`/buyer-api/suggestions/${dataAgainDate.status_id}/create`, params);

         if (customUpdate) {
            await customUpdate();
         } else {
            await getSuggestions({
               ...filterFields,
               page: 1,
            });
         }

         setNotificationData({
            title: 'Вы успешно записались заново на просмотр',
         });
      } catch (error) {
         console.log(error);
      }
   };

   const onHandlerPurchase = async id => {
      try {
         setActionsModalOpen(false);
         setIsLoading(true);
         await sendPostRequest(`${suggestions_type.endpoint}/${id}/purchase`);

         if (customUpdate) {
            await customUpdate();
         } else {
            await getSuggestions({
               ...filterFields,
               page: 1,
            });
         }

         setNotificationData({
            title: 'Вы успешно забронировали объект',
         });
      } catch (error) {
         console.log(error);
      }
   };

   const currentStatusInfo = suggestionsStatuses.find(item => item.value === filterFields.status);

   return {
      data,
      isLoading,
      setIsLoading,
      filterFields,
      setFilterFields,
      getSuggestions,
      currentStatusInfo,
      onHandlerCancel,
      cancelModalOpen,
      setCancelModalOpen,
      actionsModalOpen,
      setActionsModalOpen,
      notificationData,
      setNotificationData,
      changeDateModalOpen,
      setChangeDateModalOpen,
      onHandlerChangeDate,
      onHandlerConfirmed,
      onHandlerPurchase,
      againSuggestionsModalOpen,
      setAgainSuggestionsModalOpen,
      onHandlerAgainDate,
   };
};
