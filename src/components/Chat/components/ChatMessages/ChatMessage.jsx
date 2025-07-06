import React, { useContext, useMemo, useRef, useState } from 'react';
import cn from 'classnames';
import { useSelector } from 'react-redux';
import { v4 as uuidv4 } from 'uuid';

import styles from '../../Chat.module.scss';
import { ChatContext, ChatMessageContext, ChatMessagesContext } from '../../../../context';
import { getIsDesktop, getUserInfo } from '../../../../redux/helpers/selectors';
import { ChatMessageReactionPanel } from '..';
import {
   ChatMessageAudio,
   ChatMessageCommentsButton,
   ChatMessagePhotos,
   ChatMessageText,
   ChatMessageTimeAndReads,
   ChatMessageTooltip,
   ChatMessageVideo,
} from './ui';
import { getColorForLetter } from '../../../../ui/Avatar';
import LightboxContainer from '../../../LightboxContainer';
import getSrcImage from '../../../../helpers/getSrcImage';

const ChatMessage = ({ data, comments = true }) => {
   const {
      currentDialog,
      currentDialogUserInfo,
      setIsEdit,
      setForwardMessageId,
      chatPinMessages,
      getDialog,
      setFilesUpload,
      messageCommentsOptions,
   } = useContext(ChatContext);
   const { deleteMessage, showPopper, setShowPopper, firstUnreadRef, editMessage, variant } = useContext(ChatMessagesContext);

   const userInfo = useSelector(getUserInfo);
   const isDesktop = useSelector(getIsDesktop);

   const [galleryCurrentIndex, setGalleryCurrentIndex] = useState(false);

   const myMessage = data.user.id === userInfo.id;

   const audioData = data.files?.filter(item => item.type === 'audio')[0];
   const dataText = data.is_json ? JSON.parse(data.text) : data.text;
   const isReactions = Boolean(data.reactions?.length);

   const photos = useMemo(() => {
      return data.photos?.map(item => ({ ...item, index: uuidv4() })) || [];
   }, [data.photos]);

   const videoData = useMemo(() => {
      return data.files?.filter(item => item.type === 'video')[0]
         ? { ...data.files?.filter(item => item.type === 'video')[0], index: uuidv4() }
         : null;
   }, [data.files]);

   const photosLength = data.photos?.length;

   const blockClassName = cn(
      styles.ChatMessageBlock,
      myMessage && styles.ChatMessageBlockMe,
      photosLength && styles.ChatMessageBlockPhotos,
      audioData && styles.ChatMessageBlockAudio,
      videoData && !videoData.is_story && styles.ChatMessageBlockVideo,
      videoData && videoData.is_story && styles.ChatMessageBlockStory,
      isReactions && styles.ChatMessageBlockReactions
   );

   if (!dataText && !videoData && !audioData && !photosLength) return;

   return (
      <ChatMessageContext.Provider
         value={{
            data,
            myMessage,
            showPopper,
            setShowPopper,
            getDialog,
            userInfo,
            currentDialog,
            currentDialogUserInfo,
            chatPinMessages,
            deleteMessage,
            setIsEdit,
            setForwardMessageId,
            setFilesUpload,
            messageCommentsOptions,
            videoData,
            audioData,
            dataText,
            galleryCurrentIndex,
            setGalleryCurrentIndex,
            editMessage,
            variant,
            photos,
         }}>
         <div
            className={cn(styles.ChatMessage, myMessage && styles.ChatMessageMe, data.loading && styles.ChatMessageLoading)}
            ref={data.key === currentDialog.un_read_messages_count ? firstUnreadRef : null}
            onClick={e => {
               if (isDesktop) return;
               if (data.loading) return;
               if (e.target.closest('[data-chat-tooltip]') || e.target.closest('[data-draft-spoiler]')) return;

               setShowPopper(prev => (prev ? false : data.id));
            }}
            onContextMenu={e => {
               if (!isDesktop) return;
               if (data.loading) return;

               e.preventDefault();
               setShowPopper(prev => (prev ? false : data.id));
            }}>
            <div className={blockClassName}>
               <div className={cn(styles.ChatMessageBlockWrapper)}>
                  {data.user_visible && (
                     <span className={styles.ChatMessageUserName} style={{ color: getColorForLetter(data.user.name) }}>
                        {userInfo.id === data.user.id ? 'Вы' : data.user.name}
                     </span>
                  )}

                  <div className="relative">
                     {Boolean(photosLength || videoData || data.is_json) && (
                        <div className={cn('flex flex-col gap-1', dataText && 'mb-2')}>
                           <ChatMessagePhotos />
                           <ChatMessageVideo />
                           {/* <ChatMessagePersonalDiscount /> */}
                        </div>
                     )}
                     <ChatMessageAudio />
                     <ChatMessageText />

                     <div className={isReactions ? 'mt-1.5 flex items-end justify-between' : 'inline'}>
                        <ChatMessageReactionPanel />
                        <ChatMessageTimeAndReads />
                     </div>
                  </div>
               </div>
               <ChatMessageTooltip />
               {comments && <ChatMessageCommentsButton />}
            </div>
         </div>

         {Boolean(galleryCurrentIndex) && (
            <LightboxContainer
               data={[
                  ...photos.map(item => ({
                     index: item.index,
                     type: 'image',
                     src: getSrcImage(item.url),
                  })),
                  videoData,
               ].filter(Boolean)}
               index={galleryCurrentIndex}
               setIndex={setGalleryCurrentIndex}
            />
         )}
      </ChatMessageContext.Provider>
   );
};

export default ChatMessage;
