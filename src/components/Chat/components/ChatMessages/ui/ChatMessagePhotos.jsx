import React, { useContext } from 'react';
import cn from 'classnames';

import getSrcImage from '../../../../../helpers/getSrcImage';
import { ChatMessageContext } from '../../../../../context';
import PhotoAlbumContainer from '../../../../PhotoAlbumContainer';
import { useSelector } from 'react-redux';
import { IconPlay } from '../../../../../ui/Icons';
import isEmptyArrObj from '../../../../../helpers/isEmptyArrObj';
import { getFilteredObject } from '../../../../../helpers/objectMethods';
import { getIsDesktop } from '@/redux';

const ChatMessagePhotos = () => {
   const { setGalleryCurrentIndex, photos, videoData, photosLength } = useContext(ChatMessageContext);
   const isDesktop = useSelector(getIsDesktop);

   if (!photos.length && !videoData) return;

   const params = {
      photos: [
         ...(photos || []).map(item => ({
            index: item.index,
            type: 'image',
            src: getSrcImage(item.url),
            width: item.width,
            height: item.height,
            ratio: item.width / item.height,
         })),
         getFilteredObject(Boolean(videoData && (photosLength)), {
            index: videoData?.index,
            type: 'video',
            src: getSrcImage(videoData?.preview),
            width: videoData?.width,
            height: videoData?.height,
            ratio: videoData?.width / videoData?.height,
         }),
      ].filter(item => !isEmptyArrObj(item)),
      layout: 'rows',
      spacing: 5,
      padding: 0,
      targetRowHeight: 150,
      render: {
         image: (props, info) => {
            return (
               <>
                  {info.photo.type === 'video' && (
                     <div className="pointer-events-none absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex items-center justify-center z-[9]">
                        <IconPlay className="fill-white" width={46} height={46} />
                     </div>
                  )}

                  <img {...props} className={cn(props.className, 'rounded-xl')} />
               </>
            );
         },
      },
      onClick: index => setGalleryCurrentIndex(index),
   };

   if (!params.photos.length) return;
   
   return (
      <div
         data-chat-tooltip
         className={cn(
            params.photos.length === 1 && params.photos[0].ratio && params.photos[0].ratio < 0.7 && (isDesktop ? 'max-w-[320px]' : 'max-w-[300px]')
         )}>
         <PhotoAlbumContainer {...params} />
      </div>
   );
};

export default ChatMessagePhotos;
