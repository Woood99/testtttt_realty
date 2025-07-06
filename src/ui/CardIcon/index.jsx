import React from 'react';
import styles from './CardIcon.module.scss';
import getSrcImage from '../../helpers/getSrcImage';
import { IconChecked } from '../Icons';

const CardIcon = ({ data, className = '', active, activeOpacity, onClick = () => {} }) => {
   return (
      <article
         className={`${styles.CardIconRoot} ${active ? styles.CardIconRootActive : ''} ${className} ${
            activeOpacity ? styles.CardIconRootActiveOpacity : ''
         }`}
         onClick={onClick}>
         <img className={styles.CardIconImage} src={getSrcImage(data?.image || '')} alt={data?.title} />
         <span className={styles.CardIconTitle}>{data?.title}</span>
         <div className={styles.CardIconCheck} aria-hidden>
            <IconChecked />
         </div>
      </article>
   );
};

export default CardIcon;
