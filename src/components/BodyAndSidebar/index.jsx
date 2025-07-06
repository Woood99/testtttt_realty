import React, { memo } from 'react';

import styles from './BodyAndSidebar.module.scss';

const BodyAndSidebar = memo(({ children, className = '' }) => {
   return <div className={`${styles.BodyAndSidebarRoot} ${className}`}>{children}</div>;
});

export default BodyAndSidebar;
