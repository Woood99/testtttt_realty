import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Swiper, SwiperSlide } from 'swiper/react';
import cn from 'classnames';

import { ThumbPhoto } from '../../../ui/ThumbPhoto';
import getSrcImage from '../../../helpers/getSrcImage';
import { TagCashback } from '../../../ui/Tag';
import numberReplace from '../../../helpers/numberReplace';
import Button from '../../../uiForm/Button';
import { RoutesPath } from '../../../constants/RoutesPath';
import { IconArrowY, IconClose } from '../../../ui/Icons';
import getApartmentsPlayer from './getApartmentsPlayer';
import { getIsDesktop } from '../../../redux/helpers/selectors';
import RepeatContent from '../../../components/RepeatContent';
import WebSkeleton from '../../../ui/Skeleton/WebSkeleton';

export const ApartmentsCardsVertical = ({ options = {} }) => {
   const { params = {}, player, condition, set, showMoreUrl = '', className, title = '' } = options;
   const [cards, setCards] = useState({
      items: [],
      pages: 0,
      total: 0,
   });

   const [isLoading, setIsLoading] = useState(false);

   const isDesktop = useSelector(getIsDesktop);

   useEffect(() => {
      if (!condition) return;
      setIsLoading(true);
      getApartmentsPlayer(params).then(res => {
         setIsLoading(false);
         setCards(res);
      });
   }, [condition]);

   if (!condition) return;

   return (
      <>
         <div
            className={cn('overflow-hidden mmd1:bg-pageColor mmd1:rounded-xl video-player-sidebar-dynamic !opacity-100 !transform-none', className)}>
            {isDesktop && (
               <div className="mmd1:py-4 px-4 flex justify-between gap-4">
                  <h3 className="title-3">{title}</h3>
                  <button
                     onClick={() => {
                        set(false);
                     }}>
                     <IconClose />
                  </button>
               </div>
            )}
            <div className="mt-1 md1:mt-0 mmd1:pb-[100px] px-4 h-full">
               <div className="mmd1:overflow-y-auto mmd1:overflow-x-hidden scrollbarPrimaryNoVisible h-full pb-[35px] scrollbarPrimaryLeft">
                  <div className="flex flex-col">
                     {isLoading && (
                        <RepeatContent count={8}>
                           <div className="relative mb-4 pb-4 border-bottom-primary100 [&:last-child]:!mb-0 [&:last-child]:!pb-0 [&:last-child]:!border-none cursor-pointer flex gap-4 items-center">
                              <WebSkeleton className="w-[75px] h-[75px] rounded-xl" />
                              <div className="flex flex-col gap-2 flex-grow">
                                 <WebSkeleton className="w-full h-4 rounded-lg" />
                                 <WebSkeleton className="w-full h-4 rounded-lg" />
                                 <WebSkeleton className="w-full h-4 rounded-lg" />
                              </div>
                           </div>
                        </RepeatContent>
                     )}
                     {!isLoading &&
                        cards.items.map(item => {
                           return (
                              <a
                                 href={`${RoutesPath.apartment}${item.id}`}
                                 onClick={() => {
                                    if (player) {
                                       player.pause();
                                    }
                                 }}
                                 target="_blank"
                                 key={item.id}
                                 className="relative group mb-4 pb-4 border-bottom-primary100 [&:last-child]:!mb-0 [&:last-child]:!pb-0 [&:last-child]:!border-none cursor-pointer flex gap-4 items-center">
                                 <div className="flex gap-4 group-hover:translate-x-2 transition-all">
                                    <ThumbPhoto>
                                       <img src={getSrcImage(item.images[0])} width={60} height={60} alt="" />
                                    </ThumbPhoto>
                                    <div className="mt-2">
                                       <h3 className="title-4">{item.title}</h3>
                                       <h4 className="title-4 mt-2">{numberReplace(item.price)} ₽</h4>
                                       <div className="mt-2">
                                          {item.cashback ? <TagCashback cashback={(item.price / 100) * item.cashback} /> : ''}
                                       </div>
                                    </div>
                                 </div>
                                 <IconArrowY
                                    className="ml-auto fill-dark -rotate-90 group-hover:translate-x-1 transition-all"
                                    width={28}
                                    height={28}
                                 />
                              </a>
                           );
                        })}
                  </div>
               </div>
            </div>
            {isDesktop && (
               <div className="absolute bottom-4 left-0 px-4 z-[99] w-full">
                  <Button
                     className="w-full"
                     size="Small"
                     onClick={() => {
                        if (player) {
                           player.pause();
                        }
                        window.open(showMoreUrl);
                     }}>
                     Смотреть все квартиры
                  </Button>
               </div>
            )}
         </div>
         {!isDesktop && (
            <div className="absolute bottom-4 left-0 px-4 z-[99] w-full md1:bg-white md1:!bottom-0 md1:py-3">
               <Button
                  className="w-full"
                  size="Small"
                  onClick={() => {
                     if (player) {
                        player.pause();
                     }
                     window.open(showMoreUrl);
                  }}>
                  Смотреть все квартиры
               </Button>
            </div>
         )}
      </>
   );
};

export const ApartmentsCardsHorizontal = ({ options = {} }) => {
   const { params = {}, player, showMoreUrl = '', title } = options;
   const [cards, setCards] = useState({
      items: [],
      pages: 0,
      total: 0,
   });

   const [isLoading, setIsLoading] = useState(false);

   useEffect(() => {
      setIsLoading(true);

      getApartmentsPlayer(params).then(res => {
         setIsLoading(false);
         setCards(res);
      });
   }, []);

   return (
      <div className="white-block-small mt-3">
         <h3 className="title-3 mb-4">{title}</h3>
         <Swiper
            slidesPerView={1.2}
            spaceBetween={16}
            className="w-full"
            breakpoints={{
               799: {
                  slidesPerView: 2,
               },
               1222: {
                  slidesPerView: 3,
               },
            }}>
            {isLoading && (
               <>
                  <SwiperSlide>
                     <div className="relative flex gap-4 items-center">
                        <WebSkeleton className="w-[75px] h-[75px] rounded-xl" />
                        <div className="flex flex-col gap-2 flex-grow">
                           <WebSkeleton className="w-full h-4 rounded-lg" />
                           <WebSkeleton className="w-full h-4 rounded-lg" />
                           <WebSkeleton className="w-full h-4 rounded-lg" />
                        </div>
                     </div>
                  </SwiperSlide>
                  <SwiperSlide>
                     <div className="relative flex gap-4 items-center">
                        <WebSkeleton className="w-[75px] h-[75px] rounded-xl" />
                        <div className="flex flex-col gap-2 flex-grow">
                           <WebSkeleton className="w-full h-4 rounded-lg" />
                           <WebSkeleton className="w-full h-4 rounded-lg" />
                           <WebSkeleton className="w-full h-4 rounded-lg" />
                        </div>
                     </div>
                  </SwiperSlide>
                  <SwiperSlide>
                     <div className="relative flex gap-4 items-center">
                        <WebSkeleton className="w-[75px] h-[75px] rounded-xl" />
                        <div className="flex flex-col gap-2 flex-grow">
                           <WebSkeleton className="w-full h-4 rounded-lg" />
                           <WebSkeleton className="w-full h-4 rounded-lg" />
                           <WebSkeleton className="w-full h-4 rounded-lg" />
                        </div>
                     </div>
                  </SwiperSlide>
               </>
            )}
            {!isLoading &&
               cards.items.map(item => {
                  return (
                     <SwiperSlide key={item.id}>
                        <a
                           href={`${RoutesPath.apartment}${item.id}`}
                           onClick={() => {
                              if (player) {
                                 player.pause();
                              }
                           }}
                           target="_blank"
                           className="relative flex gap-4 items-center">
                           <div className="flex gap-4">
                              <ThumbPhoto>
                                 <img src={getSrcImage(item.images[0])} width={60} height={60} alt="" />
                              </ThumbPhoto>
                              <div className="mt-2">
                                 <h3 className="title-4">{item.title}</h3>
                                 <h4 className="title-4 mt-2">{numberReplace(item.price)} ₽</h4>
                                 <div className="mt-2">{item.cashback ? <TagCashback cashback={(item.price / 100) * item.cashback} /> : ''}</div>
                              </div>
                           </div>
                           <IconArrowY className="ml-auto fill-dark -rotate-90 group-hover:translate-x-1 transition-all" width={28} height={28} />
                        </a>
                     </SwiperSlide>
                  );
               })}
         </Swiper>
         <Button
            className="w-full mt-6 md1:mt-4"
            size="Small"
            onClick={() => {
               if (player) {
                  player.pause();
               }
               window.open(showMoreUrl);
            }}>
            Смотреть все квартиры
         </Button>
      </div>
   );
};
