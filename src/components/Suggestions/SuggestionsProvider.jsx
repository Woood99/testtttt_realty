import { useEffect } from 'react';
import { useDebounceEffect } from 'ahooks';
import { createPortal } from 'react-dom';

import { SuggestionsContext } from '../../context';
import { useSuggestions } from './useSuggestions';
import ModalWrapper from '../../ui/Modal/ModalWrapper';
import DenyModal from '../../ModalsMain/DenyModal';
import { NotificationTimer } from '../../ui/Tooltip';
import RecordViewing from '../../ModalsMain/RecordViewing';

const SuggestionsProvider = ({ children, order_id = null, buyer_id = null, suggestions_type = null, customUpdate = null }) => {
   if (!suggestions_type) return;

   const suggestionsOptions = useSuggestions({ order_id, buyer_id, suggestions_type, customUpdate });
   const { setIsLoading, getSuggestions, filterFields } = suggestionsOptions;

   useEffect(() => {
      setIsLoading(true);
   }, [JSON.stringify(filterFields), order_id]);

   useEffect(() => {
      const fetchData = async () => {
         // const dataOne = await getDataRequest('/buyer-api/suggestions/124');
      };

      fetchData();
   }, []);

   useDebounceEffect(
      () => {
         getSuggestions(filterFields);
      },
      [JSON.stringify(filterFields), order_id],
      { wait: 550 }
   );

   return (
      <SuggestionsContext.Provider value={{ order_id, suggestions_type, ...suggestionsOptions }}>
         {children}
         <ModalWrapper condition={suggestionsOptions.cancelModalOpen}>
            <DenyModal
               condition={suggestionsOptions.cancelModalOpen !== false}
               set={suggestionsOptions.setCancelModalOpen}
               onSubmit={value => {
                  suggestionsOptions.onHandlerCancel({ ...value, status_id: suggestionsOptions.cancelModalOpen });
               }}
            />
         </ModalWrapper>
         <ModalWrapper condition={suggestionsOptions.changeDateModalOpen}>
            <RecordViewing
               condition={suggestionsOptions.changeDateModalOpen}
               set={suggestionsOptions.setChangeDateModalOpen}
               type={suggestionsOptions.changeDateModalOpen?.type}
               id={suggestionsOptions.changeDateModalOpen?.id}
               objectData={suggestionsOptions.changeDateModalOpen}
               editData={suggestionsOptions.changeDateModalOpen}
               title="Изменить дату просмотра"
               customSubmit={async data => {
                  suggestionsOptions.onHandlerChangeDate({ ...data, status_id: suggestionsOptions.changeDateModalOpen.status_id });
               }}
            />
         </ModalWrapper>
         <ModalWrapper condition={suggestionsOptions.againSuggestionsModalOpen}>
            <RecordViewing
               condition={Boolean(suggestionsOptions.againSuggestionsModalOpen)}
               set={suggestionsOptions.setAgainSuggestionsModalOpen}
               type={suggestionsOptions.againSuggestionsModalOpen?.type}
               id={suggestionsOptions.againSuggestionsModalOpen?.id}
               objectData={suggestionsOptions.againSuggestionsModalOpen}
               orderId={suggestionsOptions.againSuggestionsModalOpen?.status_id}
               title="Записаться заново на просмотр"
               customSubmit={async data => {
                  suggestionsOptions.onHandlerAgainDate({ ...data, status_id: suggestionsOptions.againSuggestionsModalOpen.status_id });
               }}
            />
         </ModalWrapper>

         {suggestionsOptions.notificationData &&
            createPortal(
               <NotificationTimer
                  show={suggestionsOptions.notificationData}
                  set={suggestionsOptions.setNotificationData}
                  onClose={() => suggestionsOptions.setNotificationData(null)}
                  classListRoot="!pr-12">
                  <h3 className="title-3 !text-white">{suggestionsOptions.notificationData?.title}</h3>
               </NotificationTimer>,
               document.getElementById('overlay-wrapper')
            )}
      </SuggestionsContext.Provider>
   );
};

export default SuggestionsProvider;
