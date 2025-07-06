import React from 'react';

import styles from './NavBtns.module.scss';

import { IconArrow } from '../Icons';

export const NavBtnPrev = props => {
   const { className = '', classnameicon = '', variant = 'Primary', gray = false, centery = false } = props;

   const currentVariant = `NavBtnRoot${variant}`;

   return (
      <button
         type="button"
         {...props}
         className={`${styles[currentVariant]} ${className} ${centery ? styles.btnCenterPrev : ''} ${gray ? styles.NavBtnRootPrimaryGray : ''}`}>
         <IconArrow className={`${styles.prev} ${classnameicon}`} />
      </button>
   );
};
export const NavBtnNext = props => {
   const { className = '', classnameicon = '', variant = 'Primary', gray = false, centery = false } = props;
   const currentVariant = `NavBtnRoot${variant}`;

   return (
      <button
         type="button"
         {...props}
         className={`${styles[currentVariant]} ${className} ${centery ? styles.btnCenterNext : ''} ${gray ? styles.NavBtnRootPrimaryGray : ''}`}>
         <IconArrow className={classnameicon} />
      </button>
   );
};
