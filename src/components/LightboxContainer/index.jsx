import React, { memo, useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';

import AdaptiveVideoPlayer from '../../ModalsMain/VideoModal/AdaptiveVideoPlayer';
import { BASE_URL } from '../../constants/api';

import ModalWrapper from '../../ui/Modal/ModalWrapper';
import Modal from '../../ui/Modal';
import { NavBtnNext, NavBtnPrev } from '../../ui/NavBtns';
import { useSelector } from 'react-redux';
import { getIsDesktop } from '@/redux';
import { videoToggleControls } from '../GalleryPhoto';

const LightboxContainer = ({ data, index, setIndex }) => {
   const isDesktop = useSelector(getIsDesktop);

   const containerRef = useRef(null);
   const swiperRef = useRef(null);

   const onSlideChangeHandler = swiper => {
      setTimeout(() => {
         videoToggleControls(swiper, 'auto');
      }, 1);
   };

   return (
      <ModalWrapper condition={index}>
         <Modal
            closeBtn={isDesktop}
            closeBtnWhite
            condition={index}
            set={setIndex}
            options={{
               overlayClassNames: '_full',
               modalContentClassNames: '!p-0 !px-0 bg-[#0e1319]',
            }}>
            <div className="w-full mmd1:h-full" ref={containerRef}>
               {!isDesktop && (
                  <div className="bg-[rgba(70,70,70,0.55)] absolute top-0 left-0 w-full px-3 py-4 flex justify-end">
                     <button className="text-white text-right" onClick={() => setIndex(false)}>
                        Закрыть
                     </button>
                  </div>
               )}
               <Swiper
                  className="md1:mt-[50px]"
                  ref={swiperRef}
                  modules={[Navigation]}
                  slidesPerView={1}
                  navigation={{
                     prevEl: '.slider-btn-prev',
                     nextEl: '.slider-btn-next',
                  }}
                  onInit={swiper => {
                     const activeIndex = data.findIndex(item => item.index === index);
                     if (swiper.activeIndex === activeIndex) {
                        onSlideChangeHandler(swiper);
                     }
                     swiper.slideTo(activeIndex, 0);
                  }}
                  noSwiping
                  noSwipingSelector=".vjs-control"
                  allowTouchMove={true}
                  preventClicks={false}
                  preventClicksPropagation={false}
                  onSlideChange={onSlideChangeHandler}
                  spaceBetween={16}>
                  {data.map(item => {
                     if (item.type === 'image') {
                        return (
                           <SwiperSlide
                              key={item.index}
                              className="w-full"
                              style={{
                                 height: isDesktop ? 'var(--vh)' : 'calc(var(--vh) - 52px)',
                              }}>
                              <div className="w-full flex justify-center h-full">
                                 <img src={item.src} className="h-full object-contain" id={item.index} />
                              </div>
                           </SwiperSlide>
                        );
                     }
                     if (item.type === 'video') {
                        return (
                           <SwiperSlide
                              key={item.index}
                              className="w-full"
                              style={{
                                 height: isDesktop ? 'var(--vh)' : 'calc(var(--vh) - 52px)',
                              }}>
                              <div className="w-full flex justify-center h-full">
                                 <AdaptiveVideoPlayer src={`${BASE_URL}${item.url}`} id={item.index} />
                              </div>
                           </SwiperSlide>
                        );
                     }
                  })}
                  <NavBtnPrev centery="true" className="slider-btn-prev" disabled />
                  <NavBtnNext centery="true" className="slider-btn-next" />
               </Swiper>
            </div>
         </Modal>
      </ModalWrapper>
   );
};

export default memo(LightboxContainer);
