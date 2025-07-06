import React, { useState } from 'react';

import styles from './CardStock.module.scss';
import UserInfo from '../UserInfo';

import stylesDragDropItems from '../../components/DragDrop/DragDropItems.module.scss';
import { IconEdit, IconTrash } from '../Icons';
import getSrcImage from '../../helpers/getSrcImage';
import { Link } from 'react-router-dom';
import { RoutesPath } from '../../constants/RoutesPath';
import { capitalizeWords } from '../../helpers/changeString';
import cn from 'classnames';
import { BlockDescrMore } from '../../components/BlockDescr/BlockDescr';
import { sendPostRequest } from '../../api/requestsApi';
import { useSelector } from 'react-redux';
import { getUserIsAdmin } from '../../redux/helpers/selectors';
import ModalWrapper from '../Modal/ModalWrapper';
import DeleteModal from '../../ModalsMain/DeleteModal';
import Button from '../../uiForm/Button';
import { isActualDate } from '../../helpers/isActualDate';

const classVariant = variant => {
   switch (variant) {
      case '':
         return '';
      case 'shadow':
         return styles.CardStockShadow;
      default:
         return '';
   }
};

export const CardStock = props => {
   const {
      id,
      image,
      title,
      name,
      descr,
      deleteCard = () => {},
      variant = '',
      editCard,
      user = null,
      author = null,
      developer = null,
      visibleComplex = true,
      controlsAdmin = false,
      building_id,
   } = props;

   const userData = author || user || developer;

   const [isDeleteVideoModal, setIsDeleteVideoModal] = useState(false);
   const userIsAdmin = useSelector(getUserIsAdmin);

   return (
      <article className={`${styles.CardStock} ${classVariant(variant)}`}>
         {userIsAdmin && controlsAdmin && (
            <>
               {editCard && (
                  <button
                     onClick={() => editCard(id)}
                     title="Редактировать"
                     type="button"
                     className={`${stylesDragDropItems.DragDropImageIcon} top-4 right-14 !z-20 ${styles.CardStockControl}`}>
                     <IconEdit width={15} height={15} className="stroke-blue stroke-[1.5px]" />
                  </button>
               )}
               <button
                  type="button"
                  className={`${stylesDragDropItems.DragDropImageIcon} top-4 right-4 ${styles.CardStockControl}`}
                  onClick={() => setIsDeleteVideoModal(true)}>
                  <IconTrash width={15} height={15} className="fill-red" />
               </button>
            </>
         )}

         <Link to={`${RoutesPath.promo}${props.id}${visibleComplex ? '?visibleComplex=1' : ''}`} target="_blank" className={styles.CardStockLink} />

         <div className={`${styles.CardStockImage} ibg`}>
            <img loading="lazy" src={getSrcImage(image)} width="323" height="207" alt={title} />
            {userData && (
               <div className={`${styles.CardStockUser} absolute bottom-2 left-2 z-10 max-w-[93%]`}>
                  <UserInfo
                     avatar={userData.avatar_url || userData.avatarUrl || userData.image}
                     name={capitalizeWords(userData.name, userData.surname)}
                     pos={userData.pos || 'Менеджер отдела продаж'}
                     centered
                     classListName="!text-white text-[12px]"
                     sizeAvatar={26}
                     classListUser="!text-white"
                  />
               </div>
            )}
         </div>
         <div className={styles.CardStockContent}>
            {Boolean(title && visibleComplex) && (
               <Link to={`${RoutesPath.building}${building_id}`} className={`font-medium blue-link relative z-10 mb-2`}>
                  {!title.includes('ЖК') ? 'ЖК ' : ''}
                  {title}
               </Link>
            )}
            {name && <div className={`${styles.CardStockName} cut cut-1 title-4`}>{name}</div>}
            {descr && <p className={styles.CardStockDescr}>{descr}</p>}
         </div>

         <ModalWrapper condition={isDeleteVideoModal}>
            <DeleteModal
               condition={isDeleteVideoModal}
               title={<>Вы действительно хотите удалить ?</>}
               set={setIsDeleteVideoModal}
               request={async () => {
                  await sendPostRequest(`/admin-api/promo/${id}/delete`);
                  await deleteCard();
                  setIsDeleteVideoModal(false);
               }}
            />
         </ModalWrapper>
      </article>
   );
};

export const CardPost = props => {
   const {
      image,
      title,
      name,
      descr,
      variant = '',
      user = null,
      author = null,
      developer = null,
      visibleComplex = true,
      building_id = 1,
      start,
      end,
   } = props;

   const userData = author || user || developer;
   const isActual = isActualDate(start, end);

   console.log(isActual);

   return (
      <article className={`${styles.CardStock} ${classVariant(variant)}`}>
         <Link to={`${RoutesPath.promo}${props.id}${visibleComplex ? '?visibleComplex=1' : ''}`} target="_blank" className={styles.CardStockLink} />
         {userData && (
            <div className={cn(styles.CardStockUser, '!mt-0 !mb-3')}>
               <UserInfo
                  avatar={userData.avatar_url || userData.avatarUrl || userData.image}
                  name={capitalizeWords(userData.name, userData.surname)}
                  pos={userData.pos || 'Менеджер отдела продаж'}
                  centered
               />
            </div>
         )}
         <div className={cn(styles.CardStockImage, 'ibg')}>
            <img loading="lazy" src={getSrcImage(image)} width="323" height="207" alt={title} />
         </div>
         <div className={styles.CardStockContent}>
            {!isActual && (
               <Button size="34" Selector="div" className="mb-5 flex-center-all gap-2 !bg-[#fff5e2] w-full !text-dark">
                  Срок действия акции истёк
               </Button>
            )}
            {Boolean(title && visibleComplex) && (
               <Link to={`${RoutesPath.building}${building_id}`} className={`font-medium blue-link relative z-10 mb-2`}>
                  {!title.includes('ЖК') ? 'ЖК ' : ''}
                  {title}
               </Link>
            )}
            {name && <div className={`${styles.CardStockName} title-4`}>{name}</div>}
            {descr && <BlockDescrMore descr={descr} lines={2} className="cut-2-imp" />}
         </div>
      </article>
   );
};
