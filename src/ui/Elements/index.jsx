import React from 'react';

import styles from './Elements.module.scss';
import cn from 'classnames';

export const ElementOldPrice = props => {
   const { Selector = 'div', className = '' } = props;
   return (
      <Selector {...props} className={`${styles.ElementOldPrice} ${className}`}>
         {props.children}
      </Selector>
   );
};

export const ElementTitleSubtitle = props => {
   const { className = '' } = props;
   return (
      <h1 {...props} className={`${styles.ElementTitleSubtitle} ${className} title-2`}>
         {props.children}
      </h1>
   );
};
export const ElementTitleSubtitleSecond = props => {
   const { className = '' } = props;
   return (
      <div {...props} className={`${styles.ElementTitleSubtitleSecond} ${className}`}>
         {props.children}
      </div>
   );
};

export const ElementNavBtn = props => {
   const { Selector = 'div', className = '', active = false } = props;

   return <Selector className={cn(styles.ElementNavBtn, className, active && styles.ElementNavBtnActive)}>{props.children}</Selector>;
};

export const ElementNavBtnCount = ({ className = '', children, active = false }) => {
   return (
      <div
         className={cn(
            'ml-auto bg-count _blue w-12 group-hover:!bg-white transition-all duration-300',
            className,
            active ? '!bg-white' : '!bg-primary700'
         )}>
         {children}
      </div>
   );
};
