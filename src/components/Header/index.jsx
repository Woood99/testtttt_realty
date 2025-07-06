import React from 'react';
import { useSelector } from 'react-redux';

import styles from './Header.module.scss';

import HeaderActions from './HeaderActions';
import HeaderNav from './HeaderNav';
import { getIsDesktop } from '../../redux/helpers/selectors';
import HeaderLayout from './HeaderLayout';

const Header = ({ children, theme = 'white', maxWidth = null, visibleNav = true }) => {
   const isDesktop = useSelector(getIsDesktop);

   return (
      <header className={`${styles.header} ${theme === 'dark' ? styles.headerDark : ''}`}>
         <HeaderLayout theme={theme}>
            <HeaderActions maxWidth={maxWidth} />
            {Boolean(isDesktop && visibleNav) && <HeaderNav maxWidth={maxWidth} />}
            {children}
         </HeaderLayout>
      </header>
   );
};

export default Header;
