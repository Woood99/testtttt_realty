import React, { useState } from 'react';
import { GalleryRowTabs } from '../GalleryRow';
import isEmptyArrObj from '../../helpers/isEmptyArrObj';
import { getFilteredObject } from '../../helpers/objectMethods';

const BlockApartmentRenov = ({ data, sidebar, videos = [] }) => {
   const [isOpenModal, setIsOpenModal] = useState(false);

   const currentData = [
      getFilteredObject(videos.length, {
         title: 'Видео',
         videos: videos,
         type: 'videos',
         id: 99,
      }),
      ...data.map((item, index) => {
         return {
            ...item,
            id: index,
            type: 'images',
         };
      }),
   ].filter(item => !isEmptyArrObj(item));

   return (
      <div className="white-block">
         <h2 className="title-2 mb-4">Отделка квартир</h2>
         <GalleryRowTabs data={currentData} videosData={videos} sidebar={sidebar} isOpenModal={isOpenModal} setIsOpenModal={setIsOpenModal} />
      </div>
   );
};

export default BlockApartmentRenov;
