import React from 'react';
import { ThumbPhotoFull } from '../ThumbPhoto';
import getSrcImage from '../../helpers/getSrcImage';
import { declensionWordsOffer } from '../../helpers/declensionWords';

import styles from './AdvantageCard.module.scss';
import convertSum from '../../helpers/convertSum';
import { IconChecked } from '../Icons';

const AdvantageCard = ({ data, onChange = () => {}, value = false, textVisible = true, className = '' }) => {
   return (
      <article onClick={() => onChange(!value)} className={`${styles.AdvantageCardRoot} ${value ? styles.AdvantageCardRootActive : ''} ${className}`}>
         <div className={styles.AdvantageCardCheck} aria-hidden>
            <IconChecked />
         </div>
         <ThumbPhotoFull className={styles.AdvantageCardImage}>
            <img src={getSrcImage(data.image || '')} />
         </ThumbPhotoFull>
         <h3 className={`font-medium ${styles.AdvantageCardTitle}`}>{data.name}</h3>
         {textVisible && (
            <div className="mt-3 font-medium">
               {declensionWordsOffer(data.count || 0)}
               {Boolean(data.max_price && data.min_price) && (
                  <>
                     &nbsp;от {convertSum(data.min_price)} {data.max_price !== data.min_price ? `до ${convertSum(data.max_price)}` : ''}
                  </>
               )}
            </div>
         )}
      </article>
   );
};

export default AdvantageCard;
