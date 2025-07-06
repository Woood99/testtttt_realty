import React, { useContext } from 'react';
import cn from 'classnames';

import getSrcImage from '../../../../../helpers/getSrcImage';
import { ChatMessageContext } from '../../../../../context';
import PhotoAlbumContainer from '../../../../PhotoAlbumContainer';

const ChatMessagePhotos = () => {
   const { setGalleryCurrentIndex, photos } = useContext(ChatMessageContext);

   if (!photos?.length) return;

   const params = {
      photos: photos.map(item => ({
         index: item.index,
         type: 'image',
         src: getSrcImage(item.url),
         width: item.width,
         height: item.height,
         ratio: item.width / item.height,
      })),
      layout: 'rows',
      spacing: 5,
      padding: 0,
      targetRowHeight: 150,
      render: {
         image: props => {
            return <img {...props} className={cn(props.className, 'rounded-xl')} />;
         },
      },
      onClick: index => setGalleryCurrentIndex(index),
   };

   return (
      <div data-chat-tooltip className={cn(params.photos.length === 1 && params.photos[0].ratio && params.photos[0].ratio < 0.7 && 'max-w-[205px]')}>
         <PhotoAlbumContainer {...params} />
      </div>
   );
};

export default ChatMessagePhotos;
