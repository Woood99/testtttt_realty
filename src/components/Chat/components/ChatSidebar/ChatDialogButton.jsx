import React, { memo, useContext } from 'react';
import cn from 'classnames';

import styles from '../../Chat.module.scss';
import UserInfo from '../../../../ui/UserInfo';
import { ROLE_ADMIN } from '../../../../constants/roles';

import { getShortNameSurname } from '../../../../helpers/changeString';
import { useSearchParams } from 'react-router-dom';
import { BuildingNameLayout, LastMessageTextLayout, LastMessageTimeLayout, UnreadMessagesCount } from './ui';
import { useSelector } from 'react-redux';
import { getIsDesktop, getUserInfo } from '../../../../redux/helpers/selectors';
import { CHAT_TYPES } from '../../constants';
import { ChatContext } from '../../../../context';
import { ChatTooltipDialog } from '..';
import { IconEllipsis, IconMegaphone, IconUsers } from '../../../../ui/Icons';

const ChatDialogButton = memo(({ data, options }) => {
   const { sidebarMini, showPopper, setShowPopper } = options;

   const { currentDialog, chatSearchDialog } = useContext(ChatContext);

   const { closeSearchPanel } = chatSearchDialog;
   const userInfo = useSelector(getUserInfo);

   const [_, setSearchParams] = useSearchParams();
   const isDesktop = useSelector(getIsDesktop);

   const type_chat = data.dialog_type === CHAT_TYPES.CHAT;
   const type_channel = data.dialog_type === CHAT_TYPES.CHANNEL;
   const type_group = data.dialog_type === CHAT_TYPES.GROUP;
   const is_organization = data.organization && userInfo?.role?.id !== ROLE_ADMIN.id;
   let dialog_info = {};

   if (is_organization) {
      dialog_info = {
         ...data.organization,
         isOrganization: true,
      };
   } else {
      if (type_chat && data.companions?.length) {
         dialog_info = {
            ...data.companions.find(item => item.id !== userInfo.id),
            isOrganization: false,
         };
      } else {
         dialog_info = {
            name: data.name,
            image: data.image,
            isOrganization: false,
         };
      }
   }

   const handleButtonClick = () => {
      if (currentDialog.id === data.id) {
         return;
      }
      setSearchParams({ dialog: data.id });
      closeSearchPanel();
   };

   const handleButtonContextMenu = e => {
      if (!isDesktop) return;
      e.preventDefault();
      setShowPopper(prev => (prev ? false : data.id));
   };

   const userName = is_organization ? dialog_info.name : getShortNameSurname(dialog_info.name, dialog_info.surname);

   const is_active = currentDialog.id === data.id;

   return (
      <button
         key={data.id}
         type="button"
         className={cn(styles.ChatSidebarDialog, is_active && styles.ChatSidebarDialogActive)}
         onClick={handleButtonClick}
         onContextMenu={handleButtonContextMenu}>
         <UserInfo
            sizeAvatar={54}
            avatar={dialog_info.image}
            textAvatar={userName}
            name={
               <div className="cut-one">
                  <span>
                     {type_group && <IconUsers className={cn(is_active ? 'fill-[#fff]' : 'fill-dark', 'mr-1')} width={14} height={14} />}
                     {type_channel && <IconMegaphone className={cn(is_active ? 'fill-[#fff]' : 'fill-dark', 'mr-1')} width={14} height={14} />}
                     {userName}
                  </span>
                  <BuildingNameLayout data={data} />
               </div>
            }
            className="min-w-0 mr-4"
            classNameContent={cn('flex-grow', sidebarMini ? '!hidden' : '')}
            posChildren={
               <div className={cn('flex flex-col mt-1 text-primary400 w-full', sidebarMini ? '!hidden' : '')}>
                  <LastMessageTextLayout data={data} />
               </div>
            }
            centered
         />
         {!sidebarMini && (
            <div className="flex flex-col items-end  gap-1.5">
               <LastMessageTimeLayout data={data} />

               <div className="flex items-center gap-1 relative">
                  <UnreadMessagesCount data={data} currentDialog={currentDialog} />
                  <ChatTooltipDialog
                     options={{
                        data,
                        showPopper,
                        setShowPopper,
                        classNameTarget: styles.ChatSidebarDialogTooltip,
                        ElementTargetLayout: (
                           <IconEllipsis className={cn('pointer-events-none fill-[#000]', is_active && '!fill-[#fff]')} width={16} height={16} />
                        ),
                     }}
                  />
               </div>
            </div>
         )}
      </button>
   );
});

export default ChatDialogButton;
