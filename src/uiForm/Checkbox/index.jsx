import React from 'react';

import styles from './Checkbox.module.scss';
import { IconChecked } from '../../ui/Icons';
import Avatar from '../../ui/Avatar';

const Checkbox = ({ option = {}, checked = false, onChange, className = '', disabled, isValid, readOnly = false, children }) => {
   return (
      <label className={`${styles.CheckboxRoot} ${className} ${option.image ? '!items-center' : ''}`}>
         <input
            type="checkbox"
            value={option.value || ''}
            checked={checked}
            onChange={onChange}
            disabled={disabled}
            className={styles.CheckboxInput}
            readOnly={readOnly}
         />
         <div className={styles.CheckboxMark}>
            <IconChecked />
         </div>
         {Boolean(option.label) && (
            <span className={`${styles.CheckboxContent} ${option.image ? 'flex items-center gap-2 !mt-0.5' : ''}`}>
               {option.image && (
                  <>
                     {option.image === 'default' ? (
                        <Avatar src={''} title={option.label} size={40} />
                     ) : (
                        <Avatar src={option.image} title={option.label} size={40} />
                     )}
                  </>
               )}
               {option.label}
            </span>
         )}
         {option.BodyContent ? option.BodyContent() : <></>}
         {children}
      </label>
   );
};

export default Checkbox;
