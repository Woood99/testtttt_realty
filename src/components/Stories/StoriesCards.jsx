import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import cn from 'classnames';

import { NavBtnNext, NavBtnPrev } from '../../ui/NavBtns';
import { ROLE_ADMIN } from '../../constants/roles';
import getSrcImage from '../../helpers/getSrcImage';

const StoriesCards = ({ data = [], className = '', setStoriesOpenId = () => {} }) => {
   return (
      <Swiper
         modules={[Navigation]}
         slidesPerView={11}
         navigation={{
            prevEl: '.slider-btn-prev',
            nextEl: '.slider-btn-next',
         }}
         spaceBetween={16}
         className={className}>
         {data.map((item, index) => {
            const userData = item.type === 'promo' ? item.user : item.author?.role === ROLE_ADMIN.id ? item.developer : item.author;

            return (
               <SwiperSlide key={item.id} onClick={() => setStoriesOpenId(index + 1)}>
                  <div className="flex flex-col items-center cursor-pointer">
                     <img
                        src={getSrcImage(item.image || item.image_url)}
                        className={cn('rounded-full w-[90px] h-[90px]', 'border border-solid border-red')}
                        width={90}
                        height={90}
                     />
                     <p className="mt-2 cut cut-2 text-small">{userData?.name}</p>
                  </div>
               </SwiperSlide>
            );
         })}
         <NavBtnPrev disabled className="slider-btn-prev !absolute top-[95px] left-4" />
         <NavBtnNext className="slider-btn-next !absolute top-[95px] right-4" />
      </Swiper>
   );
};

export default StoriesCards;
