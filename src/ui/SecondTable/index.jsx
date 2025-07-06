import React from 'react';

import styles from './SecondTable.module.scss';
import cn from 'classnames';

export const SecondTableHeader = ({ children, className = '', sticky = false }) => {
   return <div className={cn(styles.header, className, sticky && styles.headerSticky)}>{children}</div>;
};

export const SecondTableContent = ({ children, className = '' }) => {
   return <div className={className}>{children}</div>;
};
