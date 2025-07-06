import { useEffect, useRef, useState } from 'react';
import isEmptyArrObj from '../../../helpers/isEmptyArrObj';
import { CHAT_TYPES } from '../constants';
import { ROLE_ADMIN } from '../../../constants/roles';

export const useChatHelpers = options => {
   const { currentDialog, userInfo } = options;
   const mainBlockBar = useRef(null);
   const [currentDialogUserInfo, setCurrentDialogUserInfo] = useState({});

   const isOrganization = currentDialog.organization && userInfo?.role?.id !== ROLE_ADMIN.id;
   const myChannelOrGroup = Boolean(
      (currentDialog.dialog_type === CHAT_TYPES.CHANNEL || currentDialog.type_group === CHAT_TYPES.GROUP) && currentDialog.owner?.id === userInfo.id
   );

   useEffect(() => {
      if (!isEmptyArrObj(currentDialog)) {
         if (isOrganization) {
            setCurrentDialogUserInfo({
               ...currentDialog.organization,
               isOrganization: true,
               role: ROLE_ADMIN.id,
               myChannelOrGroup,
            });
         } else {
            if (currentDialog.dialog_type === CHAT_TYPES.CHAT && currentDialog.companions?.length) {
               setCurrentDialogUserInfo({
                  ...currentDialog.companions.find(item => item.id !== userInfo.id),
                  isOrganization: false,
                  myChannelOrGroup,
               });
            } else {
               setCurrentDialogUserInfo({
                  name: currentDialog.name || currentDialog.dialog_name,
                  image: currentDialog.image,
                  isOrganization: false,
                  myChannelOrGroup,
               });
            }
         }
      }
   }, [JSON.stringify(currentDialog)]);

   const scrollMainBlock = () => {
      setTimeout(() => {
         if (!mainBlockBar.current) return;
         mainBlockBar.current.scrollTop = mainBlockBar.current.scrollHeight;
      }, 1);
   };

   return { mainBlockBar, scrollMainBlock, currentDialogUserInfo, isOrganization };
};
