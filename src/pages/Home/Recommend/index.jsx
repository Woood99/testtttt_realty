import React, { useContext } from 'react';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';

import TitleIcon from '../TitleIcon';
import { IconStar } from '../../../ui/Icons';

import { NavBtnNext, NavBtnPrev } from '../../../ui/NavBtns';

import CardSecond from '../../../ui/CardSecond';
import { RoutesPath } from '../../../constants/RoutesPath';
import { HomeContext } from '..';
import CardPrimary from '../../../ui/CardPrimary';
import { useSelector } from 'react-redux';
import { getIsDesktop } from '../../../redux/helpers/selectors';

const Recommend = () => {
   const { recommendedCards } = useContext(HomeContext);
   const isDesktop = useSelector(getIsDesktop);

   if (!recommendedCards.data?.length) return;

   return (
      <>
         {/* {Boolean(recommendedCards.apartments.length) && (
            <section className="mt-3">
               <div className="container-desktop">
                  <div className="white-block">
                     <TitleIcon
                        icon={<IconStar width={24} height={24} />}
                        text="Определенно рекомендуем"
                        link={{
                           href: `${RoutesPath.listingFlats}?ids=1&${recommendedCards.apartments.map(item => `id=${item.id}`).join('&')}`,
                           name: 'Смотреть всё',
                        }}
                     />
                     <Swiper
                        modules={[Navigation]}
                        slidesPerView={recommendedCards.apartments.length > 1 ? 1.05 : 1}
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
                        {recommendedCards.apartments.map(item => {
                           return (
                              <SwiperSlide key={item.id}>
                                 <CardSecond {...item} />
                              </SwiperSlide>
                           );
                        })}
                        <NavBtnPrev disabled className="slider-btn-prev !absolute top-[95px] left-4" />
                        <NavBtnNext className="slider-btn-next !absolute top-[95px] right-4" />
                     </Swiper>
                  </div>
               </div>
            </section>
         )} */}
         {Boolean(recommendedCards.buildings.length) && (
            <section className="mt-3">
               <div className="container-desktop">
                  <div className="white-block">
                     <TitleIcon
                        icon={<IconStar width={24} height={24} />}
                        text="Скидки"
                        link={{
                           // href: `${RoutesPath.listingFlats}?ids=1&${recommendedCards.apartments.map(item => `id=${item.id}`).join('&')}`,
                           name: 'Смотреть всё',
                        }}
                     />
                     <Swiper
                        modules={[Navigation]}
                        slidesPerView={recommendedCards.buildings.length > 1 ? 1.05 : 1}
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
                        {recommendedCards.buildings.map(item => {
                           return (
                              <SwiperSlide key={item.id}>
                                 <CardPrimary {...item} />
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
               </div>
            </section>
         )}
      </>
   );
};

export default Recommend;
