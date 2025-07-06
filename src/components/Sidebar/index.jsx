import React, { useEffect, useState } from 'react';

import styles from './Sidebar.module.scss';
import cn from 'classnames';

const Sidebar = ({ children, className = '' }) => {
   return (
      <div>
         <div className={cn(styles.SidebarRoot, className)}>{children}</div>
      </div>
   );
};

export const SidebarMove = ({ block, targets, children }) => {
   const [isStickyBlockTop, setIsStickyBlockTop] = useState(true);

   useEffect(() => {
      if (!block) return;

      const observerOptions = {
         root: null,
         rootMargin: '0px',
         threshold: 0,
      };

      const observer = new IntersectionObserver(entries => {
         entries.forEach(entry => {
            if (entry.target === block) {
               setIsStickyBlockTop(prev => !prev);
            }
         });
      }, observerOptions);

      observer.observe(block);

      return () => {
         observer.unobserve(block);
      };
   }, [block]);

   useEffect(() => {
      const elements = targets.map(item => document.querySelector(`.${item}`));
      if (isStickyBlockTop) {
         elements[0]?.classList.add('opacity-0');
         elements[1]?.classList.remove('opacity-0');
      } else {
         elements[0]?.classList.remove('opacity-0');
         elements[1]?.classList.add('opacity-0');
      }
   }, [isStickyBlockTop]);

   return children;
};

export default Sidebar;
