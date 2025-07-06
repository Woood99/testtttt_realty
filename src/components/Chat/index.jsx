import { useState } from 'react';
import cn from 'classnames';
import styles from './Chat.module.scss';
import { useChat, useChatSearchDialog, useResizeSidebar } from './hooks';
import { ChatContext } from '../../context';
import {
   ChannelGroupFormModal,
   ChannelGroupInfoModal,
   ChannelGroupSettingsModal,
   ChatApartmentsByBuilding,
   ChatMain,
   ChatModalBlockedUserList,
   ChatModalDeleteMessages,
   ChatSidebar,
   ChatSidebarRight,
} from './components';
import { CHAT_TYPES } from './constants';
import ModalWrapper from '../../ui/Modal/ModalWrapper';
import { useLocation } from 'react-router-dom';
import { AuthRoutesPath } from '../../constants/RoutesPath';
import { useSelector } from 'react-redux';
import { getIsDesktop } from '../../redux/helpers/selectors';

const Chat = ({ onCloseModal, defaultDialogId = null, variantChat = 'page', tag, fake_dialog = null }) => {
   const options = useChat({ defaultDialogId, tag, fake_dialog });
   const location = useLocation();
   const isDesktop = useSelector(getIsDesktop);

   const chatSearchDialog = useChatSearchDialog();
   const resizeSidebarOptions = useResizeSidebar(variantChat === 'mini');

   const [groupFormModal, setGroupFormModal] = useState(false);
   const [channelFormModal, setChannelFormModal] = useState(false);
   const [channelGroupSettingsModal, setChannelGroupSettingsModal] = useState(false);
   const [channelGroupInfoModal, setChannelGroupInfoModal] = useState(false);
   const [blockedUserList, setBlockedUserList] = useState(false);

   return (
      <ChatContext.Provider
         value={{
            onCloseModal,
            variantChat,
            chatSearchDialog,
            groupFormModal,
            setGroupFormModal,
            channelFormModal,
            setChannelFormModal,
            channelGroupSettingsModal,
            setChannelGroupSettingsModal,
            channelGroupInfoModal,
            setChannelGroupInfoModal,
            setBlockedUserList,
            ...options,
            resizeSidebarOptions,
            fake_dialog,
         }}>
         <div
            className={cn(
               styles.ChatRoot,
               variantChat === 'mini' && styles.ChatRootMini,
               location.pathname === AuthRoutesPath.chat && options.themeOptions.theme === 'dark' && styles.ChatThemeDark,
               options.showPopperMessage && !isDesktop && styles.ChatRootShadow
            )}
            ref={options.chatRootRef}
            onClick={() => {
               if (options.showPopperMessage) {
                  options.setShowPopperMessage(false);
               }
            }}>
            <div className={styles.ChatContainer}>
               <ChatSidebar />
               <ChatMain />
               <ChatSidebarRight />
            </div>
         </div>
         <ChatModalDeleteMessages deleteMessagesModal={options.deleteMessagesModal} setDeleteMessagesModal={options.setDeleteMessagesModal} />

         <ChannelGroupFormModal type={CHAT_TYPES.GROUP} condition={groupFormModal} set={setGroupFormModal} />
         <ChannelGroupFormModal type={CHAT_TYPES.CHANNEL} condition={channelFormModal} set={setChannelFormModal} />
         <ChannelGroupSettingsModal condition={channelGroupSettingsModal} set={setChannelGroupSettingsModal} />
         <ChannelGroupInfoModal condition={channelGroupInfoModal} set={setChannelGroupInfoModal} dialog={options.currentDialogSettings} />
         <ModalWrapper condition={options.apartmentsByBuildingModal}>
            <ChatApartmentsByBuilding />
         </ModalWrapper>
         <ModalWrapper condition={blockedUserList}>
            <ChatModalBlockedUserList condition={blockedUserList} set={setBlockedUserList} />
         </ModalWrapper>
      </ChatContext.Provider>
   );
};

export default Chat;
