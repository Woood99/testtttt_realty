import React from 'react';

import styles from './Radio.module.scss';

const Radio = ({ text, checked = false, onChange, className = '', disabled, children }) => {
   return (
      <label className={`${styles.CheckboxRoot} ${className}`}>
         <input type="checkbox" checked={checked} onChange={onChange} disabled={disabled} className={styles.CheckboxInput} />
         <div className={styles.CheckboxMark} />
         {Boolean(text) && <span className={styles.CheckboxContent}>{text}</span>}
         {children}
      </label>
   );
};

export default Radio;
