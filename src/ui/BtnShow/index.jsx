import React from 'react';

import styles from './BtnShow.module.scss';
import { IconArrowY } from '../Icons';

const BtnShow = ({ children, onClick, active = false, className = '', btnIcon = true }) => {
   return (
      <button onClick={onClick} className={`${styles.BtnShowRoot} ${active ? styles.BtnShowRootActive : ''} ${className}`}>
         {children}
         {btnIcon && <IconArrowY />}
      </button>
   );
};

export default BtnShow;
