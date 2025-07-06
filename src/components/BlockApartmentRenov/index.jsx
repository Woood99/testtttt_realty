import React, { useEffect, useState } from 'react';
import { getVideos } from '../../api/other/getVideos';
import { GalleryRowTabs } from '../GalleryRow';

const BlockApartmentRenov = ({ data, sidebar, videosData = [] }) => {
   const [isOpenModal, setIsOpenModal] = useState(false);
   const [currentData, setCurrentData] = useState(
      data.map((item, index) => {
         return {
            ...item,
            id: index,
            type: 'images',
         };
      })
   );

   useEffect(() => {
      if (videosData.length) {
         getVideos(videosData).then(res => {
            setCurrentData(prev => {
               return [
                  ...prev,
                  {
                     title: 'Видео',
                     videos: res,
                     type: 'videos',
                     id: 99,
                  },
               ];
            });
         });
      }
   }, []);

   return (
      <div className="white-block">
         <h2 className="title-2 mb-4">Отделка квартир</h2>
         <GalleryRowTabs
            data={currentData}
            videosData={videosData}
            sidebar={sidebar}
            isOpenModal={isOpenModal}
            setIsOpenModal={setIsOpenModal}
         />
      </div>
   );
};

export default BlockApartmentRenov;
