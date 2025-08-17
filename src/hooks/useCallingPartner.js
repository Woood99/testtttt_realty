import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { CHAT_TYPES } from '../components/Chat/constants';
import { ROLE_ADMIN } from '@/constants';
import { sendPostRequest } from '@/api/requestsApi';
import { checkDialogId, getDialogId } from '@/api/getDialogId';
import { checkAuthUser, setIsCalling, setSelectAccLogModalOpen } from '@/redux';

export const useCallingPartner = () => {
   const authUser = useSelector(checkAuthUser);
   const dispatch = useDispatch();

   return useCallback(
      async options => {
         if (!options) return;

         const params = { type: CHAT_TYPES.CHAT, ...options };
         if (authUser) {
            let dialog_id = await checkDialogId(params);

            if (!dialog_id) {
               dialog_id = await getDialogId(params);
            }
            const { data: currentDialog } = await sendPostRequest(`/api/dialogs/${dialog_id}`, { limit: 1, page: 1 });

            let currentDialogUserInfo = { ...currentDialog.organization, isOrganization: true, role: ROLE_ADMIN.id, id: 1 };

            dispatch(setIsCalling({ dialog_id: dialog_id, partnerInfo: currentDialogUserInfo }));
         } else {
            dispatch(setSelectAccLogModalOpen(true));
         }
      },
      [authUser, dispatch]
   );
};
