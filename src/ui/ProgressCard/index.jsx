import React from 'react';
import styles from './ProgressCard.module.scss';
import getSrcImage from '../../helpers/getSrcImage';
import Tag from '../Tag';

import stylesDragDropItems from '../../components/DragDrop/DragDropItems.module.scss';
import { IconEdit, IconTrash } from '../Icons';
import { useSelector } from 'react-redux';
import { getIsDesktop } from '@/redux';

const ProgressCard = ({ data, isAdmin, deleteCard, onClick = () => {}, editCard }) => {
  const isDesktop = useSelector(getIsDesktop);
  
   return (
      <article style={{ height: `${isDesktop ? 400 : 420}px` }} className={styles.ProgressCardRoot}>
         <div className="CardLinkElement z-10" onClick={onClick} />
         <div className={styles.ProgressCardBadges}>
            {data.images.length > 0 && (
               <Tag size="small" color="white">
                  {data.images.length} фото
               </Tag>
            )}
            {data.ytVideo && (
               <Tag size="small" color="white">
                  видео
               </Tag>
            )}
         </div>
         {isAdmin && (
            <>
               <button
                  onClick={() => editCard(data.id)}
                  title="Редактировать"
                  type="button"
                  className={`${stylesDragDropItems.DragDropImageIcon} top-4 right-14 !z-20 ${styles.ProgressCardControls}`}>
                  <IconEdit width={15} height={15} className="stroke-blue stroke-[1.5px]" />
               </button>
               <button
                  title="Удалить"
                  type="button"
                  className={`${stylesDragDropItems.DragDropImageIcon} top-4 right-4 !z-20 ${styles.ProgressCardControls}`}
                  onClick={() => deleteCard(data.id)}>
                  <IconTrash width={15} height={15} className="fill-red" />
               </button>
            </>
         )}
         <img className={styles.ProgressCardImage} src={getSrcImage(data.images ? data.images[0] : '')} />
      </article>
   );
};

export default ProgressCard;
