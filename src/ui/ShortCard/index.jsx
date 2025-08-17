import React, { useState } from 'react';

import styles from './ShortCard.module.scss';
import isEmptyArrObj from '../../helpers/isEmptyArrObj';
import UserInfo from '../UserInfo';
import { capitalizeWords } from '../../helpers/changeString';
import { BASE_URL } from '../../constants/api';
import { RoutesPath } from '../../constants/RoutesPath';
import { Link } from 'react-router-dom';
import getSrcImage from '../../helpers/getSrcImage';
import { ROLE_ADMIN } from '../../constants/roles';
import cn from 'classnames';
import { useSelector } from 'react-redux';
import { getUserIsAdmin } from '@/redux';
import stylesDragDropItems from '../../components/DragDrop/DragDropItems.module.scss';
import ModalWrapper from '../Modal/ModalWrapper';
import DeleteModal from '../../ModalsMain/DeleteModal';
import { IconEdit, IconTrash } from '../Icons';
import { useVideoHover } from '../VideoCard/useVideoHover';

const ShortCard = ({
   setShortsOpen,
   data,
   onlyImage = false,
   classNameImage = '',
   contentVisible = true,
   variant = 'default',
   controlsAdmin = false,
   deleteCard = () => {},
   edit,
   shouldPlayOnHover = false,
}) => {
   const userIsAdmin = useSelector(getUserIsAdmin);
   const [isDeleteVideoModal, setIsDeleteVideoModal] = useState(false);
   const { isPlaying, handleMouseEnter, handleMouseLeave, videoRef, isFirstHover } = useVideoHover(shouldPlayOnHover);

   if (isEmptyArrObj(data)) return;

   const videoSrc = `${BASE_URL}${data.video_url}`;

   const userData = data.author?.role === ROLE_ADMIN.id ? data.developer : data.author;

   return (
      <article className={styles.ShortCard} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
         {userIsAdmin && controlsAdmin && (
            <>
               {edit && (
                  <button
                     type="button"
                     className={`${stylesDragDropItems.DragDropImageIcon} ${styles.VideoCardControl} !z-20 top-3 right-14`}
                     onClick={() => edit(data)}>
                     <IconEdit width={15} height={15} className="stroke-blue stroke-[1.5px]" />
                  </button>
               )}

               <button
                  type="button"
                  className={`${stylesDragDropItems.DragDropImageIcon} ${styles.VideoCardControl} !z-20 top-3 right-3`}
                  onClick={() => setIsDeleteVideoModal(true)}>
                  <IconTrash width={15} height={15} className="fill-red" />
               </button>
            </>
         )}
         <div
            className={cn('ibg cursor-pointer', styles.ShortCardImage, classNameImage, shouldPlayOnHover && '!overflow-visible')}
            onClick={setShortsOpen}>
            <img
               src={data.image_url ? getSrcImage(data.image_url) : `${BASE_URL}/api/video/${data.id}/preview/0`}
               loading="lazy"
               width="212"
               height="365"
               alt=""
            />
            {(!isFirstHover || isPlaying) && (
               <video
                  ref={videoRef}
                  src={videoSrc}
                  muted
                  className={cn(
                     'w-full h-full object-cover absolute inset-0 z-[999] rounded-xl',
                     !isPlaying ? 'opacity-0 scale-0' : 'opacity-100 scale-[115%]'
                  )}
                  style={{ transition: 'all 0.1s ease-in-out' }}
                  preload="none"
                  playsInline
               />
            )}

            {Boolean(!onlyImage && userData) && (
               <UserInfo
                  classListName={`!text-white ${variant === 'small' ? 'text-verySmall' : 'text-[12px]'}`}
                  className="absolute bottom-2 left-2 z-10 max-w-[93%]"
                  avatar={userData.avatar_url || userData.image}
                  name={capitalizeWords(userData.name, userData.surname)}
                  pos={userData.pos || 'Менеджер отдела продаж'}
                  centered
                  sizeAvatar={26}
                  classListUser="!text-white"
               />
            )}
         </div>
         {!onlyImage && contentVisible && (
            <div className={styles.ShortCardContent}>
               {variant !== 'small' && Boolean(data.building_name) && (
                  <Link to={`${RoutesPath.building}${data.building_id}`} className={`font-medium blue-link text-small mb-2 !w-auto cut cut-1`}>
                     ЖК {data.building_name}
                  </Link>
               )}
               <h3 className={`title-3-5 cut cut-1 ${variant === 'small' ? 'title-4' : ''}`}>{data.name || 'Без названия'}</h3>
            </div>
         )}
         <ModalWrapper condition={isDeleteVideoModal}>
            <DeleteModal
               condition={isDeleteVideoModal}
               title={<>Вы действительно хотите удалить ?</>}
               set={setIsDeleteVideoModal}
               request={async () => {
                  await deleteCard({ id: data.id, url: data.video_url, building_id: data.building_id });
                  setIsDeleteVideoModal(false);
               }}
            />
         </ModalWrapper>
      </article>
   );
};

export default ShortCard;
