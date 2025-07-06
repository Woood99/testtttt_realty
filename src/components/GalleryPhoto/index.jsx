import React, { useEffect, useRef, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectFade, Navigation } from 'swiper/modules';

import styles from './GalleryPhoto.module.scss';
import { NavBtnNext, NavBtnPrev } from '../../ui/NavBtns';
import SliderPagination from '../../ui/SliderPagination';
import GalleryModal from '../../ModalsMain/GalleryModal';
import getSrcImage from '../../helpers/getSrcImage';
import ModalWrapper from '../../ui/Modal/ModalWrapper';
import { useSelector } from 'react-redux';
import { VideoBlock } from '../../ModalsMain/VideoModal';
import videojs from 'video.js';
import FullscreenBtn from '../../ui/FullscreenBtn';
import { GetDescrHTML } from '../BlockDescr/BlockDescr';
import { getIsDesktop } from '../../redux/helpers/selectors';

export const videoToggleControls = (swiperEl, status = 'auto', set=()=>{}) => {
   const slides = swiperEl.slides;
   const currentEl = slides[swiperEl.activeIndex];

   slides.forEach((item, index) => {
      const videoElement = item.querySelector('video');

      const player = videoElement ? videojs.getPlayer(videoElement.id) : null;
   
      if (player) {
            
         if (status === 'auto') {
            if (swiperEl.activeIndex === index) {
               player.volume(localStorage.getItem('video_volume') || 0.5);
               setTimeout(() => {
                  player.play();
               }, 300);
            } else {
               if (!player.paused()) {
                  player.pause();
               }
            }
         }
         if (status === 'off') {
            player.pause();
         }
      }
   });

   if (currentEl && currentEl.querySelector('video')) {
      set(false);
   } else {
      set(true);
   }
};

export const GalleryPhoto = ({ data, containerClassName = '', variant = 'default', allData = [], sidebar, descrVisible = true }) => {
   const isDesktop = useSelector(getIsDesktop);
   const { price, distance } = data;
   const currentTag = price || distance || null;
   const [activeSlideIndex, setActiveSlideIndex] = useState(0);
   const [isOpenModal, setIsOpenModal] = useState(false);

   const swiperRef = useRef(null);

   const [visiblePagination, setVisiblePagination] = useState(true);

   const onSlideChangeHandler = e => {
      const swiperEl = swiperRef.current.swiper;

      setActiveSlideIndex(e.activeIndex);
      videoToggleControls(swiperEl, 'auto', setVisiblePagination);
   };

   useEffect(() => {
      if (!swiperRef.current) return;
      videoToggleControls(swiperRef.current.swiper, 'off', setVisiblePagination);
   }, []);

   return (
      <>
         <Swiper
            ref={swiperRef}
            slidesPerView={1}
            modules={[Navigation, EffectFade]}
            effect="fade"
            navigation={{
               prevEl: '.slider-btn-prev',
               nextEl: '.slider-btn-next',
            }}
            noSwiping
            noSwipingSelector=".vjs-control"
            allowTouchMove={true}
            preventClicks={false}
            preventClicksPropagation={false}
            onSlideChange={onSlideChangeHandler}
            className={`${styles.GalleryPhotoImages} ${containerClassName} cursor-pointer`}>
            {(data.images || data.videos).map((item, index) => {
               if (data.images) {
                  return (
                     <SwiperSlide key={index}>
                        <img src={getSrcImage(item)} className={styles.GalleryPhotoImage} alt="" />
                     </SwiperSlide>
                  );
               }
               if (data.videos) {
                  return (
                     <SwiperSlide key={index}>
                        <VideoBlock data={item} className="w-full h-full rounded-xl overflow-hidden" />
                     </SwiperSlide>
                  );
               }
            })}

            {visiblePagination && <SliderPagination current={activeSlideIndex} total={data.images?.length || data.videos?.length} />}

            {isDesktop && (
               <>
                  <NavBtnPrev centery="true" disabled className="slider-btn-prev" />
                  <NavBtnNext centery="true" className="slider-btn-next" />
               </>
            )}
            {currentTag && <div className={styles.GalleryPhotoTag}>{currentTag} ₽</div>}
            {variant === 'modal' && (
               <FullscreenBtn
                  onClick={() => {
                     if (variant === 'modal') {
                        setIsOpenModal(true);
                        videoToggleControls(swiperRef.current.swiper, 'off', setVisiblePagination);
                     }
                  }}
               />
            )}
            <ModalWrapper condition={isOpenModal}>
               <GalleryModal condition={isOpenModal} set={setIsOpenModal} data={allData || data} sidebar={sidebar} />
            </ModalWrapper>
         </Swiper>
         {Boolean(descrVisible && data.description) && (
            <>
               <div className="mt-3 cut cut-4">
                  <GetDescrHTML data={data.description} />
               </div>
               <button type="button" className="blue-link mt-3" onClick={() => setIsOpenModal(true)}>
                  Подробнее
               </button>
            </>
         )}
      </>
   );
};

export default GalleryPhoto;
