import React from 'react';

import styles from './Header.module.scss';
import logoUrl from '../../assets/svg/logo.svg';
import { RoutesPath } from '../../constants/RoutesPath';

const Logo = () => {
   return (
      <a href={RoutesPath.home} className={styles.logo}>
         <img loading="lazy" src={logoUrl} width="60" height="25" alt="Inrut" />
      </a>
   );
};

export default Logo;
