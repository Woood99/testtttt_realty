import React from 'react';

import { IconPriceDown, IconPriceUp } from '../Icons';

import styles from './HistoryPrice.module.scss';
import numberReplace from '../../helpers/numberReplace';
import { BtnAction } from '../ActionBtns';
import { ElementOldPrice } from '../Elements';
import { Tooltip } from '../Tooltip';
import { useSelector } from 'react-redux';
import { getIsDesktop, getWindowSize } from '@/redux';

const HistoryPrice = ({ data, className = '' }) => {
   const CurrentIcon = ({ status }) => {
      if (status === 'up') {
         return <IconPriceUp width={15} height={15} />;
      }
      if (status === 'down') {
         return <IconPriceDown width={15} height={15} />;
      }
      return '';
   };

   return (
      <Tooltip
         mobile
         color="white"
         event="click"
         offset={[10, 5]}
         ElementTarget={() => (
            <BtnAction className={`w-7 h-7 ${className}`}>
               <CurrentIcon status={data[0].status} />
            </BtnAction>
         )}
         close>
         <h3 className="title-3">История изменения цены</h3>
         <HistoryWrapper data={data} variant="mini" />
      </Tooltip>
   );
};

export const HistoryWrapper = ({ data, variant = 'default' }) => {
  const isDesktop = useSelector(getIsDesktop);

   return (
      <>
         <div className={styles.HistoryPriceContent}>
            {data.map((item, index) => {
               return (
                  <div
                     key={index}
                     className={`${styles.HistoryPriceItem} ${variant === 'default' ? styles.HistoryPriceItemDefault : styles.HistoryPriceItemMini}`}>
                     <span className={styles.HistoryPriceDate}>{item.date}</span>
                     <div className="flex items-center gap-4">
                        {variant === 'default' && isDesktop ? <ElementOldPrice>{numberReplace(item.value)} ₽</ElementOldPrice> : ''}
                        <span className={getCurrentClass(item.status)}>
                           {getCurrentOperator(item.status)}
                           {numberReplace(Math.abs(item.price - item.value))} ₽
                        </span>
                     </div>
                     <span className="font-medium">{numberReplace(item.price)} ₽</span>
                  </div>
               );
            })}
         </div>
      </>
   );
};

const getCurrentClass = status => {
   if (status === 'up') {
      return styles.HistoryPriceStatusUp;
   }
   if (status === 'down') {
      return styles.HistoryPriceStatusDown;
   }
   return '';
};

const getCurrentOperator = status => {
   if (status === 'up') {
      return '+';
   }
   if (status === 'down') {
      return '-';
   }
   return '';
};

export default HistoryPrice;
