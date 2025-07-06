import React, { useState } from 'react';

import styles from './Tabs.module.scss';
import { BtnActionDelete, BtnActionEdit, BtnActionSave } from '../ActionBtns';

const TabsControlsTitle = ({
   data,
   activeTab,
   editNameHandler = () => {},
   deleteFieldHandler = () => {},
   onClick,
   editModeIndex,
   setEditModeIndex,
   controls = true,
}) => {
   return (
      <div className={`${styles.tabsBtn} ${activeTab ? styles.tabsBtnActiveBorder : ''} cursor-pointer h-10  max-w-80`} onClick={onClick}>
         {editModeIndex !== +data.id && <span className="whitespace-nowrap overflow-hidden">{data.name}</span>}
         {editModeIndex === +data.id && (
            <input
               autoFocus
               value={data.name}
               onChange={e => editNameHandler(data.id, e.target.value)}
               onBlur={() => setEditModeIndex(false)}
               onKeyDown={e => {
                  if (e.key !== 'Enter') return;
                  setEditModeIndex(false);
               }}
            />
         )}
         {controls && (
            <div className="ml-3 flex items-center gap-2">
               {editModeIndex !== +data.id ? (
                  <BtnActionEdit onClick={() => setEditModeIndex(+data.id)} />
               ) : (
                  <BtnActionSave onClick={() => setEditModeIndex(false)} />
               )}
               <BtnActionDelete onClick={() => deleteFieldHandler(data.id)} />
            </div>
         )}
      </div>
   );
};

export default TabsControlsTitle;
