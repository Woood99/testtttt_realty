import React, { useContext, useState } from 'react';
import cn from 'classnames';
import { useSearchParams } from 'react-router-dom';
import { useSelector } from 'react-redux';

import styles from '../../Chat.module.scss';
import stylesBurger from '../../../Header/Header.module.scss';

import { ChatContext } from '../../../../context';
import { useResizeSidebar } from '../../hooks';
import { getDialogId } from '../../../../api/getDialogId';
import { getIsDesktop } from '../../../../redux/helpers/selectors';
import Input from '../../../../uiForm/Input';
import ModalWrapper from '../../../../ui/Modal/ModalWrapper';
import { CHAT_TYPES } from '../../constants';
import ChatDialogs from './ChatDialogs';
import { ChatCreateDialogLayout, MenuModal } from '../modals';
import Tag from '../../../../ui/Tag';
import HorizontalScrollMouse from '../../../../ui/HorizontalScrollMouse';
import Button from '../../../../uiForm/Button';
import { IconAdd } from '../../../../ui/Icons';

const ChatSidebar = () => {
   const {
      setIsLoadingDialog,
      setAllowScroll,
      setCurrentDialog,
      connectToChat,
      getDialog,
      setIsVisibleBtnArrow,
      getDialogs,
      setCachedDialog,
      resizeSidebarOptions,
      themeOptions: { theme },
   } = useContext(ChatContext);

   const [sidebarModalOpen, setSidebarModalOpen] = useState(false);
   const [createDialogWithDevelopModal, setCreateDialogWithDevelopModal] = useState(false);
   const [createDialogWithSpecialistModal, setCreateDialogWithSpecialistModal] = useState(false);
   const { sidebarRef, sidebarWidth, startResizing, sidebarMini, sidebarOptions } = resizeSidebarOptions;
   const isDesktop = useSelector(getIsDesktop);

   const [_, setSearchParams] = useSearchParams();

   const onSubmitHandler = async data => {
      setIsLoadingDialog(true);
      setAllowScroll(true);
      const dialogId = await getDialogId(data);
      const dialogsData = await getDialogs();
      let findDialog = dialogsData.find(item => item.id === dialogId);
      if (findDialog) {
         setCachedDialog({});
         setCurrentDialog(findDialog);
         await connectToChat(findDialog.id);
         await getDialog(findDialog.id);
         setSearchParams({ dialog: findDialog.id });
      }
      setIsVisibleBtnArrow(false);
      setCreateDialogWithDevelopModal(false);
      setCreateDialogWithSpecialistModal(false);
      setSidebarModalOpen(false);

      setIsLoadingDialog(false);
   };

   return (
      <div
         className={cn(styles.ChatSidebar, sidebarMini && styles.ChatSidebarMini)}
         ref={sidebarRef}
         style={{
            width: isDesktop ? `${sidebarWidth <= sidebarOptions.min_width ? `${sidebarOptions.mini_width}px` : `${sidebarWidth}px`}` : '100%',
         }}>
         <div className={cn('min-h-16 h-16 px-4 flex items-center border-b border-b-primary800', sidebarMini && 'justify-center')}>
            <button className={cn(stylesBurger.MenuBtn, sidebarMini ? '!mx-0' : '!-ml-2')} onClick={() => setSidebarModalOpen(true)}>
               <div className={cn(stylesBurger.burger, 'md1:!text-dark')}>
                  <span className={stylesBurger.burgerLine}></span>
               </div>
            </button>
         </div>
         {/* <HorizontalScrollMouse widthScreen={9999} className={`mt-3 mb-4 px-2 w-full`}>
            <div className="flex items-center gap-2">
               <Button size="26" variant={theme === 'dark' ? 'dark' : 'secondary'}>
                  Все
               </Button>
               <Button size="26" variant={theme === 'dark' ? 'dark' : 'secondary'}>
                  Чаты
               </Button>
               <Button size="26" variant={theme === 'dark' ? 'dark' : 'secondary'}>
                  Групповые чаты
               </Button>
               <Button size="26" variant={theme === 'dark' ? 'dark' : 'secondary'}>
                  Каналы
               </Button>
            </div>
         </HorizontalScrollMouse> */}
         <ChatDialogs sidebarMini={sidebarMini} />

         {isDesktop && <div className={styles.ChatSidebarResizer} onMouseDown={startResizing} />}
         {!isDesktop && (
            <button className="fixed bottom-4 right-4 flex-center-all w-14 h-14 bg-blue rounded-xl z-[99]" onClick={() => setSidebarModalOpen(true)}>
               <IconAdd width={22} height={22} className="fill-[#fff]" />
            </button>
         )}
         <MenuModal
            options={{
               condition: sidebarModalOpen,
               set: setSidebarModalOpen,
               setCreateDialogWithDevelopModal,
               setCreateDialogWithSpecialistModal,
            }}
         />
         <ModalWrapper condition={createDialogWithDevelopModal}>
            <ChatCreateDialogLayout
               condition={createDialogWithDevelopModal}
               set={setCreateDialogWithDevelopModal}
               options={{
                  type: 'developers',
                  api: '/api/developers/page',
                  inputPlaceholder: 'Название застройщика',
                  onSubmitDeveloper: item => {
                     onSubmitHandler({ organization_id: item.id, type: CHAT_TYPES.CHAT });
                  },
                  onSubmitSpecialist: item => {
                     onSubmitHandler({ recipients_id: [item.id], type: CHAT_TYPES.CHAT });
                  },
               }}
            />
         </ModalWrapper>
         <ModalWrapper condition={createDialogWithSpecialistModal}>
            <ChatCreateDialogLayout
               condition={createDialogWithSpecialistModal}
               set={setCreateDialogWithSpecialistModal}
               options={{
                  type: 'specialists',
                  api: '/api/specialists/page',
                  inputPlaceholder: 'ФИО менеджера',
                  onSubmitDeveloper: item => {
                     onSubmitHandler({ organization_id: item.id, type: CHAT_TYPES.CHAT });
                  },
                  onSubmitSpecialist: item => {
                     onSubmitHandler({ recipients_id: [item.id], type: CHAT_TYPES.CHAT });
                  },
               }}
            />
         </ModalWrapper>
      </div>
   );
};

export default ChatSidebar;
