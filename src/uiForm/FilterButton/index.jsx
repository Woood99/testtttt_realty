import React from 'react';

import styles from './FilterButton.module.scss';

import { IconFilter } from '../../ui/Icons';

const FilterButton = ({ label = 'Фильтры', onClick = () => {}, count = 0, mini = false }) => {
   if (mini) {
      return (
         <button type="button" className={styles.FilterButtonMiniRoot} onClick={onClick}>
            <IconFilter width={20} height={20} className={styles.FilterButtonIcon} />
         </button>
      );
   }

   return (
      <button type="button" className={styles.FilterButtonRoot} onClick={onClick}>
         <IconFilter width={20} height={20} className={styles.FilterButtonIcon} />
         <span>{label}</span>
         {count && count > 0 ? <span className={styles.FilterButtonCount}>{count}</span> : null}
      </button>
   );
};

export default FilterButton;
