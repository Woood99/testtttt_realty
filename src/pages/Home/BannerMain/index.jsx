import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';

import Button from '../../../uiForm/Button';

import styles from './BannerMain.module.scss';
import { NavBtnPrev, NavBtnNext } from '../../../ui/NavBtns';
import getSrcImage from '../../../helpers/getSrcImage';
import { RoutesPath } from '../../../constants/RoutesPath';

export const BannerSliderMain = ({ data }) => {
   if (!data?.length) return;

   return (
      <section>
         <div className="container-desktop">
            <div className="min-w-0">
               <Swiper
                  modules={[Navigation, Pagination, Autoplay]}
                  slidesPerView={1}
                  pagination={{ clickable: true }}
                  navigation={{
                     prevEl: '.slider-btn-prev',
                     nextEl: '.slider-btn-next',
                  }}
                  watchSlidesProgress={true}
                  spaceBetween={24}
                  autoplay={{
                     delay: 7000,
                     disableOnInteraction: false,
                  }}
                  className={`${styles.slider} h-[420px] swiper-progress-autoplay`}>
                  {data.map((item, index) => {
                     return (
                        <SwiperSlide key={index}>
                           <BannerMain data={item} />
                        </SwiperSlide>
                     );
                  })}
                  <NavBtnPrev centery="true" disabled className="slider-btn-prev" />
                  <NavBtnNext centery="true" className="slider-btn-next" />
               </Swiper>
            </div>
         </div>
      </section>
   );
};

export const BannerMain = ({ data }) => {
   return (
      <div className={styles.BannerMainRoot} style={{ backgroundImage: `url(${getSrcImage(data.banner_image || data.image)})` }}>
         <a href={`${RoutesPath.promo}${data.id}?visibleComplex=1`} className={styles.BannerMainWrapper}>
            <div className={styles.BannerMainContent}>
               <div className="max-w-[300px]">
                  <h2 className="title-2 !text-white">{data.name}</h2>
               </div>
               <Button Selector="div" variant="secondary" size="Small" className={styles.BannerMainButton}>
                  Подробнее
               </Button>
            </div>
         </a>
      </div>
   );
};
