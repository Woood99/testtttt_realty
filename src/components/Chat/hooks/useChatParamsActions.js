import { v4 as uuidv4 } from 'uuid';
import { useSearchParams } from 'react-router-dom';
import isEmptyArrObj from '../../../helpers/isEmptyArrObj';
import { checkDialogId } from '../../../api/getDialogId';
import { sendPostRequest } from '../../../api/requestsApi';
import { useEffect } from 'react';

export const useChatParamsActions = options => {
   const { tag, messageText, fake_dialog, userInfo, setCurrentDialog } = options;

   const [searchParams, setSearchParams] = useSearchParams();

   const fakeDialogDeleteAndSetDialogId = id => {
      const newSearchParams = new URLSearchParams(searchParams);
      newSearchParams.delete('not_dialog');
      newSearchParams.delete('building_id');
      newSearchParams.delete('organization_id');
      newSearchParams.delete('recipients_id');
      newSearchParams.delete('call');
      newSearchParams.set('dialog', id);

      setSearchParams(newSearchParams);
   };

   useEffect(() => {
      if (tag && messageText) {
         const newSearchParams = new URLSearchParams(searchParams);
         newSearchParams.delete('tag');

         setSearchParams(newSearchParams);
      }
   }, [tag]);

   useEffect(() => {
      if (!fake_dialog) return;
      if (isEmptyArrObj(userInfo)) return;

      const fetchData = async () => {
         const check_dialog_id = await checkDialogId(fake_dialog);
         if (check_dialog_id) {
            fakeDialogDeleteAndSetDialogId(check_dialog_id);
         } else {
            const {
               data: { result },
            } = await sendPostRequest('/api/dialogs/info-dialog', fake_dialog);

            setCurrentDialog({
               id: uuidv4(),
               dialog_type: 1,
               un_read_messages_count: 0,
               is_active: 1,
               name: null,
               last_message: null,
               companions: [
                  {
                     id: userInfo.id,
                     image: userInfo.image,
                     name: userInfo.name,
                     surname: userInfo.surname,
                     role: userInfo.role.id,
                     last_seen: userInfo.last_seen,
                     organization_id: userInfo.organization_id,
                     dialogRole: 1,
                  },
                  result.user,
               ],
               owners: [],
               type: 1,
               my_block: false,
               not_my_block: false,
               building: result.building,
               organization: result.organization,
               is_fake: true,
            });
         }
      };

      fetchData();
   }, [fake_dialog, userInfo]);

   return { fakeDialogDeleteAndSetDialogId };
};
