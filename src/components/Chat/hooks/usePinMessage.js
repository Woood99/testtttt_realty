import { useCallback, useState } from 'react';
import { sendPostRequest } from '../../../api/requestsApi';

export const usePinMessage = options => {
   const { refactDialog } = options;

   const [pinMessages, setPinMessages] = useState([]);
   const [isPinMessagePanelOpen, setIsPinMessagePanelOpen] = useState(false);

   const pinMessageCreateFake = useCallback(async (current, data) => {
      try {
         const currentMessages = [...current];
         currentMessages.forEach(item => {
            item.blocks.forEach(item => {
               const find = item.messages.find(item => item.id === data.id);
               if (find) {
                  find.is_pin = 1;
               }
            });
         });
      } catch (error) {
         console.log(error);
      }
   }, []);

   const pinMessageDeleteFake = useCallback(async (current, data) => {
      try {
         const currentMessages = [...current];
         currentMessages.forEach(item => {
            item.blocks.forEach(item => {
               const find = item.messages.find(item => item.id === data.id);
               if (find) {
                  find.is_pin = 0;
               }
            });
         });
      } catch (error) {
         console.log(error);
      }
   }, []);

   const pinMessageCreate = useCallback(async (dialog_id, message_id) => {
      try {
         await sendPostRequest('/api/dialogs/message/pin/create', { dialog_id, message_id });
      } catch (error) {
         console.log(error);
      }
   }, []);

   const pinMessageDelete = useCallback(async (dialog_id, message_id) => {
      try {
         await sendPostRequest('/api/dialogs/message/pin/delete', { dialog_id, message_id });
      } catch (error) {
         console.log(error);
      }
   }, []);

   const pinMessageGetAll = useCallback(async dialog_id => {
      try {
         const {
            data: { result },
         } = await sendPostRequest('/api/dialogs/message/pin/all', { dialog_id });
         setPinMessages(refactDialog(result));
      } catch (error) {
         console.log(error);
      }
   }, []);

   const pinMessagePanelOpen = useCallback(() => {
      setIsPinMessagePanelOpen(true);
   }, []);

   const pinMessagePanelClose = useCallback(() => {
      setIsPinMessagePanelOpen(false);
   }, []);

   const pinMessagesList = pinMessages.flatMap(day =>
      day.blocks.flatMap(block =>
         block.messages.map(msg => ({
            ...msg,
         }))
      )
   );

   return {
      pinMessageCreate,
      pinMessageDelete,
      pinMessageGetAll,
      pinMessages,
      pinMessagesList,
      pinMessagesLength: pinMessagesList.length,
      hasPinMessage: pinMessagesList.length > 0,
      isPinMessagePanelOpen,
      pinMessagePanelOpen,
      pinMessagePanelClose,
      setPinMessages,
      pinMessageCreateFake,
      pinMessageDeleteFake,
   };
};
