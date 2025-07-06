import React, { memo, useState } from 'react';
import styles from './RoomInfoCard.module.scss';
import { ThumbPhoto } from '../../../ui/ThumbPhoto';
import { ElementOldPrice } from '../../../ui/Elements';
import numberReplace from '../../../helpers/numberReplace';
import { TagCashback, TagDiscount, TagPresents } from '../../../ui/Tag';
import { Tooltip } from '../../../ui/Tooltip';
import { BtnAction, BtnActionComparison, BtnActionFavorite } from '../../../ui/ActionBtns';
import { IconEdit, IconTrash } from '../../../ui/Icons';
import { Link } from 'react-router-dom';
import { PrivateRoutesPath, RoutesPath } from '../../../constants/RoutesPath';
import getSrcImage from '../../../helpers/getSrcImage';
import { TagsMoreHeight } from '../../../ui/TagsMore';
import { isArray } from '../../../helpers/isEmptyArrObj';
import DeleteApartmentModal from '../../../ModalsMain/DeleteApartmentModal';
import { ROLE_ADMIN } from '../../../constants/roles';
import { useSelector } from 'react-redux';
import { getIsDesktop } from '../../../redux/helpers/selectors';

const RoomInfoCard = memo(({ data, room, userRole }) => {
   const [confirmDeleteModal, setConfirmDeleteModal] = useState(false);
   const isDesktop = useSelector(getIsDesktop);

   const price = data.bd_price || data.price;

   const is_discount = data.bd_price > 0 && data.bd_price !== data.price;

   const cashbackPrc = ((data.cashback / data.price) * 100 || 0) + (data.buildingCashback?.value || 0);
   const cashbackValue = (price / 100) * cashbackPrc;
   
   return (
      <div className={styles.RoomInfoCardRoot}>
         <Link to={`${RoutesPath.apartment}${data.id}`} className={styles.RoomInfoCardLink} target="_blank" rel="noopener noreferrer" />
         <ThumbPhoto>
            <img src={getSrcImage(data.image)} width={85} height={85} alt="" />
         </ThumbPhoto>
         <div className="flex flex-col gap-1 md3:gap-3">
            <div className="flex items-center gap-4 md3:flex-col md3:items-start md3:gap-1">
               {is_discount && <ElementOldPrice>{numberReplace(data.price)} ₽</ElementOldPrice>}
               <h3 className={`title-3 ${styles.RoomInfoCardTitle}`}>{numberReplace(price)} ₽</h3>
               <span className={styles.RoomInfoCardAttr}>
                  {room === 0 ? 'Студия' : `${room}-комн.`} {data.area} м², {data.floor} эт.
               </span>
            </div>
            <div className="flex items-center gap-4 md3:flex-col md3:items-start md3:gap-1">
               {data.frame && <span>Корпус: {data.frame}</span>}
               {data.deadline && <span>Срок сдачи: {data.deadline}</span>}
            </div>
         </div>
         <div className="flex gap-4 md1:gap-3 md1:items-start relative md1:col-span-2 md1:mt-4">
            <TagDiscount {...(data.buildingDiscount || {})} />
            <TagCashback cashback={cashbackValue} increased={data.buildingCashback} prefix="Кешбэк" />
            {Boolean(data.main_gifts.length || data.present || data.second_gifts.length) && (
               <TagPresents
                  dataMainGifts={isArray(data.main_gifts) ? data.main_gifts.filter(item => item) : []}
                  dataSecondGifts={isArray(data.second_gifts) ? data.second_gifts.filter(item => item) : []}
                  title="Есть подарок"
               />
            )}

            {Boolean(data.tags?.length) && <TagsMoreHeight data={data.tags} className="pointer-events-none !w-auto" />}
         </div>
         <div className="flex gap-4 md1:gap-2 md1:flex-col md1:col-start-3 md1:col-end-4 md1:row-start-1 md1:row-end-2">
            {userRole === ROLE_ADMIN.name ? (
               <>
                  <Tooltip
                     ElementTarget={() => (
                        <Link to={`${PrivateRoutesPath.apartment.edit}${data.id}`}>
                           <BtnAction Selector="div" className="relative z-50">
                              <IconEdit className="stroke-blue stroke-[1.5px]" width={18} height={18} />
                           </BtnAction>
                        </Link>
                     )}>
                     Редактировать
                  </Tooltip>
                  <Tooltip
                     ElementTarget={() => (
                        <BtnAction className="relative z-50" onClick={() => setConfirmDeleteModal(data.id)}>
                           <IconTrash className="fill-red" width={16} height={16} />
                        </BtnAction>
                     )}>
                     Удалить
                  </Tooltip>
               </>
            ) : (
               <>
                  {isDesktop && (
                     <>
                        <BtnActionComparison id={data.id} type="apartment" variant="tooltip" />
                        <BtnActionFavorite id={data.id} type="apartment" variant="tooltip" />
                     </>
                  )}
               </>
            )}
         </div>
         <DeleteApartmentModal
            options={{
               condition: confirmDeleteModal,
               set: setConfirmDeleteModal,
            }}
         />
      </div>
   );
});

export default RoomInfoCard;
