import React, { useContext } from 'react';
import cn from 'classnames';
import styles from '../Chat.module.scss';
import Input from '../../../uiForm/Input';
import { IconClose } from '../../../ui/Icons';
import { ChatContext } from '../../../context';

const ChatSidebarRight = () => {
   const { chatSearchDialog } = useContext(ChatContext);

   const { isSearchPanelOpen, closeSearchPanel, searchValue, setSearchValue, isLoading, data } = chatSearchDialog;

   if (!isSearchPanelOpen) return;

   return (
      <div
         className={cn(styles.ChatSidebarRight)}
         style={{
            width: '350px',
         }}>
         <div className="min-h-16 h-16 flex items-center gap-4">
            <button type="button" onClick={closeSearchPanel}>
               <IconClose width={24} height={24} />
            </button>
            <h3 className="title-3">Поиск сообщения</h3>
         </div>
         <div className="">
            <Input placeholder="Поиск" onChange={value => setSearchValue(value)} value={searchValue} />
         </div>
         <div>
            <p className="text-center my-8">
               {isLoading && 'Поиск сообщений...'}
               {!isLoading && !data.length && 'Сообщения не найдены'}
            </p>
         </div>
      </div>
   );
};

export default ChatSidebarRight;
