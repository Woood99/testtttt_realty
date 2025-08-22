import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import cn from 'classnames';
import styles from './CardSecondRow.module.scss';
import { TagsMoreHeight } from '../TagsMore';
import { TagCashback, TagDiscount, TagPresent } from '../Tag';
import CardGallery from '../CardGallery';
import { BtnAction, BtnActionComparison, BtnActionFavorite } from '../ActionBtns';
import { Tooltip } from '../Tooltip';
import { IconEdit, IconLocation, IconTrash } from '../Icons';
import UserInfo from '../UserInfo';
import { PrivateRoutesPath, RoutesPath } from '../../constants/RoutesPath';
import numberReplace from '../../helpers/numberReplace';
import LocationModal from '../../ModalsMain/LocationModal';
import DeleteApartmentModal from '../../ModalsMain/DeleteApartmentModal';
import { ElementOldPrice } from '../Elements';

const CardSecondRow = props => {
   const {
      images,
      name,
      address,
      user,
      developer,
      rooms,
      area,
      floor,
      price,
      frame,
      deadline,
      id,
      complex,
      childrenBottom = '',
      badge,
      variant,
      geo,
      location,
      geoVisible = true,
      purchase,
      btnComparisonVisible = true,
      btnFavoriteVisible = true,
      classNameBottom = '',
      controlsAdmin,
      buildingDiscount,
      buildingCashback,
      bd_price,
      cashback,
      present,
      tags,
      className,
   } = props;

   const [isOpenModalLocation, setIsOpenModalLocation] = useState(false);
   const [confirmDeleteModal, setConfirmDeleteModal] = useState(false);

   const title = `${rooms === 0 ? 'Студия' : `${rooms}-комн квартира`}, ${area} м², ${floor} эт.`;
   const currentUser = user || developer;

   const link = `${RoutesPath.apartment}${id}${purchase ? `?purchase=${purchase}` : ''}`;

   const classVariant = () => {
      switch (variant) {
         case '':
            return '';
         case 'shadow':
            return styles.CardSecondRowRootShadow;
         default:
            return '';
      }
   };

   const is_discount = bd_price > 0 && bd_price !== price;
   const cashbackValue = ((bd_price || price) / 100) * ((cashback || 0) + (buildingCashback?.value || 0));

   return (
      <article className={cn(styles.CardSecondRowRoot, classVariant(), className)}>
         <div className={styles.CardSecondRowContainer}>
            <a href={link} className={styles.CardSecondRowLink} />
            <CardGallery images={images} title={title} href={link} badge={badge} imageFit="contain" className={styles.CardSecondRowGallery} />
            <div className={styles.CardSecondRowWrapper}>
               <div className={styles.CardSecondRowContent}>
                  <div className="flex gap-3 justify-between mb-8 flex-grow">
                     <div className="flex flex-col">
                        <div className="title-2 mb-2">{title}</div>
                        <p className={styles.CardSecondRowName}>{name || complex}</p>
                        <p className={styles.CardSecondRowTerm}>
                           Корпус: {frame} Срок сдачи: {deadline}
                        </p>
                        <p className={styles.CardSecondRowAddress}>{address}</p>
                     </div>
                  </div>
                  <div className={styles.CardSecondRowAdd}>
                     <div className="mb-2">
                        <div className="flex flex-col items-start">
                           {is_discount && <ElementOldPrice className="mb-1">{numberReplace(price)} ₽</ElementOldPrice>}
                           <h3 className="text-bigSmall font-medium">{numberReplace(bd_price || price)} ₽</h3>
                        </div>
                     </div>
                     {Boolean(cashbackValue || present || buildingDiscount) && (
                        <div className="flex flex-wrap gap-1.5 mb-1.5">
                           <TagDiscount {...buildingDiscount} />
                           {Boolean(present) && <TagPresent present={present} />}
                           <TagCashback cashback={cashbackValue} increased={buildingCashback} />
                        </div>
                     )}

                     {Boolean(tags?.length) && (
                        <div className="mb-3 flex flex-wrap gap-1.5 w-full">
                           <TagsMoreHeight data={tags} increaseHeight />
                        </div>
                     )}
                  </div>
                  <div className="ml-auto flex flex-col gap-2">
                     {!controlsAdmin ? (
                        <>
                           {/* {btnComparisonVisible && <BtnActionComparison id={id} type="apartment" variant="tooltip" placement="left" />} */}
                           {btnFavoriteVisible && <BtnActionFavorite id={id} type="apartment" variant="tooltip" placement="left" />}
                           {geoVisible && (
                              <Tooltip
                                 placement="left"
                                 offset={[10, 5]}
                                 ElementTarget={() => (
                                    <BtnAction className="relative z-50" onClick={() => setIsOpenModalLocation(true)}>
                                       <IconLocation width={15} height={15} className="pointer-events-none" />
                                    </BtnAction>
                                 )}>
                                 Показать на карте
                              </Tooltip>
                           )}
                        </>
                     ) : (
                        <>
                           <Tooltip
                              placement="left"
                              offset={[10, 5]}
                              ElementTarget={() => (
                                 <Link to={`${PrivateRoutesPath.apartment.edit}${id}`} target="_blank">
                                    <BtnAction Selector="div" className="relative z-50">
                                       <IconEdit className="stroke-blue" width={18} height={18} />
                                    </BtnAction>
                                 </Link>
                              )}>
                              Редактировать
                           </Tooltip>
                           <Tooltip
                              placement="left"
                              offset={[10, 5]}
                              ElementTarget={() => (
                                 <BtnAction className="relative z-50" onClick={() => setConfirmDeleteModal(id)}>
                                    <IconTrash className="stroke-red" width={16} height={16} />
                                 </BtnAction>
                              )}>
                              Удалить
                           </Tooltip>
                        </>
                     )}
                  </div>
               </div>
               {currentUser && (
                  <div className={`${styles.CardSecondRowBottom} ${classNameBottom}`}>
                     <UserInfo avatar={currentUser.avatarUrl} name={currentUser.name} pos={currentUser.pos} />
                     {childrenBottom}
                  </div>
               )}
            </div>
         </div>
         <LocationModal condition={isOpenModalLocation} set={setIsOpenModalLocation} geo={geo || location} />
         <DeleteApartmentModal
            options={{
               condition: confirmDeleteModal,
               set: setConfirmDeleteModal,
               title: (
                  <>
                     <br /> {title}
                  </>
               ),
               redirectUrl: false,
            }}
         />
      </article>
   );
};

export default CardSecondRow;
