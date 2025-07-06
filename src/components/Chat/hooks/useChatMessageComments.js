import { useCallback, useState } from 'react';
import { sendPostRequest } from '../../../api/requestsApi';

const chatMessageDefaultData = {
   isOpen: false,
   dialog_id: null,
   message_id: null,
   data: [],
};

export const useChatMessageComments = options => {
   const { refactDialog } = options;

   const [messageComments, setMessageComments] = useState(chatMessageDefaultData);
   const [isLoadingComments, setIsLoadingComments] = useState(false);

   const messageCommentCreate = useCallback(async (dialog_id, message_id, text) => {
      try {
         await sendPostRequest('/api/messages/message/comment/create', {
            dialog_id,
            message_id,
            text,
         });
      } catch (error) {
         console.log(error);
      }
   }, []);

   const messageCommentUpdate = useCallback(async (id, dialog_id, message_id, text) => {
      try {
         await sendPostRequest('/api/messages/message/comment/update', {
            id,
            dialog_id,
            message_id,
            text,
         });
      } catch (error) {
         console.log(error);
      }
   }, []);

   const messageCommentDelete = useCallback(async (id, dialog_id, message_id) => {
      await sendPostRequest('/api/messages/message/comment/delete', {
         id,
         dialog_id,
         message_id,
      });
   }, []);

   const messageCommentGetAll = useCallback(async (dialog_id, message_id) => {
      try {
         setIsLoadingComments(true);

         const {
            data: { result },
         } = await sendPostRequest('/api/messages/message/comment/all', { dialog_id, message_id });

         setMessageComments(prev => ({
            ...prev,
            data: refactDialog(result),
         }));
         setIsLoadingComments(false);
      } catch (error) {
         console.log(error);
      }
   }, []);

   const messageCommentPanelOpen = useCallback(async (dialog_id, message_id) => {
      setMessageComments({
         isOpen: true,
         dialog_id,
         message_id,
         data: [],
      });
      messageCommentGetAll(dialog_id, message_id);
   }, []);

   const messageCommentPanelClose = useCallback(() => {
      setMessageComments(chatMessageDefaultData);
   }, []);

   return {
      messageCommentCreate,
      messageCommentUpdate,
      messageCommentDelete,
      messageCommentGetAll,
      messageComments,
      messageCommentsIsOpen: messageComments.isOpen,
      messagesLength: messageComments.data.flatMap(day => day.blocks.flatMap(block => block.messages)).length,
      messageCommentPanelOpen,
      messageCommentPanelClose,
      isLoadingComments,
   };
};
