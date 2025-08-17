import React, { useContext } from 'react';
import { createPortal } from 'react-dom';
import { useSelector } from 'react-redux';
import cn from 'classnames';

import { IconSmile } from '../../../ui/Icons';
import { Tooltip } from '../../../ui/Tooltip';
import { ChatContext } from '../../../context';
import SimpleScrollbar from '../../../ui/Scrollbar';
import { getIsDesktop } from '@/redux';
import { SMILES, SMILES_ONE } from '../../../data/smiles';

export const SmileItem = ({ item, onClick, active = false, className, disabled, children }) => {
   return (
      <button
         type="button"
         className={cn('hover:bg-primary700 p-1.5 rounded-lg flex-shrink-0', className, active && 'bg-primary700', disabled && 'pointer-events-none')}
         onClick={onClick}>
         {children}
         {item}
      </button>
   );
};

export const MenuLayout = ({ title = '', data = [], setMessageText, className }) => {
   return (
      <div>
         <h3 className="text-defaultMax font-medium text-primary400 pl-2.5 mb-1.5">{title}</h3>
         <div className={cn('flex flex-wrap gap-1 text-big mmd1:pr-3 md1:bg-white md1:py-2 md1:px-2', className)}>
            {data.map((item, index) => (
               <SmileItem key={index} item={item} onClick={() => setMessageText(item)} />
            ))}
         </div>
      </div>
   );
};

const ChatSmile = ({ setMessageText }) => {
   const { isOpenSmileMenu, setIsOpenSmileMenu, setIsOpenMenu } = useContext(ChatContext);

   const isDesktop = useSelector(getIsDesktop);

   return (
      <>
         {isOpenSmileMenu &&
            createPortal(
               <SimpleScrollbar className="bg-white pt-4">
                  <div className="flex flex-col gap-3">
                     <MenuLayout title="Часто используемые" data={SMILES_ONE} setMessageText={setMessageText} />
                     <MenuLayout title="Все" data={SMILES} setMessageText={setMessageText} />
                  </div>
               </SimpleScrollbar>,
               document.getElementById('chat-mobile-smile')
            )}
         {isDesktop ? (
            <Tooltip
               mobile
               color="white"
               ElementTarget={() => (
                  <button type="button" className="flex items-center justify-center mb-[6px] mr-3">
                     <IconSmile className="stroke-primary400" width={24} height={24} />
                  </button>
               )}
               placement="top-start"
               offset={[0, 24]}
               classNameRoot="-ml-[95px] md1:-ml-[40px]">
               <div className="mmd1:w-[400px]">
                  <SimpleScrollbar>
                     <div className="flex flex-col gap-3">
                        <MenuLayout title="Часто используемые" data={SMILES_ONE} setMessageText={setMessageText} />
                        <MenuLayout title="Все" data={SMILES} setMessageText={setMessageText} />
                     </div>
                  </SimpleScrollbar>
               </div>
            </Tooltip>
         ) : (
            <>
               <button
                  type="button"
                  className="mr-2"
                  onClick={() => {
                     setIsOpenSmileMenu(prev => !prev);
                     setIsOpenMenu(false);
                  }}>
                  <IconSmile className="stroke-primary400" width={24} height={24} />
               </button>
            </>
         )}
      </>
   );
};

export default ChatSmile;
