import React, { useEffect, useState } from 'react';
import cn from 'classnames';
import styles from './FixedBlock.module.scss';

const FixedBlock = ({ children, condition, activeDefault = false, conditionWidth = null, className }) => {
   const [isActive, setIsActive] = useState(activeDefault);

   useEffect(() => {
      if (activeDefault || conditionWidth !== null) return;

      const handleScroll = () => {
         const pageOffsetTop = window.pageYOffset;
         const targetOffsetTop = condition.el.current.getBoundingClientRect().top;
         if (
            targetOffsetTop > innerHeight &&
            pageOffsetTop > condition.top &&
            condition.el.current.offsetTop + condition.el.current.clientHeight > pageOffsetTop + innerHeight
         ) {
            setIsActive(true);
         } else {
            setIsActive(false);
         }
      };

      window.addEventListener('scroll', handleScroll);

      return () => {
         window.removeEventListener('scroll', handleScroll);
      };
   }, [conditionWidth]);

   if (!conditionWidth && conditionWidth !== null) {
      return;
   }

   return <div className={cn(styles.FixedBlockRoot, isActive && styles.FixedBlockRootActive, className)}>{children}</div>;
};

export default FixedBlock;
