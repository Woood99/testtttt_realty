import React from 'react';

import styles from './CardScheme.module.scss';
import numberReplace from '../../helpers/numberReplace';
import getSrcImage from '../../helpers/getSrcImage';
import { TagCashback, TagPresent, TagsDiscounts } from '../Tag';
import Button from '../../uiForm/Button';
import { TagsMoreHeight } from '../TagsMore';
import { getMaxCashback } from '../../helpers/cashbackUtils';

const CardScheme = ({ data, room, onClick, active }) => {
   const {
      image,
      totalApartment,
      deadline,
      floors,
      frame,
      minArea,
      minBdPrice,
      minPrice,
      max_bd_price,
      max_price,
      tags,
      haveGift,
      cashback,
      buildingCashbacks,
      buildingDiscounts,
   } = data;

   const max_building_cashback = getMaxCashback(buildingCashbacks);

   const cashbackPrc = (cashback || 0) + (max_building_cashback.value || 0);
   const cashbackValue = ((max_bd_price || max_price) / 100) * cashbackPrc;

   return (
      <article className={`${styles.CardSchemeRoot} ${active ? styles.CardSchemeActiveRoot : ''}`}>
         <div className="CardLinkElement z-50" onClick={onClick} />
         <div className={styles.CardSchemeImage}>
            <div className={`${styles.CardSchemeImageIbg} ibg-contain`}>
               <img src={getSrcImage(image)} width={340} height={245} alt="" />
            </div>
         </div>
         <div className={styles.CardSchemeContent}>
            {Boolean(cashbackPrc || haveGift || tags) && (
               <div className="flex flex-wrap gap-2">
                  <TagsDiscounts discounts={buildingDiscounts} is_building by_price={minBdPrice || minPrice} by_area={minArea} />
                  <TagCashback cashback={cashbackValue} increased={max_building_cashback} />
                  {haveGift ? <TagPresent present={haveGift} title="Подарок на выбор" /> : ''}
                  {Boolean(tags?.length) && <TagsMoreHeight data={tags} className="pointer-events-none !w-auto flex-grow overflow-hidden" />}
               </div>
            )}

            <h3 className="title-3 mt-4 mb-1">от {numberReplace(minBdPrice || minPrice || 0)} ₽</h3>
            <div className="mb-4">
               <span className="font-medium">{room === 0 ? 'Студия' : `${room}-комн.`}</span>&nbsp;
               <span className="font-medium">{minArea} м²</span>&nbsp;
               <span>этажи: {[...new Set(floors)].join(', ')}</span>
               <div className={styles.CardSchemeAttr}>
                  {frame && <span>Корпус: {frame}</span>}
                  {deadline && <span>Срок сдачи: {deadline}</span>}
               </div>
            </div>
            <Button Selector="div" variant="secondary" size="Small" className="mt-auto">
               Выбрать из {totalApartment} квартир
            </Button>
         </div>
      </article>
   );
};

export default CardScheme;
