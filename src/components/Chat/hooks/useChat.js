import { useCallback, useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import debounce from 'lodash.debounce';

import { sendPostRequest } from '../../../api/requestsApi';
import { refactPhotoStageAppend, refactPhotoStageOne, refactPhotoStageTwo } from '../../../helpers/photosRefact';
import convertFieldsJSON from '../../../helpers/convertFieldsJSON';
import { getUserInfo } from '../../../redux/helpers/selectors';
import { CHAT_TAGS } from '../../../constants/chat-tags';
import { usePinMessage } from './usePinMessage';
import isEmptyArrObj from '../../../helpers/isEmptyArrObj';
import { useChatMessageComments } from './useChatMessageComments';
import { useChatDialogs } from './useChatDialogs';
import { useChatHelpers } from './useChatHelpers';
import { useChatMessagesPagination } from './useChatMessagesPagination';
import { useBlockUser } from './useBlockUser';
import { useTheme } from './useTheme';
import { getDialogId } from '../../../api/getDialogId';
import { useChatParamsActions } from './useChatParamsActions';
import { CHAT_TYPES } from '../constants';

export const useChat = options => {
   const { defaultDialogId, tag, fake_dialog } = options;

   const [currentDialog, setCurrentDialog] = useState({});
   const [currentDialogSettings, setCurrentDialogSettings] = useState({});

   const userInfo = useSelector(getUserInfo);

   const [showPopperMessage, setShowPopperMessage] = useState(false);

   const [dialogs, setDialogs] = useState([]);
   const [cachedDialog, setCachedDialog] = useState({});
   const [isLoadingDialogs, setIsLoadingDialogs] = useState(true);

   const [filesUpload, setFilesUpload] = useState([]);

   const [messageText, setMessageText] = useState(tag ? CHAT_TAGS.find(item => item.id === +tag)?.text || '' : '');

   const [isLoadingDialog, setIsLoadingDialog] = useState(true);
   const [allowScroll, setAllowScroll] = useState(true);

   const chatRootRef = useRef(null);
   const chatBottomRef = useRef(null);

   const [deleteMessagesModal, setDeleteMessagesModal] = useState(false);
   const [isVoiceRecording, setIsVoiceRecording] = useState(false);

   const [isOpenMenu, setIsOpenMenu] = useState(false);
   const [isOpenSmileMenu, setIsOpenSmileMenu] = useState(false);
   const [isVisibleBtnArrow, setIsVisibleBtnArrow] = useState(false);
   const [forwardMessageId, setForwardMessageId] = useState(false);
   const [createEventModal, setCreateEventModal] = useState(false);
   const [apartmentsByBuildingModal, setApartmentsByBuildingModal] = useState(false);

   const [isEdit, setIsEdit] = useState(false);

   const dialogBuilding = currentDialog.building ? convertFieldsJSON(currentDialog.building) : null;
   const isVisibleVideoCall = !currentDialog.is_fake && currentDialog?.dialog_type === CHAT_TYPES.CHAT;

   const [searchParams, setSearchParams] = useSearchParams();
   const dialogsActions = useChatDialogs();
   const chatPinMessages = usePinMessage({ refactDialog: dialogsActions.refactDialog });
   const messageCommentsOptions = useChatMessageComments({ refactDialog: dialogsActions.refactDialog });
   const { fakeDialogDeleteAndSetDialogId } = useChatParamsActions({ tag, messageText, fake_dialog, userInfo, setCurrentDialog });
   const blockUserOptins = useBlockUser();
   const themeOptions = useTheme();

   const currentChannel = useRef(null);

   const chatHelpers = useChatHelpers({ currentDialog, userInfo });
   const chatMessages = useChatMessagesPagination({
      currentDialog,
      chatPinMessages,
      dialogsActions,
      setIsLoadingDialog,
      cachedDialog,
      setCachedDialog,
      mainBlockBar: chatHelpers.mainBlockBar,
      setDialogs,
   });

   const debouncedHandleDataDialogs = useCallback(
      debounce(async () => {
         const res = await dialogsActions.getDialogs();
         setDialogs(res);
      }, 1200),
      []
   );

   const debouncedHandleDataDialog = useCallback(
      debounce(async ({ dialog_id }) => {
         const dialogs = await dialogsActions.getDialogs();
         setDialogs(dialogs);
         setCurrentDialog(prev => {
            const dialog = dialogs.find(item => item.id === prev.id);
            if (dialog) {
               return dialog;
            }

            return prev;
         });

         const scrollbar = chatHelpers.mainBlockBar.current;

         const isBottom = scrollbar && scrollbar.scrollTop + scrollbar.clientHeight >= scrollbar.scrollHeight - 150;
         if (dialogs.find(item => item.id === dialog_id)) {
            await chatMessages.getDialog(dialog_id);
         } else {
            const newSearchParams = new URLSearchParams(searchParams);
            newSearchParams.delete('dialog');
            setSearchParams(newSearchParams);
         }

         if (isBottom) {
            scrollbar.scrollTop = scrollbar.scrollHeight;
         }
      }, 1200),
      [currentDialog]
   );

   const updateDialogsAndDialogSettings = async () => {
      const dialogsData = await dialogsActions.getDialogs();
      setDialogs(dialogsData);
      if (currentDialog.id) {
         setCurrentDialog(dialogsData.find(item => item.id === currentDialog.id) || {});
      }

      const currentIdSettings = currentDialogSettings?.id;
      if (currentIdSettings) {
         setCurrentDialogSettings(dialogsData.find(item => item.id === currentIdSettings) || {});
      }
   };

   useEffect(() => {
      if (isEmptyArrObj(userInfo)) return;

      const fetchData = async () => {
         setIsLoadingDialogs(true);

         const dialogsData = await dialogsActions.getDialogs();
         setDialogs(dialogsData);

         setIsLoadingDialogs(false);

         const channelDialog = window.Echo.join(`user-dialogs.${userInfo.id}`);
         channelDialog.stopListening('UserDialogsEvent');
         channelDialog.listen('UserDialogsEvent', data => {
            debouncedHandleDataDialogs();
         });
      };

      fetchData();
   }, [userInfo]);

   useEffect(() => {
      if (isEmptyArrObj(userInfo)) return;

      if (!defaultDialogId) {
         setIsLoadingDialog(false);
         setCurrentDialog({});
         chatMessages.setMessages([]);
         chatPinMessages.setPinMessages([]);
         setCachedDialog({});
         return;
      }

      fetchData();

      async function fetchData() {
         setIsLoadingDialog(true);
         setAllowScroll(true);
         const dialogsData = await dialogsActions.getDialogs();

         const dialogById = dialogsData.find(item => item.id === defaultDialogId);
         if (dialogById) {
            setCachedDialog({});
            chatMessages.setMessages([]);

            setCurrentDialog(dialogById);
            await chatMessages.getDialog(defaultDialogId);
            connectToChat(defaultDialogId);
         }
         // await new Promise(resolve => setTimeout(resolve, 400));
         setIsLoadingDialog(false);
      }
   }, [defaultDialogId, userInfo]);

   useEffect(() => {
      if (!currentDialog.is_fake || !fake_dialog) return;

      const fetchData = async () => {
         const dialog_id = await getDialogId(fake_dialog);
         fakeDialogDeleteAndSetDialogId(dialog_id);
      };

      fetchData();
   }, [fake_dialog, currentDialog.is_fake]);

   const connectToChat = id => {
      if (currentChannel.current) {
         window.Echo.leave(currentChannel.current.name);
      }

      currentChannel.current = window.Echo.join(`dialog.${id}`);
      currentChannel.current.listen('DialogEvent', () => {
         debouncedHandleDataDialog({ dialog_id: id });
      });
   };

   const sendMessage = async (audioBlob = null, videoBlob = null) => {
      if (!isEdit) {
         const obj = {
            dialog_id: currentDialog.id,
            text: messageText || '',
            photos: filesUpload.filter(item => item.type === 'image'),
            video: videoBlob ? [videoBlob] : filesUpload.filter(item => item.type === 'video'),
         };

         const formData = new FormData();

         if (currentDialog.is_fake) {
            const dialog_id = await getDialogId(fake_dialog);
            formData.append('dialog_id', dialog_id);
            fakeDialogDeleteAndSetDialogId(dialog_id);
         } else {
            formData.append('dialog_id', obj.dialog_id);
         }

         formData.append('text', obj.text);

         if (obj.photos?.length) {
            obj.photos = refactPhotoStageOne(obj.photos);
            refactPhotoStageAppend(obj.photos, formData);
            obj.photos = refactPhotoStageTwo(obj.photos);
            formData.append('photos', JSON.stringify(obj.photos));
         }

         if (obj.video?.length) {
            formData.append('video', obj.video[0].file);
            formData.append('is_story', obj.video[0].is_story ? 1 : 0);
         }

         if (audioBlob) {
            let file = new File([audioBlob], 'audio.ogg', {
               type: 'audio/ogg',
            });

            formData.append('audio', file);
         }

         setMessageText('');
         setFilesUpload([]);

         const dialogAddMessageFetch = async formData => {
            const updatedMessages = await dialogsActions.dialogAddMessage(chatMessages.messages, formData);

            chatMessages.setMessages(updatedMessages);
         };
         await dialogAddMessageFetch(formData);

         setTimeout(() => {
            chatHelpers.scrollMainBlock();
         }, 100);

         await sendPostRequest('/api/messages/new-message', formData, {
            'Content-Type': 'multipart/form-data',
            'Accept-Encodin': 'gzip, deflate, br, zstd',
            Accept: 'application/json',
         });
      } else {
         const obj = {
            text: isEdit.text || '',
            id: isEdit.id,
            dialog_id: isEdit.dialog_id,
            photos: filesUpload.filter(item => item.type === 'image').map(item => ({ ...item, image: item.image.url })),
         };

         const formData = new FormData();

         formData.append('text', obj.text);
         formData.append('id', obj.id);
         formData.append('dialog_id', obj.dialog_id);

         if (obj.photos?.length) {
            obj.photos = refactPhotoStageOne(obj.photos);
            refactPhotoStageAppend(obj.photos, formData);
            obj.photos = refactPhotoStageTwo(obj.photos);
            formData.append('photos', JSON.stringify(obj.photos));
         }

         await sendPostRequest('/api/messages/update-message', formData, {
            'Content-Type': 'multipart/form-data',
            'Accept-Encodin': 'gzip, deflate, br, zstd',
            Accept: 'application/json',
         });
         setIsEdit(false);
         setFilesUpload([]);
      }
   };

   const sendVoiceRecorder = blob => {
      sendMessage(blob);
   };

   const deleteMessages = (ids = [], dialog_id = null, all = false) => {
      if (dialog_id === null) return;
      setDeleteMessagesModal({
         ids,
         dialog_id,
         all,
      });
   };

   const forwardMessage = (messageId, toDialogId) => {
      console.log(messageId, toDialogId);
   };

   return {
      dialogs,
      currentDialog,
      setCurrentDialog,
      connectToChat,
      setIsLoadingDialog,
      isLoadingDialog,
      sendMessage,
      ...chatHelpers,
      messageText,
      setMessageText,
      chatBottomRef,
      chatRootRef,
      sendVoiceRecorder,
      setDialogs,
      deleteMessages,
      ...dialogsActions,
      ...chatMessages,
      isEdit,
      setIsEdit,
      isVoiceRecording,
      setIsVoiceRecording,
      filesUpload,
      setFilesUpload,
      dialogBuilding,
      isOpenSmileMenu,
      setIsOpenSmileMenu,
      isOpenMenu,
      setIsOpenMenu,
      isVisibleBtnArrow,
      setIsVisibleBtnArrow,
      deleteMessagesModal,
      setDeleteMessagesModal,
      userInfo,
      isLoadingDialogs,
      forwardMessage,
      forwardMessageId,
      setForwardMessageId,
      createEventModal,
      setCreateEventModal,
      chatPinMessages,
      currentDialogSettings,
      setCurrentDialogSettings,
      updateDialogsAndDialogSettings,
      messageCommentsOptions,
      cachedDialog,
      setCachedDialog,
      blockUserOptins,
      themeOptions,
      showPopperMessage,
      setShowPopperMessage,
      fakeDialogDeleteAndSetDialogId,
      allowScroll,
      setAllowScroll,
      isVisibleVideoCall,
      apartmentsByBuildingModal,
      setApartmentsByBuildingModal,
   };
};
