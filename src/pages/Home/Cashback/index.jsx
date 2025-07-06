import React, { useContext } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';

import TitleIcon from '../TitleIcon';
import { IconFire } from '../../../ui/Icons';

import CardPrimary from '../../../ui/CardPrimary';
import { NavBtnNext, NavBtnPrev } from '../../../ui/NavBtns';

import { RoutesPath } from '../../../constants/RoutesPath';
import { HomeContext } from '..';
import CashbackBanner from './CashbackBanner';
import { useSelector } from 'react-redux';
import { getIsDesktop } from '../../../redux/helpers/selectors';

const Cashback = () => {
   const { cashbackCards } = useContext(HomeContext);
   const isDesktop = useSelector(getIsDesktop);

   if (!cashbackCards.data.length) return;
   
   return (
      <section className="mt-3">
         <div className="container-desktop">
            <div className="white-block">
               <TitleIcon
                  icon={<IconFire width={24} height={24} />}
                  text="Повышенный кешбэк"
                  link={{ href: `${RoutesPath.listing}?home=1`, name: 'Смотреть всё' }}
               />

               <Swiper
                  modules={[Navigation]}
                  slidesPerView={cashbackCards.data.length > 1 ? 1.05 : 1}
                  navigation={{
                     prevEl: '.slider-btn-prev',
                     nextEl: '.slider-btn-next',
                  }}
                  spaceBetween={16}
                  breakpoints={{
                     799: {
                        slidesPerView: 2,
                        spaceBetween: 24,
                     },
                     1222: {
                        slidesPerView: 3,
                        spaceBetween: 24,
                     },
                  }}
                  className="md1:px-4 md1:-mx-4">
                  {cashbackCards.data.map((item, index) => {
                     return (
                        <SwiperSlide key={index}>
                           <CardPrimary {...item} className="h-full" />
                        </SwiperSlide>
                     );
                  })}
                  {isDesktop && (
                     <>
                        <NavBtnPrev disabled className="slider-btn-prev !absolute top-[95px] left-4" />
                        <NavBtnNext className="slider-btn-next !absolute top-[95px] right-4" />
                     </>
                  )}
               </Swiper>
            </div>
            <CashbackBanner />
         </div>
      </section>
   );
};

export default Cashback;
