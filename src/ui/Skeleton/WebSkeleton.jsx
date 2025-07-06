import React from 'react';
import styles from './WebSkeleton.module.scss';

const WebSkeleton = ({ className = '' }) => {
   return (
      <div className={`${styles.WebSkeleton} ${className}`}>
         <span className={styles.WebSkeletonChildren}></span>
      </div>
   );
};

export default WebSkeleton;
