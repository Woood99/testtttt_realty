import React, { useCallback, useContext } from 'react';
import cn from 'classnames';
import styles from '../Chat.module.scss';
import { IconCheckedSecond, IconClose, IconEdit, IconSend } from '../../../ui/Icons';
import { ChatMessagesContext, ChatContext } from '../../../context';
import getSrcImage from '../../../helpers/getSrcImage';
import { ThumbPhotoDefault } from '../../../ui/ThumbPhoto';
import { ChatMenu, ChatPresent, ChatSmile, ChatVoiceRecorder } from '.';
import { GetDescrHTML } from '../../BlockDescr/BlockDescr';
import ChatDraft from './ChatDraft';
import ChatDraftTooltip from './ChatDraft/ChatDraftTooltip';

const ChatBottom = () => {
   const { chatBottomRef, isVoiceRecording, filesUpload, setFilesUpload, isLoadingDialog } = useContext(ChatContext);
   const { deleteFile, draftOptions, variant } = useContext(ChatMessagesContext);

   const checkForSend = Boolean(
      (((draftOptions.isEdit && draftOptions.hasText(draftOptions.isEdit?.text)) || draftOptions.hasText(draftOptions.messageText)) &&
         !isVoiceRecording) ||
         filesUpload.length
   );

   const checkIsVoiceRecording = Boolean(
      variant !== 'comments' &&
         !draftOptions.hasText(draftOptions.isEdit?.text) &&
         !draftOptions.hasText(draftOptions.messageText) &&
         !filesUpload.length
   );

   const FilesLayout = useCallback(() => {
      if (!filesUpload.length) return;

      return filesUpload.map((item, index) => {
         return (
            <ThumbPhotoDefault style={{ width: 260, height: 260, borderRadius: 8, flex: '0 0 260px', position: 'relative' }} key={index}>
               <button
                  onClick={() => deleteFile(item.id)}
                  className="absolute -right-1 -top-1 bg-dark rounded-full shadow-primary w-6 h-6 flex items-center justify-center pointer-events-auto">
                  <IconClose width={18} height={18} className="fill-white pointer-events-none" />
               </button>
               <img src={getSrcImage(item.image?.url || item.image)} />
            </ThumbPhotoDefault>
         );
      });
   }, [filesUpload]);

   const LayoutBody = useCallback(() => {
      return (
         <>
            {draftOptions.isEdit && (
               <div className="py-3 mb-3 flex border-b border-b-primary800">
                  <IconEdit width={22} height={22} className="mr-3 mt-2 stroke-blue stroke-[1.5px] flex-shrink-0" />
                  <div className="w-full">
                     <p className="text-blue mb-1">Редактируемое сообщение</p>
                     {Boolean(filesUpload.length) && (
                        <div className="mt-4 mb-2 py-3 flex items-center gap-3 overflow-x-auto scrollbarPrimary pointer-events-none">
                           <FilesLayout />
                        </div>
                     )}
                     <GetDescrHTML data={draftOptions.isEdit?.text_old} />
                  </div>
                  <button
                     className="ml-auto h-max mt-2"
                     onClick={() => {
                        draftOptions.setIsEdit?.(false);
                        setFilesUpload([]);
                     }}>
                     <IconClose width={24} height={24} className="fill-primary400" />
                  </button>
               </div>
            )}
            {Boolean(!draftOptions.isEdit && filesUpload.length) && (
               <div className="py-3 mb-3 flex items-center gap-3 border-b border-b-primary800 overflow-x-auto scrollbarPrimary pointer-events-none">
                  <FilesLayout />
               </div>
            )}
         </>
      );
   }, [filesUpload, draftOptions.isEdit]);

   return (
      <>
         <div
            className={cn('flex items-center gap-2 mmd1:max-w-[920px] mmd1:mx-auto', isLoadingDialog && 'opacity-80 pointer-events-none')}
            ref={chatBottomRef}>
            <ChatDraftTooltip draftOptions={draftOptions} />

            {!isVoiceRecording && (
               <>
                  <div className={styles.ChatBottom}>
                     <LayoutBody />
                     <div className={styles.ChatBottomWrapper}>
                        {variant !== 'comments' && <ChatPresent />}

                        <ChatSmile
                           setMessageText={value => {
                              draftOptions.insertText(value);
                           }}
                        />
                        <ChatDraft draftOptions={draftOptions} />
                        {variant !== 'comments' && <ChatMenu />}
                     </div>
                  </div>
                  {checkForSend && (
                     <button
                        className={styles.ChatBtnBlue}
                        onClick={() => {
                           draftOptions.send();
                           draftOptions.handleResetEditor();
                        }}>
                        {draftOptions.isEdit ? (
                           <IconCheckedSecond className="fill-[#fff]" />
                        ) : (
                           <IconSend width={24} height={24} className="fill-[#fff]" />
                        )}
                     </button>
                  )}
               </>
            )}

            {checkIsVoiceRecording && <ChatVoiceRecorder />}
         </div>
      </>
   );
};

export default ChatBottom;
