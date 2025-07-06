import { useContext } from 'react';
import cn from 'classnames';
import { useSelector } from 'react-redux';

import { IconArrow, IconEdit, IconEllipsis, IconTrash } from '../../../../../ui/Icons';
import { Tooltip } from '../../../../../ui/Tooltip';
import styles from '../../../Chat.module.scss';
import { ChatContext, ChatMessageContext, ChatMessagesContext } from '../../../../../context';
import { SMILES_REACTIONS } from '../../../../../data/smiles';
import { SmileItem } from '../../ChatSmile';
import { useChatReaction } from '../../../hooks';
import { ChatMessageReads } from '../..';
import { CHAT_TYPES } from '../../../constants';
import handleCopyText from '../../../../../helpers/handleCopyText';
import { getIsDesktop } from '../../../../../redux/helpers/selectors';

const ChatMessageTooltip = () => {
   const { cachedDialog, setCachedDialog } = useContext(ChatContext);
   const isDesktop = useSelector(getIsDesktop);

   const { draftOptions } = useContext(ChatMessagesContext);
   const {
      data,
      showPopper,
      setShowPopper,
      myMessage,
      userInfo,
      getDialog,
      currentDialog,
      currentDialogUserInfo,
      chatPinMessages,
      deleteMessage,
      setFilesUpload,
      audioData,
      videoData,
      messageCommentsOptions,
      editMessage,
      variant,
   } = useContext(ChatMessageContext);

   const { chatReactionCreate, chatReactionDelete, chatReactionCreateFake, chatReactionDeleteFake } = useChatReaction();
   const { pinMessageCreate, pinMessageDelete, pinMessageCreateFake, pinMessageDeleteFake, pinMessageGetAll } = chatPinMessages;

   const isVisiblePin = variant !== 'comments' && (currentDialog.dialog_type === CHAT_TYPES.CHANNEL ? currentDialogUserInfo.myChannelOrGroup : true);

   return (
      <Tooltip
         mobileDefault
         color="white"
         ElementTarget={() => <IconEllipsis className="fill-dark pointer-events-none" width={16} height={16} />}
         classNameTarget={cn(styles.ChatMessageMore, myMessage ? styles.ChatMessageMoreMe : styles.ChatMessageMoreOther)}
         classNameContent="!p-0 !shadow-none bg-transparent-imp !rounded-none"
         placement="bottom-start"
         event="click"
         value={showPopper === data.id}
         classNameTargetActive={styles.ChatMessageMoreActive}
         onChange={value => {
            if (data.loading) return;
            if (!isDesktop) return;

            if (value) {
               setShowPopper(prev => (prev ? false : data.id));
            } else {
               setShowPopper(false);
            }
         }}>
         <div className="flex flex-col items-center gap-2">
            {variant !== 'comments' && (
               <div className="bg-white shadow-primary p-1 rounded-[24px] flex gap-1">
                  {SMILES_REACTIONS.map((item, index) => {
                     const isActive = data.reactions?.filter(item => item.user.id === userInfo.id).find(i => i.value === item);

                     return (
                        <SmileItem
                           className="text-littleBig !rounded-full"
                           key={index}
                           item={item}
                           onClick={async () => {
                              if (!data.reactions) return;
                              setShowPopper(false);
                              const current = cachedDialog[currentDialog.id];
                              if (current) {
                                 if (isActive) {
                                    chatReactionDeleteFake(current.result, setCachedDialog, data, userInfo);
                                 } else {
                                    chatReactionCreateFake(current.result, setCachedDialog, item, data, userInfo);
                                 }
                              }
                              if (isActive) {
                                 await chatReactionDelete(isActive.id, currentDialog.id, data.id);
                              } else {
                                 await chatReactionCreate(currentDialog.id, data.id, item);
                              }
                              await getDialog(currentDialog.id);
                           }}
                        />
                     );
                  })}
               </div>
            )}

            <div className="bg-white shadow-primary flex flex-col items-start rounded-[10px] overflow-hidden min-w-64">
               <ChatMessageReads />
               {isVisiblePin && (
                  <>
                     <button
                        className={styles.ChatMessageButton}
                        onClick={async () => {
                           setShowPopper(false);
                           const current = cachedDialog[currentDialog.id];
                           const is_active = data.is_pin || variant === 'pin';
                           if (current) {
                              if (is_active) {
                                 pinMessageDeleteFake(current.result, data);
                              } else {
                                 pinMessageCreateFake(current.result, data);
                              }
                           }
                           if (is_active) {
                              await pinMessageDelete(currentDialog.id, data.id);
                           } else {
                              await pinMessageCreate(currentDialog.id, data.id);
                           }
                           pinMessageGetAll(currentDialog.id);
                        }}>
                        <IconArrow width={15} height={15} />
                        {Boolean(data.is_pin || variant === 'pin') ? 'Открепить' : ' Закрепить'}
                     </button>
                  </>
               )}
               {data.text && (
                  <button
                     className={styles.ChatMessageButton}
                     onClick={() => {
                        handleCopyText(data.text);
                        setShowPopper(false);
                     }}>
                     <IconArrow width={15} height={15} />
                     Копировать текст
                  </button>
               )}

               {Boolean(editMessage && myMessage && !data.is_json && !audioData && !videoData) && (
                  <button
                     className={styles.ChatMessageButton}
                     onClick={() => {
                        setShowPopper(false);
                        const photos = data.photos
                           ? data.photos.map((item, index) => {
                                return {
                                   id: index + 1,
                                   image: item,
                                   type: 'image',
                                };
                             })
                           : [];

                        setFilesUpload([...photos]);

                        draftOptions.setIsEdit({
                           text: data.text || '',
                           text_old: data.text || '',
                           id: data.id,
                           dialog_id: currentDialog.id,
                        });
                     }}>
                     <IconEdit width={16} height={16} className="stroke-blue stroke-[1.5px]" />
                     Редактировать
                  </button>
               )}

               {(!(currentDialog.dialog_type === CHAT_TYPES.CHANNEL && !currentDialogUserInfo.myChannelOrGroup) ||
                  messageCommentsOptions.messageCommentsIsOpen) &&
                  myMessage && (
                     <button
                        className={styles.ChatMessageButton}
                        onClick={() => {
                           setShowPopper(false);
                           deleteMessage?.({
                              ids: [data.id],
                              dialog_id: currentDialog.id,
                              myMessage: Boolean(myMessage),
                              message_id: data.message_id,
                           });
                        }}>
                        <IconTrash width={15} height={15} className="fill-red" />
                        Удалить
                     </button>
                  )}
            </div>
         </div>
      </Tooltip>
   );
};

export default ChatMessageTooltip;
