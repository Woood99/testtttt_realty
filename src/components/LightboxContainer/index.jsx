import React, { memo, useEffect, useRef, useState } from 'react';

import AdaptiveVideoPlayer from '../../ModalsMain/VideoModal/AdaptiveVideoPlayer';
import { BASE_URL } from '../../constants/api';

import ModalWrapper from '../../ui/Modal/ModalWrapper';
import Modal from '../../ui/Modal';
import { NavBtnNext, NavBtnPrev } from '../../ui/NavBtns';
import videojs from 'video.js';

const LightboxContainer = ({ data, index, setIndex }) => {
   const [slideIndex, setSlideIndex] = useState(index);

   const [isVisibleNavPrev, setIsVisibleNavPrev] = useState(data.length > 1);
   const [isVisibleNavNext, setIsVisibleNavNext] = useState(data.length > 1);
   const containerRef = useRef(null);

   useEffect(() => {
      if (!containerRef.current) return;
      if (!data.length) return;

      const currentSlideIndexByIndex = data.findIndex(item => item.index === slideIndex);

      const id = data[currentSlideIndexByIndex].index;
      const currentSlide = containerRef.current.querySelector(`[id="${id}"]`);

      if (currentSlideIndexByIndex > 0) {
         setIsVisibleNavPrev(true);
      } else {
         setIsVisibleNavPrev(false);
      }

      if (currentSlideIndexByIndex < data.length - 1) {
         setIsVisibleNavNext(true);
      } else {
         setIsVisibleNavNext(false);
      }

      if (currentSlide.classList.contains('video-player')) {
         const video = currentSlide.querySelector('video');
         if (video) {
            const player = videojs(video);
            if (player) {
               player.volume(localStorage.getItem('video_volume') || 0.2);
               setTimeout(() => {
                  player.play();
               }, 300);
            }
         }
      }
   }, [slideIndex]);

   return (
      <ModalWrapper condition={index}>
         <Modal
            condition={index}
            set={setIndex}
            options={{
               overlayClassNames: '_full',
               modalContentClassNames: '!p-0 !px-0 bg-[#0e1319]',
               modalCloseIconClassNames: '!fill-white',
            }}>
            <div className="flex flex-col items-center justify-center w-full h-full" ref={containerRef}>
               {isVisibleNavPrev && (
                  <NavBtnPrev
                     centery="true"
                     onClick={() => {
                        const prevIndex = data.findIndex(item => item.index === slideIndex) - 1;
                        if (!data[prevIndex]?.index) {
                           return;
                        }
                        setSlideIndex(data[prevIndex].index);
                     }}
                  />
               )}

               {data.map(item => {
                  if (item.type === 'image' && slideIndex === item.index) {
                     return <img key={item.index} src={item.src} className="h-full object-contain" id={item.index} />;
                  }
                  if (item.type === 'video' && slideIndex === item.index) {
                     return <AdaptiveVideoPlayer full key={item.index} src={`${BASE_URL}${item.url}`} id={item.index} />;
                  }
               })}
               {isVisibleNavNext && (
                  <NavBtnNext
                     centery="true"
                     onClick={() => {
                        const nextIndex = data.findIndex(item => item.index === slideIndex) + 1;
                        if (!data[nextIndex]?.index) {
                           return;
                        }
                        setSlideIndex(data[nextIndex].index);
                     }}
                  />
               )}
            </div>
         </Modal>
      </ModalWrapper>
   );
};

export default memo(LightboxContainer);
