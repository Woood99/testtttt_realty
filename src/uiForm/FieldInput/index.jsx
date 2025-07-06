import React from 'react';

import styles from './FieldInput.module.scss';

const FieldInput = ({ children, className = '' }) => {
   return <div className={`${styles.FieldInputRoot} ${className}`}>{children}</div>;
};

export default FieldInput;
