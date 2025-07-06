import React, { useState, useRef, useEffect } from 'react';

import styles from './GalleryThumb.module.scss';
import { getVideos } from '../../api/other/getVideos';
import { videoToggleControls } from '../GalleryPhoto';
import { GalleryRow } from '../GalleryRow';

const GalleryThumb = ({ sidebar, items = [], videosGallery = [], children }) => {
   const [visiblePagination, setVisiblePagination] = useState(true);
   const [isOpenModal, setIsOpenModal] = useState(false);

   const [videosData, setVideosData] = useState([]);

   const [newGallery, setNewGallery] = useState(
      items?.map((item, index) => {
         return {
            title: item.title,
            images: item.images,
            id: index,
            type: 'images',
         };
      })
   );

   useEffect(() => {
      if (videosGallery.length) {
         getVideos(videosGallery).then(res => {
            setVideosData(res);
            setNewGallery(prev => [
               {
                  title: 'Видео',
                  videos: res,
                  id: 99,
                  type: 'videos',
               },
               ...prev,
            ]);
         });
      }
   }, []);

   const [activeThumbIndex, setActiveThumbIndex] = useState(0);

   const mainSwiperRef = useRef(null);
   const thumbsSwiperRef = useRef(null);

   const onSlideChangeHandler = (currentIndex = null) => {
      const swiperEl = mainSwiperRef.current.swiper;
      const currentEl = currentIndex ? swiperEl.slides[currentIndex] : swiperEl.slides[swiperEl.activeIndex];

      setActiveThumbIndex(+currentEl?.dataset.galleryGroupIndex || 1);

      videoToggleControls(swiperEl, 'auto', setVisiblePagination);
   };

   useEffect(() => {
      if (!thumbsSwiperRef.current) return;
      thumbsSwiperRef.current.swiper.slideTo(activeThumbIndex);
   }, [activeThumbIndex]);

   return (
      <>
         {Boolean(newGallery) && (
            <div className={styles.GalleryThumbRoot}>
               <GalleryRow
                  dataGallery={newGallery}
                  videosData={videosData}
                  swiperRef={mainSwiperRef}
                  onSlideChange={onSlideChangeHandler}
                  visiblePagination={visiblePagination}
                  setVisiblePagination={setVisiblePagination}
                  sidebar={sidebar}
                  isOpenModal={isOpenModal}
                  setIsOpenModal={setIsOpenModal}
                  galleryVariant="top"
               />
               {children}
            </div>
         )}
      </>
   );
};

export default GalleryThumb;
