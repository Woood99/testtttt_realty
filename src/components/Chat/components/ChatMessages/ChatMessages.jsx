import React, { useContext, useState } from 'react';
import dayjs from 'dayjs';
import cn from 'classnames';

import { ChatContext, ChatMessagesContext } from '../../../../context';
import SimpleScrollbar from '../../../../ui/Scrollbar';

import styles from '../../Chat.module.scss';
import Avatar from '../../../../ui/Avatar';

import { capitalizeWords } from '../../../../helpers/changeString';

import ModalWrapper from '../../../../ui/Modal/ModalWrapper';
import Modal from '../../../../ui/Modal';
import { useChatMessages } from '../../hooks';
import { ChatMessage } from '..';
import ChatBottom from '../ChatBottom';
import { CHAT_TYPES } from '../../constants';
import { useSelector } from 'react-redux';
import { getIsDesktop, getUserInfo } from '../../../../redux/helpers/selectors';
import Button from '../../../../uiForm/Button';
import { getDataRequest } from '../../../../api/requestsApi';
import { useSearchParams } from 'react-router-dom';

const ChatMessages = ({
   messages = [],
   variant = 'default',
   comments = true,
   deleteMessage,
   showPopperMessage,
   setShowPopperMessage,
   editMessage = true,
   draftOptions,
}) => {
   const {
      currentDialog,
      currentDialogUserInfo,
      isLoadingDialog,
      mainBlockBar,
      filesUpload,
      setFilesUpload,
      setIsVisibleBtnArrow,
      isOrganization,
      blockUserOptins,
      setCurrentDialog,
      setDialogs,
      allowScroll,
      setAllowScroll,
   } = useContext(ChatContext);

   const userInfo = useSelector(getUserInfo);
   const isDesktop = useSelector(getIsDesktop);
   const [_, setSearchParams] = useSearchParams();

   const visibleBottom =
      variant === 'default'
         ? !(currentDialog.dialog_type === CHAT_TYPES.CHANNEL && !currentDialogUserInfo.myChannelOrGroup) &&
           !currentDialog.my_block &&
           !currentDialog.not_my_block
         : variant === 'comments';

   const visibleAvatar = currentDialog.dialog_type === CHAT_TYPES.CHAT || currentDialog.dialog_type === CHAT_TYPES.GROUP;

   const {
      handlePlayAudio,
      handleStopAudio,
      addFile,
      deleteFile,
      getInputProps,
      uploadFileOpen,
      filesLimitModal,
      setFilesLimitModal,
      handlePlayMedia,
      firstUnreadRef,
   } = useChatMessages({
      mainBlockBar,
      filesUpload,
      setFilesUpload,
      setIsVisibleBtnArrow,
      isLoadingDialog,
      currentDialog,
      messages,
      allowScroll,
      setAllowScroll,
   });

   return (
      <ChatMessagesContext.Provider
         value={{
            handlePlayAudio,
            handleStopAudio,
            addFile,
            deleteFile,
            getInputProps,
            uploadFileOpen,
            deleteMessage,
            showPopper: showPopperMessage,
            setShowPopper: setShowPopperMessage,
            handlePlayMedia,
            firstUnreadRef,
            editMessage,
            variant,
            draftOptions,
         }}>
         <SimpleScrollbar className={cn('pr-2 w-full', styles.ChatMessages)} ref={mainBlockBar} variant="custom">
            <div className={cn(styles.ChatMessagesInner, (isLoadingDialog || allowScroll) && 'opacity-0 absolute inset-0')}>
               {messages.length === 0 ? (
                  <div className="white-block w-max flex flex-col items-center text-center mx-auto max-w-[320px]">
                     <Avatar size={90} src={currentDialogUserInfo.image} title={currentDialogUserInfo.name} />
                     <h3 className="title-3 mt-4">
                        {isOrganization ? currentDialogUserInfo.name : capitalizeWords(currentDialogUserInfo.name, currentDialogUserInfo.surname)}
                     </h3>
                     <div className="mt-4 text-center text-primary400">
                        <p>Здесь пока ничего нет...</p>
                        <p>Отправьте первое сообщение</p>
                     </div>
                  </div>
               ) : (
                  messages.map(item => {
                     return (
                        <div key={item.date}>
                           {item.date && <div className={styles.ChatDate}>{dayjs(item.date).format('D MMMM')}</div>}
                           {item.blocks?.map((item, index) => {
                              const user = item.user;
                              const myMessage = user.id === userInfo.id;

                              return (
                                 <div key={index} className={cn(styles.ChatMessageWrapper, myMessage && styles.ChatMessageWrapperMe)}>
                                    {isDesktop && visibleAvatar && !myMessage && (
                                       <Avatar size={40} src={user.image} title={user.name} className={styles.ChatMessageUser} />
                                    )}
                                    {!isDesktop && currentDialog.dialog_type === CHAT_TYPES.GROUP && !myMessage && (
                                       <Avatar size={40} src={user.image} title={user.name} className={styles.ChatMessageUser} />
                                    )}
                                    <div className={cn('flex flex-col flex-grow', myMessage && 'items-end')}>
                                       {item.messages.map(item => {
                                          return <ChatMessage data={item} key={item.id} comments={comments} />;
                                       })}
                                    </div>
                                 </div>
                              );
                           })}
                        </div>
                     );
                  })
               )}
            </div>
         </SimpleScrollbar>
         <div id="chat-mobile-actions" />
         {visibleBottom && (
            <div className="py-4 mt-auto mr-2 mx-4">
               <ChatBottom />
            </div>
         )}
         {Boolean(currentDialog.my_block || currentDialog.not_my_block) && (
            <div className="py-4 mt-auto mr-2 mx-4">
               {currentDialog.my_block ? (
                  <Button
                     isLoading={blockUserOptins.isLoadingAction}
                     variant="red"
                     className="w-full uppercase"
                     onClick={async () => {
                        blockUserOptins.setIsLoadingAction(true);
                        await blockUserOptins.blockUserDelete(currentDialogUserInfo.id);
                        setCurrentDialog(prev => ({ ...prev, my_block: false }));
                        setDialogs(prev => {
                           return prev.map(i => {
                              if (i.id === currentDialog.id) {
                                 return { ...i, my_block: false };
                              }
                              return i;
                           });
                        });
                        blockUserOptins.setIsLoadingAction(false);
                     }}>
                     Разблокировать
                  </Button>
               ) : currentDialog.not_my_block ? (
                  <div className="w-full text-center bg-white px-4 py-4 font-medium rounded-xl">Вас заблокировали</div>
               ) : (
                  ''
               )}
            </div>
         )}
         {Boolean(currentDialog.is_member === false) && (
            <div className="py-4 mt-auto mr-2 mx-4">
               <Button
                  className="w-full uppercase"
                  onClick={async () => {
                     const data = await getDataRequest(`/api/dialogs/${currentDialog.id}/user/join`);
                     console.log(data);
                     
                     setSearchParams({ dialog: currentDialog.id });
                  }}>
                  Вступить в канал
               </Button>
            </div>
         )}
         <div id="chat-mobile-smile" />
         <ModalWrapper condition={filesLimitModal}>
            <Modal
               condition={Boolean(filesLimitModal)}
               set={setFilesLimitModal}
               options={{ overlayClassNames: '_center-max-content', modalClassNames: '!w-[400px]', modalContentClassNames: '!pt-8 !px-8' }}>
               <h3 className="title-3 mb-1">Произошла ошибка</h3>
               <p>Вы загрузили больше 10 файлов ({filesLimitModal})</p>
            </Modal>
         </ModalWrapper>
      </ChatMessagesContext.Provider>
   );
};

export default ChatMessages;
