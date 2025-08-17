import React, { memo, useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import cn from 'classnames';

import styles from './VideoCard.module.scss';
import isEmptyArrObj from '../../helpers/isEmptyArrObj';
import { IconEdit, IconTrash } from '../Icons';

import stylesDragDropItems from '../../components/DragDrop/DragDropItems.module.scss';
import UserInfo from '../UserInfo';
import { capitalizeWords } from '../../helpers/changeString';
import { BASE_URL } from '../../constants/api';
import { RoutesPath } from '../../constants/RoutesPath';
import getSrcImage from '../../helpers/getSrcImage';
import { ROLE_ADMIN } from '../../constants/roles';
import { VideoPlayer } from '../../ModalsMain/VideoModal';
import { BlockDescrMore } from '../../components/BlockDescr/BlockDescr';
import { getUserIsAdmin } from '@/redux';
import ModalWrapper from '../Modal/ModalWrapper';
import DeleteModal from '../../ModalsMain/DeleteModal';
import { useVideoHover } from './useVideoHover';

const VideoCard = ({
   data,
   developer = {},
   variant = '',
   userVisible = false,
   edit,
   deleteCard = () => {},
   className = '',
   visibleComplex = true,
   playerIn = false,
   userTop = false,
   playerInVisibleControls = true,
   controlsAdmin = false,
   visibleContent = true,
   shouldPlayOnHover = false,
   widthImage,
   heightImage,
}) => {
   const userIsAdmin = useSelector(getUserIsAdmin);
   const [isDeleteVideoModal, setIsDeleteVideoModal] = useState(false);
   const videoSrc = `${BASE_URL}${data.video_url}`;
   const { isPlaying, handleMouseEnter, handleMouseLeave, videoRef, isFirstHover } = useVideoHover(shouldPlayOnHover);

   const classVariant = () => {
      switch (variant) {
         case '':
            return '';
         case 'shadow':
            return styles.VideoCardShadow;
         case 'row':
            return styles.VideoCardRow;
         case 'text-white':
            return styles.VideoCardWhiteText;
         default:
            return '';
      }
   };

   const currentAuthor = data.author || data.developer || developer;
   const userData = currentAuthor.role === ROLE_ADMIN.id ? data.developer || developer : currentAuthor;

   const link = `${RoutesPath.videosPage.videoPage}${data.id}`;

   if (!data || isEmptyArrObj(data)) return;

   return (
      <article className={cn(styles.VideoCard, classVariant, className)} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
         {Boolean(userTop) && Boolean(userVisible && userData) && (
            <UserInfo
               className="mb-3"
               avatar={userData.avatar_url || userData.image}
               name={capitalizeWords(userData.name, userData.surname)}
               pos={userData.pos || 'Менеджер отдела продаж'}
               centered
               classListName={`text-[12px]`}
               sizeAvatar={32}
            />
         )}
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
         {playerIn ? (
            <div className="w-full h-full">
               <VideoPlayer
                  data={{
                     video_url: data.video_url,
                     id: data.id,
                  }}
                  variant="default"
                  autoplay={false}
                  visibleControls={playerInVisibleControls}
               />
            </div>
         ) : (
            <Link
               to={link}
               className={cn('ibg cursor-pointer', styles.VideoCardImage, shouldPlayOnHover && '!overflow-visible')}
               target={variant !== 'row' && variant !== 'text-white' ? '_blank' : ''}>
               <img
                  src={data.image_url ? getSrcImage(data.image_url) : `${BASE_URL}/api/video/${data.id}/preview/0`}
                  width={widthImage}
                  height={heightImage}
                  alt=""
               />
               {(!isFirstHover || isPlaying) && (
                  <video
                     ref={videoRef}
                     src={videoSrc}
                     muted
                     className={cn(
                        'w-full h-full object-cover absolute inset-0 z-[999] rounded-xl',
                        !isPlaying ? 'opacity-0 scale-0' : 'opacity-100 scale-[115%]',
                     )}
                     style={{ transition: 'all 0.1s ease-in-out' }}
                     preload="none"
                     playsInline
                  />
               )}

               {Boolean(!userTop) && Boolean(userVisible && userData) && (
                  <UserInfo
                     className="absolute bottom-2 left-2 z-10 max-w-[93%]"
                     avatar={userData.avatar_url || userData.image}
                     name={capitalizeWords(userData.name, userData.surname)}
                     pos={userData.pos || 'Менеджер отдела продаж'}
                     centered
                     classListName={`text-[12px] !text-white`}
                     sizeAvatar={26}
                     classListUser="!text-white"
                  />
               )}
            </Link>
         )}

         {visibleContent && (
            <div className={styles.VideoCardContent}>
               {Boolean(data.building_name && visibleComplex) && (
                  <Link
                     to={`${RoutesPath.building}${data.building_id}`}
                     className={`font-medium mb-2 blue-link text-small ${variant === 'text-white' ? 'text-white' : ''}`}>
                     ЖК {data.building_name}
                  </Link>
               )}
               {userTop ? (
                  <BlockDescrMore descr={data.name || 'Без названия'} lines={2} className="cut-2-imp" />
               ) : (
                  <Link to={link} className={`cut cut-1 ${variant === 'text-white' ? 'title-4 !text-white mt-0' : 'title-3-5'}`}>
                     {data.name || 'Без названия'}
                  </Link>
               )}
            </div>
         )}

         <ModalWrapper condition={isDeleteVideoModal}>
            <DeleteModal
               condition={isDeleteVideoModal}
               title={<>Вы действительно хотите удалить ?</>}
               set={setIsDeleteVideoModal}
               request={async () => {
                  await deleteCard({ id: data.id, url: data.video_url });
                  setIsDeleteVideoModal(false);
               }}
            />
         </ModalWrapper>
      </article>
   );
};

export default memo(VideoCard);
