import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { CHAT_TYPES } from '../components/Chat/constants';
import { checkDialogId, getUrlNavigateToChatDialog, getUrlNavigateToChatDialogFake } from '@/api/getDialogId';
import { checkAuthUser, setSelectAccLogModalOpen } from '@/redux';

export const useNavigateToChat = () => {
   const authUser = useSelector(checkAuthUser);
   const dispatch = useDispatch();

   return useCallback(
      async options => {
         if (!options) return;

         const params = { type: CHAT_TYPES.CHAT, ...options };
         if (authUser) {
            const dialog_id = await checkDialogId(params);

            if (dialog_id) {
               getUrlNavigateToChatDialog(dialog_id, null, params.call);
            } else {
               getUrlNavigateToChatDialogFake(params);
            }
         } else {
            dispatch(setSelectAccLogModalOpen(true));
         }
      },
      [authUser, dispatch]
   );
};
