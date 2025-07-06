import React from 'react';

import styles from './Header.module.scss';

import HeaderActions from './HeaderActions';
import HeaderLayout from './HeaderLayout';
import { useSelector } from 'react-redux';
import { getIsDesktop } from '../../redux/helpers/selectors';
import HeaderNav from './HeaderNav';

const HeaderAdmin = ({ children, theme = 'white', maxWidth = null }) => {
   const isDesktop = useSelector(getIsDesktop);
   return (
      <header className={styles.header}>
         <HeaderLayout theme={theme} isAdmin>
            <HeaderActions maxWidth={maxWidth} />
            {isDesktop && <HeaderNav maxWidth={maxWidth} />}
            {children}
         </HeaderLayout>
      </header>
   );
};

export default HeaderAdmin;
