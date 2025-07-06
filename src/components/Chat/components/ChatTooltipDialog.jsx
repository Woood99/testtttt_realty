import { useContext, useState } from 'react';
import cn from 'classnames';

import { IconAdd, IconHand, IconTrash } from '../../../ui/Icons';
import { Tooltip } from '../../../ui/Tooltip';
import styles from '../Chat.module.scss';
import ModalWrapper from '../../../ui/Modal/ModalWrapper';
import { ChatModalSearchDialogs } from './modals';
import { getDataRequest, sendPostRequest } from '../../../api/requestsApi';
import { ChatContext } from '../../../context';
import { CHAT_TYPES } from '../constants';
import { ROLE_BUYER } from '../../../constants/roles';

const ChatTooltipDialog = ({ options }) => {
   const [addParticipants, setAddParticipants] = useState(false);

   const {
      setChannelGroupInfoModal,
      setCurrentDialog,
      setCurrentDialogSettings,
      updateDialogsAndDialogSettings,
      userInfo,
      setCachedDialog,
      blockUserOptins,
      setDialogs,
      currentDialog,
   } = useContext(ChatContext);

   const { data, showPopper, setShowPopper, classNameTarget, ElementTargetLayout } = options;

   const type_chat = data.dialog_type === CHAT_TYPES.CHAT;
   const type_channel = data.dialog_type === CHAT_TYPES.CHANNEL;
   const type_group = data.dialog_type === CHAT_TYPES.GROUP;
   const myChannelOrGroup = Boolean((type_channel || type_group) && data.owner?.id === userInfo.id);

   return (
      <>
         <Tooltip
            mobile
            color="white"
            ElementTarget={() => ElementTargetLayout}
            classNameContent="!p-0 overflow-hidden"
            classNameTarget={cn(classNameTarget)}
            placement="bottom"
            event="click"
            value={showPopper == data.id}
            onChange={value => {
               if (value) {
                  setShowPopper(prev => (prev ? false : data.id));
               } else {
                  setShowPopper(false);
               }
            }}>
            <div className="flex flex-col items-center">
               {(type_channel || type_group) && (
                  <div
                     className={styles.ChatMessageButton}
                     onClick={() => {
                        setShowPopper(false);
                        setCurrentDialogSettings(data);
                        setChannelGroupInfoModal(true);
                     }}>
                     <IconAdd width={15} height={15} />
                     Информация
                  </div>
               )}
               {(type_channel || type_group) && myChannelOrGroup && (
                  <div
                     className={styles.ChatMessageButton}
                     onClick={() => {
                        setShowPopper(false);
                        setAddParticipants(data.id);
                     }}>
                     <IconAdd width={15} height={15} />
                     Добавить участников
                  </div>
               )}

               <div
                  className={styles.ChatMessageButton}
                  onClick={async () => {
                     setShowPopper(false);
                     if (myChannelOrGroup) {
                        await getDataRequest(`/api/dialogs/${data.id}/delete`);
                     } else {
                        if (type_channel || type_group) {
                           await getDataRequest(`/api/dialogs/${data.id}/user/leave`);
                        } else if (type_chat) {
                           await getDataRequest(`/api/dialogs/${data.id}/delete`);
                        }
                     }
                     setCurrentDialog({});
                     setCachedDialog({});
                     setCurrentDialogSettings({});
                     updateDialogsAndDialogSettings();
                  }}>
                  <IconTrash width={15} height={15} className="fill-red" />
                  {myChannelOrGroup ? 'Удалить и покинуть' : `${type_channel ? 'Покинуть канал' : type_group ? 'Покинуть группу' : 'Удалить диалог'}`}
               </div>
               {!data.organization && type_chat && userInfo.role.id === ROLE_BUYER.id && (
                  <div
                     className={styles.ChatMessageButton}
                     onClick={async () => {
                        setShowPopper(false);
                        const companion = data.companions.find(companion => companion.id !== userInfo.id);
                        if (!companion?.id) return;
                        if (data.my_block) {
                           await blockUserOptins.blockUserDelete(companion.id);
                           setCurrentDialog(prev => {
                              if (prev.id === currentDialog.id) {
                                 return { ...prev, my_block: false };
                              } else {
                                 return prev;
                              }
                           });
                           setDialogs(prev =>
                              prev.map(item => {
                                 if (item.id === data.id) {
                                    return { ...item, my_block: false };
                                 }

                                 return item;
                              })
                           );
                        } else {
                           await blockUserOptins.blockUserCreate(companion.id);
                           setCurrentDialog(prev => {
                              if (prev.id === currentDialog.id) {
                                 return { ...prev, my_block: true };
                              } else {
                                 return prev;
                              }
                           });
                           setDialogs(prev => {
                              return prev.map(item => {
                                 if (item.id === data.id) {
                                    return { ...item, my_block: true };
                                 }

                                 return item;
                              });
                           });
                        }
                     }}>
                     <IconHand className="stroke-red" />
                     {data.my_block ? 'Разблокировать пользователя' : 'Заблокировать пользователя'}
                  </div>
               )}
            </div>
         </Tooltip>

         {myChannelOrGroup && (
            <ModalWrapper condition={addParticipants}>
               <ChatModalSearchDialogs
                  condition={addParticipants}
                  set={setAddParticipants}
                  selectedType="add_to_dialog"
                  options={{ title: 'Добавить участников' }}
                  onChange={async (dialog_id, user_ids) => {
                     try {
                        await sendPostRequest(`/api/dialogs/${dialog_id}/user/add`, { user_ids });
                        await updateDialogsAndDialogSettings();
                     } catch (error) {
                        console.log(error);
                     }
                  }}
               />
            </ModalWrapper>
         )}
      </>
   );
};

export default ChatTooltipDialog;
