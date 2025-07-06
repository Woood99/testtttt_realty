import React, { createContext, useState } from 'react';

import styles from './CardSecond.module.scss';
import CardGallery from '../CardGallery';
import HistoryPrice from '../HistoryPrice';

import numberReplace from '../../helpers/numberReplace';
import UserInfo from '../UserInfo';
import { TagCashback, TagDiscount, TagPresent } from '../Tag';
import { RoutesPath } from '../../constants/RoutesPath';
import { TagsMoreHeight } from '../TagsMore';
import LocationModal from '../../ModalsMain/LocationModal';
import { ElementOldPrice } from '../Elements';
import CardSecondControls from './ui/CardSecondControls';

export const CardSecondContext = createContext();

const CardSecond = props => {
   const {
      images,
      name,
      address,
      history,
      user,
      developer,
      rooms,
      area,
      floor,
      price,
      bd_price,
      frame,
      deadline,
      id,
      childrenContent = '',
      badge,
      variant,
      geo,
      location,
      cashback,
      present,
      tags,
      buildingCashback,
      buildingDiscount = {},
   } = props;
   const { className = '' } = props;

   const [isOpenModalLocation, setIsOpenModalLocation] = useState(false);
   const title = `${rooms === 0 ? 'Студия' : `${rooms}-комн квартира`}, ${area} м², ${floor} эт.`;
   const currentUser = user || developer;

   const classVariant = () => {
      switch (variant) {
         case '':
            return '';
         case 'shadow':
            return styles.CardSecondRootShadow;
         default:
            return '';
      }
   };

   const is_discount = bd_price > 0 && bd_price !== price;
   const cashbackValue = ((bd_price || price) / 100) * ((cashback || 0) + (buildingCashback?.value || 0));

   return (
      <CardSecondContext.Provider value={{ ...props, setIsOpenModalLocation }}>
         <article className={`${styles.CardSecondRoot} ${classVariant()} ${className}`}>
            <div className="relative flex flex-col flex-grow">
               <a href={`${RoutesPath.apartment}${id}`} className={styles.CardSecondLink}></a>
               <CardGallery images={images} title={title} href={`${RoutesPath.apartment}${id}`} badge={badge} imageFit="contain" />
               <div className="flex gap-2 absolute top-3 right-3">
                  <CardSecondControls />
               </div>
               <div className={styles.CardSecondContent}>
                  {childrenContent}
                  <div className="flex gap-3 justify-between mb-3 flex-grow">
                     <div className="flex flex-col">
                        {Boolean(cashbackValue || present || buildingDiscount) && (
                           <div className="flex flex-wrap gap-1.5 mb-1.5">
                              <TagDiscount {...buildingDiscount} />
                              <TagCashback cashback={cashbackValue} increased={buildingCashback} />

                              {Boolean(present) && <TagPresent present={present} />}
                           </div>
                        )}
                        {Boolean(tags?.length) && (
                           <div className="flex flex-wrap gap-1.5 w-full mb-1.5">
                              <TagsMoreHeight data={tags} increaseHeight />
                           </div>
                        )}
                        <div className="flex items-center gap-2 [&:not(:first-child)]:mt-2 mb-1">
                           <div className="flex flex-col items-start">
                              {is_discount && <ElementOldPrice className="mb-1">{numberReplace(price)} ₽</ElementOldPrice>}
                              <h3 className="text-bigSmall font-medium">{numberReplace(bd_price || price)} ₽</h3>
                           </div>

                           {history && history.length > 0 ? <HistoryPrice data={history} className="z-50 relative" /> : ''}
                        </div>
                        <div className="title-4 mt-1">{title}</div>
                        <p className={styles.CardSecondTerm}>
                           Корпус: {frame} Срок сдачи: {deadline}
                        </p>
                        {Boolean(name) && <p className={styles.CardSecondName}>{name}</p>}

                        <p className={styles.CardSecondAddress}>{address}</p>
                     </div>
                  </div>
                  {currentUser && (
                     <div className={styles.CardSecondBottom}>
                        <UserInfo avatar={currentUser.avatarUrl} name={currentUser.name} pos={currentUser.pos} />
                     </div>
                  )}
               </div>
               <LocationModal condition={isOpenModalLocation} set={setIsOpenModalLocation} geo={geo || location} />
            </div>
         </article>
      </CardSecondContext.Provider>
   );
};

export default CardSecond;
