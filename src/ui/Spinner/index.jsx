import React from 'react';
import styles from './Spinner.module.scss';

const Spinner = ({ className = '', style = {} }) => {
   return <div className={`${styles.SpinnerRoot} ${className}`} style={style}></div>;
};

export const SpinnerOverlay = ({ className = '', classNameSpinner = '', children }) => {
   return (
      <div className={`${styles.SpinnerOverlay} ${className}`}>
         <div className={`${styles.SpinnerRoot} ${classNameSpinner}`}></div>
         {children}
      </div>
   );
};
export const SpinnerForBtn = ({ className = '', size = 24, variant }) => {
   return (
      <div
         style={{ width: size, height: size }}
         className={`${styles.SpinnerRoot} ${styles.SpinnerRootSmall} ${
            variant === 'second' ? '!border-white !border-b-blue' : ''
         } ${className}`}></div>
   );
};

export default Spinner;
