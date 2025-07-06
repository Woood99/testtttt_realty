import React from 'react';
import cn from 'classnames';
import styles from './CheckboxToggle.module.scss';

const CheckboxToggle = ({ checked = false, set = () => {}, className, classNameInput, text = '', classNameText,children }) => {
   return (
      <label className={cn(styles.CheckboxToggleRoot, className)}>
         <input type="checkbox" value={checked} checked={checked} onChange={set} className={cn(styles.CheckboxToggleInput, classNameInput)} />
         <div aria-hidden="true" className={styles.CheckboxToggleEl} />
         {text && <span className={cn('ml-3 mt-1 font-medium', classNameText)}>{text}</span>}
         {children}
      </label>
   );
};

export default CheckboxToggle;
