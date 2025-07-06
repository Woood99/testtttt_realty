import React from 'react';

import styles from './BannerInfo.module.scss';

const BannerInfo = ({ backgroundColor, children, className = '' }) => {
   return (
      <div className={`${styles.bannerInfo} ${className}`} style={{ backgroundColor: backgroundColor }}>
         {children}
      </div>
   );
};

export default BannerInfo;
