import { useEffect, useRef, useState } from 'react';
import { videoToggleControls } from '../GalleryPhoto';

export const useStoriesModal = (currentId = 1) => {
   const [activeIndex, setActiveIndex] = useState(currentId);
   const swiperRef = useRef(null);
   const [init, setInit] = useState(false);

   const onSlideChange = swiper => {
      const swiperEl = swiperRef.current.swiper;
      setActiveIndex(swiper.realIndex);

      swiper.slides.forEach(slide => {
         slide.style.transform = 'scale(0.75)'; // Сбрасываем трансформации
      });

      const activeSlide = swiper.slides[swiper.activeIndex];
      activeSlide.style.transform = 'scale(1)';

      const prevSlide = swiper.slides[swiper.activeIndex - 1];
      const nextSlide = swiper.slides[swiper.activeIndex + 1];

      if (prevSlide) {
         prevSlide.style.transform = 'scale(0.75) translateX(15%)'; // Сдвигаем предыдущий слайд
      }
      if (nextSlide) {
         nextSlide.style.transform = 'scale(0.75) translateX(-15%)'; // Сдвигаем следующий слайд
      }
      setTimeout(() => {
         videoToggleControls(swiperEl, 'auto');
      }, 50);
   };

   const handlePrev = () => {
      if (swiperRef.current && swiperRef.current.swiper) {
         swiperRef.current.swiper.slidePrev();
      }
   };

   const handleNext = () => {
      if (swiperRef.current && swiperRef.current.swiper) {
         swiperRef.current.swiper.slideNext();
      }
   };

   useEffect(() => {
      setTimeout(() => {
         setInit(true);
      }, 100);
   }, []);

   return { activeIndex, onSlideChange, handlePrev, handleNext, init, swiperRef };
};
