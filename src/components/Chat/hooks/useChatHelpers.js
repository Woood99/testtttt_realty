import { useEffect, useRef, useState } from 'react';
import isEmptyArrObj from '../../../helpers/isEmptyArrObj';
import { CHAT_TYPES } from '../constants';
import { ROLE_ADMIN } from '../../../constants/roles';

export const useChatHelpers = options => {
   const { currentDialog, userInfo } = options;
   const mainBlockBar = useRef(null);
   const [currentDialogUserInfo, setCurrentDialogUserInfo] = useState({});

   useEffect(() => {
      if (!currentDialog) return;
      setCurrentDialogUserInfo(getDialogUserInfo(currentDialog));
   }, [JSON.stringify(currentDialog)]);

   const checkMyChannelOrGroup = dialog => {
      return Boolean((dialog.dialog_type === CHAT_TYPES.CHANNEL || dialog.dialog_type === CHAT_TYPES.GROUP) && dialog.owner?.id === userInfo.id);
   };

   const checkIsOrganization = dialog => {
      return dialog.organization && userInfo?.role?.id !== ROLE_ADMIN.id;
   };

   const getDialogUserInfo = dialog => {
      if (!dialog) return;
      let res = {};
      const isOrganization = checkIsOrganization(dialog);

      const myChannelOrGroup = checkMyChannelOrGroup(dialog);

      const type_chat = dialog.dialog_type === CHAT_TYPES.CHAT;
      const type_channel = dialog.dialog_type === CHAT_TYPES.CHANNEL;
      const type_group = dialog.dialog_type === CHAT_TYPES.GROUP;

      const defaultOptions = { type_chat, type_channel, type_group, myChannelOrGroup };

      if (!isEmptyArrObj(dialog)) {
         if (isOrganization) {
            res = {
               ...dialog.organization,
               ...defaultOptions,
               isOrganization: true,
               role: ROLE_ADMIN.id,
            };
         } else {
            if (dialog.dialog_type === CHAT_TYPES.CHAT && dialog.companions?.length) {
               res = {
                  ...defaultOptions,
                  ...dialog.companions.find(item => item.id !== userInfo.id),
                  isOrganization: false,
               };
            } else {
               res = {
                  ...defaultOptions,
                  name: dialog.name || dialog.dialog_name,
                  image: dialog.image,
                  isOrganization: false,
               };
            }
         }
      }

      return res;
   };

   const scrollMainBlock = () => {
      setTimeout(() => {
         if (!mainBlockBar.current) return;
         mainBlockBar.current.scrollTop = mainBlockBar.current.scrollHeight;
      }, 1);
   };

   const isOrganization = checkIsOrganization(currentDialog);

   return { mainBlockBar, scrollMainBlock, currentDialogUserInfo, isOrganization, checkMyChannelOrGroup, checkIsOrganization, getDialogUserInfo };
};
