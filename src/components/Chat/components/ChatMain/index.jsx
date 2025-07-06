import React, { useContext, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import cn from 'classnames';

import { ChatContext } from '../../../../context';
import { IconArrow, IconLock } from '../../../../ui/Icons';

import styles from '../../Chat.module.scss';
import isEmptyArrObj from '../../../../helpers/isEmptyArrObj';
import { getIsDesktop } from '../../../../redux/helpers/selectors';
import ChatMainUserTop from './ChatMainUserTop';
import ChatMainBuildingTop from './ChatMainBuildingTop';
import { ChatMessages, ChatPinMessagesPanel, ChatPinTop } from '..';
import { CHAT_TYPES } from '../../constants';
import { ChatMessageCommentsPanel } from '../ChatMessages/ui';
import { useQueryParams } from '../../../../hooks/useQueryParams';

import CHAT_BG from '../../../../assets/img/chat-bg.jpg';
import Spinner from '../../../../ui/Spinner';
import { useChatDraft } from '../ChatDraft/useChatDraft';

const ChatMain = () => {
   const {
      currentDialog,
      setCurrentDialog,
      isLoadingDialog,
      setIsOpenSmileMenu,
      setIsOpenMenu,
      messages,
      deleteMessages,
      setCachedDialog,
      allowScroll,
      showPopperMessage,
      setShowPopperMessage,
      sendMessage,
      messageText,
      isEdit,
      setIsEdit,
      setMessageText,
   } = useContext(ChatContext);

   const isDesktop = useSelector(getIsDesktop);
   const [searchParams, setSearchParams] = useSearchParams();
   const params = useQueryParams();

   const draftOptions = useChatDraft({
      send: sendMessage,
      messageText,
      initialValue: isEdit ? isEdit.text : messageText,
      isEdit: isEdit,
      setIsEdit,
      onChange: value => {
         if (isEdit) {
            setIsEdit(prev => ({
               ...prev,
               text: value,
            }));
         } else {
            setMessageText(value);
         }
      },
   });

   return (
      <div className={cn(styles.ChatMain, !isDesktop && `${!isEmptyArrObj(currentDialog) ? styles.ChatMainActive : ''}`)}>
         <div className={styles.ChatMainInner} style={{ backgroundImage: `url(${CHAT_BG})` }}>
            <div className="min-h-16 h-16 px-4 flex items-center border-b border-b-primary800 bg-white pl-2.5">
               {!isDesktop && !isEmptyArrObj(currentDialog) && (
                  <button
                     onClick={() => {
                        setIsOpenSmileMenu(false);
                        setIsOpenMenu(false);
                        setCurrentDialog({});
                        setCachedDialog({});

                        searchParams.delete('dialog');
                        setSearchParams(searchParams);
                     }}
                     className="mr-3 flex-center-all">
                     <IconArrow className="rotate-180 fill-dark" width={28} height={28} />
                  </button>
               )}
               <ChatMainUserTop />
            </div>
            <ChatMainBuildingTop />
            <ChatPinTop />
            {params.dialog || (currentDialog.is_fake && !currentDialog.is_member) ? (
               <>
                  {(isLoadingDialog || isEmptyArrObj(currentDialog)) && (
                     <div className="title-2-5 h-full flex-center-all gap-3 mx-4 text-center md1:flex-col">
                        <IconLock width={25} height={25} />
                        <span>Защищено сквозным шифрованием</span>
                     </div>
                  )}
                  {!isLoadingDialog && !isEmptyArrObj(currentDialog) && allowScroll && (
                     <div className="title-2-5 h-full flex-center-all gap-3 mx-4 text-center md1:flex-col">
                        <Spinner className="!border-dark !border-b-[transparent]" />
                     </div>
                  )}
                  {(+params.dialog === currentDialog.id || (currentDialog.is_fake && !currentDialog.is_member)) && (
                     <ChatMessages
                        messages={messages}
                        comments={currentDialog.dialog_type === CHAT_TYPES.CHANNEL}
                        deleteMessage={data => {
                           if (!data) return;
                           deleteMessages(data.ids, data.dialog_id, data.myMessage);
                        }}
                        showPopperMessage={showPopperMessage}
                        setShowPopperMessage={setShowPopperMessage}
                        draftOptions={draftOptions}
                     />
                  )}
               </>
            ) : (
               <div className="title-2-5 h-full flex-center-all gap-3 mx-4 text-center">Выберите, кому хотели бы написать</div>
            )}
         </div>
         <ChatPinMessagesPanel />
         <ChatMessageCommentsPanel />
      </div>
   );
};

export default ChatMain;
