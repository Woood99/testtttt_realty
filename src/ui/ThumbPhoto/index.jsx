import React from 'react';

import styles from './ThumbPhoto.module.scss';

export const ThumbPhoto = ({ children, style = {}, className = '', size = 85, onClick = () => {} }) => {
   return (
      <div style={{ ...style, '--size': `${size}px` }} className={`${styles.ThumbPhoto} ${className}`} onClick={onClick}>
         {children}
      </div>
   );
};

export const ThumbPhotoFull = ({ children, style = {}, className = '', height = 100, onClick = () => {} }) => {
   return (
      <div style={{ ...style, height }} className={`${styles.ThumbPhotoFull} ibg ${className}`} onClick={onClick}>
         {children}
      </div>
   );
};

export const ThumbPhotoDefault = ({ children, style = {}, className = '', onClick = () => {} }) => {
   return (
      <div style={{ ...style }} className={`${styles.ThumbPhotoDefault} ${className}`} onClick={onClick}>
         {children}
      </div>
   );
};
