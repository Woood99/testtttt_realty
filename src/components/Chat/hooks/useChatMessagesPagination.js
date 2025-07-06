import { useEffect, useRef, useState } from 'react';
import { sendPostRequest } from '../../../api/requestsApi';
import throttle from 'lodash.throttle';

export const chatMergeMessages = (current, newItems, status) => {
   const merged = [...current];

   newItems.forEach(newItem => {
      const existingItemIndex = merged.findIndex(item => item.date === newItem.date);
      if (existingItemIndex !== -1) {
         if (status === 'up') {
            merged[existingItemIndex].messages = [
               ...newItem.messages,
               ...merged[existingItemIndex].blocks.reduce((acc, item) => {
                  acc.push(...item.messages);
                  return acc;
               }, []),
            ];
         }
         if (status === 'down') {
            merged[existingItemIndex].messages = [
               ...merged[existingItemIndex].blocks.reduce((acc, item) => {
                  acc.push(...item.messages);
                  return acc;
               }, []),
               ...newItem.messages,
            ];
         }
      } else {
         if (status === 'up') {
            merged.unshift(newItem);
         }
         if (status === 'down') {
            merged.push(newItem);
         }
      }
   });

   merged.forEach((item, index) => {
      if (!item.messages) {
         merged[index].messages = [
            ...merged[index].blocks.reduce((acc, item) => {
               acc.push(...item.messages);
               return acc;
            }, []),
         ];
      }
      if (item.blocks) {
         delete item.blocks;
      }
   });

   return merged;
};

export const useChatMessagesPagination = options => {
   const { chatPinMessages, dialogsActions, setIsLoadingDialog, cachedDialog, setCachedDialog, currentDialog, mainBlockBar, setDialogs } = options;

   const [messages, setMessages] = useState([]);
   const [isLoadingPagination, setIsLoadingPagination] = useState(false);
   const [paginationPageMin, setPaginationPageMin] = useState(null);
   const [paginationPageMax, setPaginationPageMax] = useState(null);

   const scrollPositionRef = useRef({ top: 0, height: 0 });

   const getDialog = async id => {
      const data = await getDialogAction(id, null);
      setPaginationPageMin(data.current_page);
      setPaginationPageMax(data.current_page);

      await setDialogData({ id, ...data });

      // await new Promise(resolve => setTimeout(resolve, 400));
      setIsLoadingDialog(false);
   };

   const setDialogData = async data => {
      const messagesData = data.no_refact ? data.result : dialogsActions.refactDialog(data.result);
      
      setMessages(messagesData);

      setCachedDialog(prev => ({
         ...prev,
         [data.id]: { ...data, result: messagesData },
      }));

      await chatPinMessages.pinMessageGetAll(data.id);
   };

   const getDialogAction = async (id, page) => {
      const { data } = await sendPostRequest(`/api/dialogs/${id}`, { limit: 120, page });
      updateUnreadCount(id, data.unread_count);

      return { ...data, id };
   };

   useEffect(() => {
      const scrollableElement = mainBlockBar.current;
      if (!scrollableElement) return;

      const handleScrollUp = throttle(async () => {
         try {
            if (!(scrollableElement.scrollTop <= 200)) return;
            if (isLoadingPagination) return;
            const current = cachedDialog[currentDialog.id];

            if (!current);
            if (!current.has_newer) return;

            setIsLoadingPagination(true);

            const data = await getDialogAction(current.id, paginationPageMin - 1);
            setPaginationPageMin(paginationPageMin - 1);

            scrollPositionRef.current = {
               top: scrollableElement.scrollTop,
               height: scrollableElement.scrollHeight,
            };

            const messagesData = dialogsActions.refactDialog(chatMergeMessages(current.result, data.result, 'up'));

            setMessages(messagesData);

            setCachedDialog(prev => ({
               ...prev,
               [data.id]: { ...data, result: messagesData },
            }));

            setTimeout(() => {
               scrollPositionTopMessage();
               setIsLoadingPagination(false);
            }, 10);
         } catch (error) {
            console.log(error);
         }
      }, 200);

      const handleScrollDown = throttle(async () => {
         try {
            const { scrollHeight, scrollTop, clientHeight } = scrollableElement;
            const isNearBottom = scrollHeight - scrollTop <= clientHeight + 200;
            if (!isNearBottom || isLoadingPagination) return;

            const current = cachedDialog[currentDialog.id];

            if (!current || current.unread_count === 0) return;
            console.log('down');

            setIsLoadingPagination(true);
            scrollPositionRef.current = {
               top: scrollableElement.scrollTop,
               height: scrollableElement.scrollHeight,
            };

            const data = await getDialogAction(current.id, paginationPageMax + 1);
            setPaginationPageMax(paginationPageMax + 1);

            const messagesData = dialogsActions.refactDialog(chatMergeMessages(current.result, data.result, 'down'));

            setMessages(messagesData);
            setIsLoadingPagination(false);

            setCachedDialog(prev => ({
               ...prev,
               [data.id]: { ...data, result: messagesData },
            }));
         } catch (error) {
            console.log(error);
         }
      });

      const scrollPositionTopMessage = () => {
         const scrollableElement = mainBlockBar.current;
         const newScrollTop = scrollableElement.scrollHeight - scrollPositionRef.current.height;
         scrollableElement.scrollTop = newScrollTop + scrollPositionRef.current.top;
      };

      if (scrollableElement) {
         scrollableElement.addEventListener('scroll', handleScrollUp);
         scrollableElement.addEventListener('scroll', handleScrollDown);
      }

      return () => {
         if (scrollableElement) {
            scrollableElement.removeEventListener('scroll', handleScrollUp);
            scrollableElement.removeEventListener('scroll', handleScrollDown);
         }
      };
   }, [mainBlockBar.current, isLoadingPagination, JSON.stringify(currentDialog), JSON.stringify(cachedDialog)]);

   const updateUnreadCount = (id, count) => {
      setDialogs(prev => {
         return prev.map(item => {
            if (item.id === id) {
               return { ...item, un_read_messages_count: count };
            }
            return item;
         });
      });
   };

   return { getDialog, messages, setMessages };
};
