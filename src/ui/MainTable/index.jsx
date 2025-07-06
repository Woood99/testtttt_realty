import React from 'react';

import styles from './MainTable.module.scss';

export const MainTableHeader = ({ children, className = '' }) => {
   return <div className={`${styles.header} ${className}`}>{children}</div>;
};

export const MainTableContent = ({ children, className = '' }) => {
   return <div className={`${className}`}>{children}</div>;
};
