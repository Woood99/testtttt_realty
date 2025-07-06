import React, { createContext, useState } from 'react';
import cn from 'classnames';

import styles from './CardPrimary.module.scss';

import UserInfo from '../UserInfo';
import CardGallery from '../CardGallery';

import MetroItems from '../MetroItems';
import { RoutesPath } from '../../constants/RoutesPath';
import { Link } from 'react-router-dom';
import { TagsMoreHeight } from '../TagsMore';
import LocationModal from '../../ModalsMain/LocationModal';
import { classVariant } from './classVariant';
import CardPrimaryControls from './ui/CardPrimaryControls';
import CardPrimaryTagsTop from './ui/CardPrimaryTags';
import CardPrimaryApartments from './ui/CardPrimaryApartments';
import findObjectWithMinValue from '../../helpers/findObjectWithMinValue';

export const CardPrimaryContext = createContext();

const CardPrimary = props => {
   const {
      title,
      deadline,
      images,
      city,
      address,
      user,
      tags,
      metro,
      className = '',
      variant = '',
      id,
      onMouseEnter,
      onMouseLeave,
      userVisible = true,
      href = '',
      childrenContent = '',
      badge,
      geo,
      children,
   } = props;

   const [isOpenModalLocation, setIsOpenModalLocation] = useState(false);

   return (
      <CardPrimaryContext.Provider value={{ ...props, setIsOpenModalLocation }}>
         <article className={cn(styles.CardPrimaryRoot, className, classVariant(variant))} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
            <div className="flex flex-col h-full relative">
               <Link to={href || `${RoutesPath.building}${id}`} target="_blank" rel="noopener noreferrer" className={styles.CardPrimaryLink} />
               <CardGallery images={images} title={title} href={href || `${RoutesPath.building}${id}`} badge={badge} />
               <div className="flex gap-2 absolute top-3 right-3">
                  <CardPrimaryControls />
               </div>

               <div className={styles.CardPrimaryContent}>
                  {childrenContent}
                  <div className="mb-4 w-[95%]">
                     <CardPrimaryTagsTop />
                     <h3 className={`title-3-5 ${styles.CardPrimaryTitle}`}>{title}</h3>
                     <p className={styles.CardPrimaryTerm}>Срок сдачи: {deadline}</p>
                     <p className={styles.CardPrimaryAddress}>{[city, address].filter(item => item).join(', ')}</p>
                     <div className={styles.CardPrimaryMetro}>
                        <MetroItems data={metro} />
                     </div>
                     <CardPrimaryApartments />
                  </div>

                  {Boolean(tags?.length) && (
                     <div className="flex flex-wrap gap-1.5 w-full mb-4">
                        <TagsMoreHeight data={tags} increaseHeight />
                     </div>
                  )}
                  {user && userVisible && (
                     <div className={styles.CardPrimaryBottom}>
                        <UserInfo centered avatar={user.avatarUrl} name={user.name} pos={user.pos} className="w-full" />
                     </div>
                  )}
                  {children}
               </div>
            </div>
            <LocationModal condition={isOpenModalLocation} set={setIsOpenModalLocation} geo={geo} />
         </article>
      </CardPrimaryContext.Provider>
   );
};

export default CardPrimary;
