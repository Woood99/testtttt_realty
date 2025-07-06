import React from 'react';

import styles from './RowHeader.module.scss';

const RowHeader = ({ children }) => {
   return <div className={styles.RowHeaderRoot}>{children}</div>;
};

export default RowHeader;
