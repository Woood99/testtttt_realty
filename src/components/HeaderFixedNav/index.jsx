import React, { useEffect, useLayoutEffect, useState } from 'react';
import { Link, DirectLink, Element, Events, animateScroll as scroll, scrollSpy, scroller } from 'react-scroll';

import styles from './HeaderFixedNav.module.scss';
import getNavLinks from '../../helpers/getNavLinks';
import { useLocation } from 'react-router-dom';

const HeaderFixedNav = () => {
   const location = useLocation();

   const [items, setItems] = useState([]);
   const [isVisible, setIsVisible] = useState((window.pageYOffset || document.documentElement.scrollTop) > 100);

   useLayoutEffect(() => {
      setItems(getNavLinks());
   }, []);

   useEffect(() => {
      if (location.hash) {
        const element = document.querySelector(location.hash);
        if (element) {
          scroll.scrollTo(element.offsetTop + (-52 - 12), {
            duration: 500,
            smooth: true,
          });
        }
      }
    }, [location]);

   useEffect(() => {
      const handleScroll = () => {
         const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
         setIsVisible(scrollTop > 100);
      };

      window.addEventListener('scroll', handleScroll);

      return () => {
         window.removeEventListener('scroll', handleScroll);
      };
   }, []);

   return (
      <>
         {items.length > 0 && (
            <header className={`${styles.HeaderFixedNavRoot} ${isVisible ? styles.HeaderFixedNavRootActive : ''}`}>
               <ul className="container flex items-center gap-8 h-full">
                  {items.map(item => (
                     <li key={item.id}>
                        <Link
                           to={item.id}
                           activeClass={styles.HeaderFixedNavLinkActive}
                           className={styles.HeaderFixedNavLink}
                           spy={true}
                           smooth={true}
                           offset={-52 - 12}
                           duration={500}>
                           {item.label}
                        </Link>
                     </li>
                  ))}
               </ul>
            </header>
         )}
      </>
   );
};

export default HeaderFixedNav;
