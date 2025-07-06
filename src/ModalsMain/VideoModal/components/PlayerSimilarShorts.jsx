import React, { useRef, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import ShortCard from '../../../ui/ShortCard';
import { ShortsModal } from '..';

const PlayerSimilarShorts = ({ data, player }) => {
   const [shortsModal, setShortsModal] = useState(false);
   return (
      <>
         {Boolean(data.length) && (
            <div>
               <h3 className="title-3 mb-2">Клипы этого ЖК</h3>
               <Swiper
                  modules={[Navigation]}
                  slidesPerView={2.2}
                  navigation={{
                     prevEl: '.slider-btn-prev',
                     nextEl: '.slider-btn-next',
                  }}
                  spaceBetween={12}
                  className="w-full min-h-max"
                  breakpoints={{
                     799: {
                        slidesPerView: 4,
                        spaceBetween: 16,
                     },
                     1222: {
                        slidesPerView: 2.2,
                        spaceBetween: 16,
                     },
                  }}>
                  {data.map(item => {
                     return (
                        <SwiperSlide key={item.id}>
                           <ShortCard
                              data={item}
                              key={item.id}
                              setShortsOpen={() => {
                                 setShortsModal(item.id);

                                 if (player) {
                                    player.pause();
                                 }
                              }}
                              onlyImage
                           />
                        </SwiperSlide>
                     );
                  })}
               </Swiper>

               <ShortsModal
                  condition={shortsModal !== false}
                  set={setShortsModal}
                  data={data}
                  startData={data.find(item => item.id === shortsModal)}
                  startIndex={data.findIndex(item => item.id === shortsModal)}
               />
            </div>
         )}
      </>
   );
};

export default PlayerSimilarShorts;
