import { useCallback, useState } from 'react';
import { sendPostRequest } from '../../../api/requestsApi';

export const useBlockUser = () => {
   const [blockUsersList, setBlockUsersList] = useState([]);
   const [isLoading, setIsLoading] = useState(false);
   const [isLoadingAction, setIsLoadingAction] = useState(false);

   const blockUsersGetAll = useCallback(async () => {
      try {
         setIsLoading(true);
         const {
            data: { result },
         } = await sendPostRequest('/api/dialogs/user-blocks/all');
         setBlockUsersList(result);
         setIsLoading(false);
      } catch (error) {
         console.log(error);
      }
   }, []);

   const blockUserCreate = useCallback(async user_id => {
      try {
         await sendPostRequest('/api/dialogs/user-blocks/create', { user_id });
      } catch (error) {}
   }, []);

   const blockUserDelete = useCallback(async user_id => {
      try {
         await sendPostRequest('/api/dialogs/user-blocks/delete', { user_id });
      } catch (error) {}
   }, []);

   return {
      blockUserCreate,
      blockUserDelete,
      blockUsersList,
      blockUsersGetAll,
      isLoading,
      isLoadingAction,
      setIsLoadingAction,
   };
};
