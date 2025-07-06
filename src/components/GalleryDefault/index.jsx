import React, { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';

import styles from './GalleryDefault.module.scss';
import SliderPagination from '../../ui/SliderPagination';
import { NavBtnNext, NavBtnPrev } from '../../ui/NavBtns';
import FullscreenBtn from '../../ui/FullscreenBtn';
import getSrcImage from '../../helpers/getSrcImage';

export const GalleryDefaultLayout = ({
   images = [],
   containerClassName = '',
   classNameRoot = '',
   onClickContainer = () => {},
   fullscreen = false,
   shadow = false,
   style = {},
   imageFit = 'contain',
   startIndex = 1,
}) => {
   const [activeSlideIndex, setActiveSlideIndex] = useState(startIndex - 1);

   const onSlideChangeHandler = e => {
      setActiveSlideIndex(e.activeIndex);
   };

   return (
      <div style={style} className={`${styles.GalleryDefaultRoot} ${classNameRoot} ${shadow ? styles.GalleryDefaultRootShadow : ''}`}>
         <Swiper
            slidesPerView={1}
            modules={[Navigation, Pagination]}
            navigation={{
               prevEl: '.slider-btn-prev',
               nextEl: '.slider-btn-next',
            }}
            onClick={onClickContainer}
            initialSlide={startIndex - 1}
            onSlideChange={onSlideChangeHandler}
            className={`${styles.GalleryDefaultImages} ${containerClassName} cursor-pointer gallery-target-modal`}>
            {images.map((image, index) => {
               return (
                  <SwiperSlide key={index}>
                     <img
                        src={getSrcImage(image)}
                        className={`${styles.GalleryDefaultImage} ${imageFit === 'cover' ? '!object-cover' : ''}`}
                        alt=""
                     />
                  </SwiperSlide>
               );
            })}

            <SliderPagination current={activeSlideIndex} total={images.length} />
            <NavBtnPrev centery="true" disabled className="slider-btn-prev" />
            <NavBtnNext centery="true" className="slider-btn-next" />

            {fullscreen && <FullscreenBtn onClick={onClickContainer} />}
         </Swiper>
      </div>
   );
};
