import React from 'react';
import cn from 'classnames';

import styles from './CharsFlat.module.scss';

export const CharsFlat = props => {
   const { justifyBetween = false, className = '', color = '', isActive = true } = props;
   return (
      <div className={`${styles.CharsFlat} ${justifyBetween ? styles.CharsFlatBetween : ''} ${!isActive ? styles.CharsPrimary400 : ''} ${className}`}>
         {props.children}
      </div>
   );
};

export const Chars = props => {
   const { justifyBetween = false, className = '', color = '', hiddenAfter = false } = props;
   const classColor = () => {
      switch (color) {
         case '':
            return '';
         case 'blue':
            return styles.CharsBlue;
         default:
            return '';
      }
   };
   return (
      <div className={cn(styles.Chars, justifyBetween && styles.CharsBetween, hiddenAfter && styles.CharsHidden, className, classColor())}>
         {props.children}
      </div>
   );
};

export const CharsColItems = ({ className = '', data = [], classNameCol = '', classNameName, classNameValue }) => {
   return (
      <ul className={`flex flex-wrap gap-x-11 gap-y-6 ${className}`}>
         {data.map((item, index) => {
            if (!item.value) return;
            return (
               <li className={`${classNameCol}`} key={index}>
                  <CharsCol data={item} className={cn('!flex-row', item.className)} classNameName={classNameName} classNameValue={classNameValue} />
               </li>
            );
         })}
      </ul>
   );
};

export const CharsCol = ({ data, className = '', classNameName, classNameValue }) => {
   return (
      <div className={`flex flex-col gap-2 text-small ${className}`}>
         <span className={cn('text-primary400', classNameName)}>{data.name}</span>
         <span className={cn('font-medium', classNameValue)}>{data.value}</span>
      </div>
   );
};
