import React from 'react';

import { IconMetro } from '../Icons';

import styles from './MetroItems.module.scss';

import convertTime from '../../helpers/convertTime';

const MetroItems = ({ data, visibleItems = 1, className='' }) => {
   if (!(data && data.length > 0)) return;

   return (
      <div className={`${styles.MetroItems} ${className}`}>
         {data.map((item, index) => {
            {
               return visibleItems > index && <MetroItem data={item} key={index} />;
            }
         })}
      </div>
   );
};

const MetroItem = ({ data }) => {
   if (!data) return;
   return (
      <div className={styles.MetroItem}>
         <IconMetro width={20} height={20} />
         <span className={styles.MetroItemName}>{data.name}</span>
         {data.time > 0 && <span className={styles.MetroItemTime}>~ {convertTime(data.time).minutes} мин.</span>}
      </div>
   );
};

export default MetroItems;
