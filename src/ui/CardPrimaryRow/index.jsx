import React, { createContext, useState } from 'react';
import { Link } from 'react-router-dom';
import cn from 'classnames';

import styles from './CardPrimaryRow.module.scss';

import UserInfo from '../UserInfo';
import CardGallery from '../CardGallery';
import numberReplace from '../../helpers/numberReplace';

import MetroItems from '../MetroItems';
import findObjectWithMinValue from '../../helpers/findObjectWithMinValue';
import { RoutesPath } from '../../constants/RoutesPath';

import { TagsMoreHeight } from '../TagsMore';
import LocationModal from '../../ModalsMain/LocationModal';
import { classVariant } from './classVariant';
import CardPrimaryRowApartments from './ui/CardPrimaryRowApartments';
import CardPrimaryRowControls from './ui/CardPrimaryRowControls';
import CardPrimaryRowTagsTop from './ui/CardPrimaryRowTagsTop';

export const CardPrimaryRowContext = createContext();

const CardPrimaryRow = props => {
   const {
      city,
      title,
      deadline,
      images,
      address,
      quantity,
      apartments,
      user,
      tags,
      metro,
      className = '',
      variant = '',
      id,
      geo,
      is_active = true,
      visibleRooms = [],
   } = props;
   const [isOpenModalLocation, setIsOpenModalLocation] = useState(false);

   const [isBlockCard, setIsBlockCard] = useState(is_active);

   const minValue = findObjectWithMinValue(
      visibleRooms.length ? apartments.filter(item => visibleRooms.includes(item.rooms)) : apartments,
      'bd_price'
   );
   const minPrice = minValue?.bd_price.toString() || 0;

   return (
      <CardPrimaryRowContext.Provider value={{ ...props, minPrice, minValue, isBlockCard, setIsOpenModalLocation, setIsBlockCard }}>
         <article className={cn(styles.CardPrimaryRowRoot, className, classVariant(variant))}>
            {!isBlockCard && <span className="absolute inset-0 z-[90] bg-dark opacity-50" />}
            <div className={styles.CardPrimaryRowContainer}>
               <Link target="_blank" rel="noopener noreferrer" to={`${RoutesPath.building}${id}`} className={styles.CardPrimaryRowLink} />
               <CardGallery images={images} title={title} href={`${RoutesPath.building}${id}`} className={styles.CardPrimaryRowGallery} />
               <div className={styles.CardPrimaryRowWrapper}>
                  <div className={styles.CardPrimaryRowContent}>
                     <div className="flex-grow">
                        <h3 className="title-2 mb-2">{title}</h3>
                        <p className={styles.CardPrimaryRowTerm}>Срок сдачи: {deadline}</p>
                        <div className={styles.CardPrimaryRowAddress}>{[city, address].filter(item => item).join(', ')}</div>
                        <div className={styles.CardPrimaryRowMetro}>
                           <MetroItems data={metro} />
                        </div>
                        {Boolean(quantity) && <span className={styles.CardPrimaryRowQuantity}>{numberReplace(quantity)} квартир от застройщика</span>}
                        <CardPrimaryRowApartments />
                     </div>
                     <div className={styles.CardPrimaryRowAdd}>
                        {apartments && apartments.length > 0 ? <h3 className="title-2 mb-3">от {numberReplace(minPrice)} ₽</h3> : ''}
                        <CardPrimaryRowTagsTop />
                     </div>
                     <CardPrimaryRowControls />
                  </div>
                  {Boolean(tags?.length) && (
                     <div className="mb-3 flex flex-wrap gap-1.5 w-full">
                        <TagsMoreHeight data={tags} increaseHeight maxHeightDefault={23} />
                     </div>
                  )}

                  {user && (
                     <div className={styles.CardPrimaryRowBottom}>
                        <UserInfo centered avatar={user.avatarUrl} name={user.name} pos={user.pos} />
                     </div>
                  )}
               </div>
            </div>
            <LocationModal condition={isOpenModalLocation} set={setIsOpenModalLocation} geo={geo} />
         </article>
      </CardPrimaryRowContext.Provider>
   );
};

export default CardPrimaryRow;
