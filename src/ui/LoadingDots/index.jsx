import React from 'react';
import styles from './LoadingDots.module.scss';

const LoadingDots = () => {
   return (
      <div className={styles.loadingDotsRoot}>
         <div className={styles.loadingDotsDot} />
         <div className={styles.loadingDotsDot} />
         <div className={styles.loadingDotsDot} />
      </div>
   );
};

export default LoadingDots;
