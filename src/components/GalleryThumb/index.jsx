import React, { useState, useRef, useEffect } from 'react';

import styles from './GalleryThumb.module.scss';
import { videoToggleControls } from '../GalleryPhoto';
import { GalleryRow } from '../GalleryRow';
import { getFilteredObject } from '../../helpers/objectMethods';
import isEmptyArrObj from '../../helpers/isEmptyArrObj';

const GalleryThumb = ({ sidebar, items = [], videosGallery = [], children }) => {
   const [visiblePagination, setVisiblePagination] = useState(true);
   const [isOpenModal, setIsOpenModal] = useState(false);

   const newGallery = [
      getFilteredObject(videosGallery.length, {
         title: 'Видео',
         videos: videosGallery,
         id: 99,
         type: 'videos',
      }),
      ...items.map((item, index) => {
         return {
            title: item.title,
            images: item.images,
            id: index,
            type: 'images',
         };
      }),
   ].filter(item => !isEmptyArrObj(item));

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
                  videosData={videosGallery}
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
