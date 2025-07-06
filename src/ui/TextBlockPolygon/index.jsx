import React from 'react';

import styles from './TextBlockPolygon.module.scss';

export const TextBlockPolygon = ({ children, className = '' }) => {
   return <div className={`${styles.TextBlockPolygonRoot} ${className}`}>{children}</div>;
};
