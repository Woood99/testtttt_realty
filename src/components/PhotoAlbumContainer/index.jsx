import React, { memo, useState } from 'react';
import PhotoAlbum from 'react-photo-album';

import 'react-photo-album/rows.css';

const PhotoAlbumContainer = params => {
   const { photos = [], layout = 'rows', spacing = 0, padding = 0, targetRowHeight = 150, render, onClick } = params;

   if (!photos?.length) return;

   return (
      <PhotoAlbum
         photos={photos}
         layout={layout}
         spacing={spacing}
         padding={padding}
         targetRowHeight={targetRowHeight}
         render={render}
         onClick={({ photo }) => {
            onClick?.(photo.index);
         }}
      />
   );
};

export default memo(PhotoAlbumContainer);
