import styles from './CardLink.module.scss';

import React from 'react';

const CardLink = ({ children, href, className = '' }) => {
   if (href) {
      return (
         <a href={href} className={`${styles.root} ${className}`}>
            {children}
         </a>
      );
   } else {
      return <button className={`${styles.root} ${className}`}>{children}</button>;
   }
};

export default CardLink;
