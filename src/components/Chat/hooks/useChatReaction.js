import { useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { sendPostRequest } from '../../../api/requestsApi';

export const useChatReaction = () => {
   const chatReactionCreateFake = useCallback(async (current, setCachedDialog, value, data, userInfo) => {
      try {
         const newItem = {
            id: uuidv4(),
            dialog_id: data.dialog_id,
            message_id: data.id,
            user_id: userInfo.id,
            value,
            loading: true,
            user: {
               id: userInfo.id,
               image: userInfo.image,
               name: userInfo.name,
               surname: userInfo.surname,
               role: userInfo.role.id,
               last_seen: userInfo.last_seen,
               organization_id: userInfo.organization_id,
            },
         };

         const currentMessages = [...current];
         currentMessages.forEach(item => {
            item.blocks.forEach(item => {
               const find = item.messages.find(item => item.id === data.id);
               if (find) {
                  const currentReaction = find.reactions.find(item => item.user_id === userInfo.id);
                  if (currentReaction) {
                     find.reactions = find.reactions.filter(item => item.user_id !== userInfo.id);
                  }
                  find.reactions.push(newItem);
               }
            });
         });

         setCachedDialog(prev => {
            return {
               ...prev,
               [data.dialog_id]: {
                  ...prev[data.dialog_id],
               },
            };
         });
      } catch (error) {
         console.log(error);
      }
   }, []);
   
   const chatReactionDeleteFake = useCallback(async (current, setCachedDialog, data, userInfo) => {
      try {
         const currentMessages = [...current];
         currentMessages.forEach(item => {
            item.blocks.forEach(item => {
               const find = item.messages.find(item => item.id === data.id);
               if (find) {
                  const currentReaction = find.reactions.find(item => item.user_id === userInfo.id);
                  if (currentReaction) {
                     find.reactions = find.reactions.filter(item => item.user_id !== userInfo.id);
                  }
               }
            });
         });
         setCachedDialog(prev => {
            return {
               ...prev,
               [data.dialog_id]: {
                  ...prev[data.dialog_id],
               },
            };
         });
      } catch (error) {}
   }, []);

   const chatReactionCreate = useCallback(async (dialog_id, message_id, value) => {
      if (!value) return;
      try {
         await sendPostRequest('/api/messages/message/reaction/create', { dialog_id, message_id, value });
      } catch (error) {}
   }, []);

   const chatReactionDelete = useCallback(async (id, dialog_id, message_id) => {
      try {
         await sendPostRequest('/api/messages/message/reaction/delete', { id, dialog_id, message_id });
      } catch (error) {}
   }, []);

   return {
      chatReactionCreate,
      chatReactionDelete,
      chatReactionCreateFake,
      chatReactionDeleteFake,
   };
};
