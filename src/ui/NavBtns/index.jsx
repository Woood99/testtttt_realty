import React from 'react';
import cn from 'classnames';

import styles from './NavBtns.module.scss';

import { IconArrow, IconClose } from '../Icons';

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

export const BtnClose = props => {
   const { className = '', onClick, size = 36, sizeIcon = 20 } = props;

   return (
      <button type="button" onClick={onClick} className={cn(styles.NavBtnRootPrimary, className)} style={{ '--size': `${size}px` }}>
         <IconClose className='fill-[#828282]' width={sizeIcon} height={sizeIcon} />
      </button>
   );
};
