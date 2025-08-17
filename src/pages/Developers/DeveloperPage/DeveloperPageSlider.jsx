import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import { DeveloperPageContext } from '../../../context';
import { useContext, useEffect, useState } from 'react';
import getCardsBuildings from '../../../api/getCardsBuildings';
import WebSkeleton from '../../../ui/Skeleton/WebSkeleton';
import { useSelector } from 'react-redux';
import { getIsDesktop } from '@/redux';
import { NavBtnNext, NavBtnPrev } from '../../../ui/NavBtns';
import getSrcImage from '../../../helpers/getSrcImage';
import findObjectWithMinValue from '../../../helpers/findObjectWithMinValue';
import numberReplace from '../../../helpers/numberReplace';
import { ExternalLink } from '../../../ui/ExternalLink';
import { RoutesPath } from '../../../constants/RoutesPath';

const DeveloperPageSlider = () => {
   const { data } = useContext(DeveloperPageContext);
   const [cards, setCards] = useState([]);
   const [isLoading, setIsLoading] = useState(true);
   const isDesktop = useSelector(getIsDesktop);

   useEffect(() => {
      const fetchData = async () => {
         setIsLoading(true);
         const { cards: result } = await getCardsBuildings({ visibleObjects: data.objects.slice(0, 5), page: 1, per_page: 5 });
         setCards(result);
         setIsLoading(false);
      };

      fetchData();
   }, []);

   if (cards.length === 0 && !isLoading) return;

   return (
      <div className="p-[10px] md1:p-0 bg-white shadow-primary mb-3 rounded-[20px]">
         <div className="min-w-0 w-full overflow-hidden rounded-[20px]">
            <Swiper
               modules={[Navigation]}
               slidesPerView="auto"
               observeParents
               observer
               navigation={{
                  prevEl: '.slider-btn-prev',
                  nextEl: '.slider-btn-next',
               }}
               spaceBetween={8}
               className="rounded-[20px] w-full overflow-visible"
               style={{ height: '380px' }}>
               {isLoading ? (
                  <>
                     <SwiperSlide className="w-3/5">
                        <WebSkeleton className="h-full w-full rounded-xl" />
                     </SwiperSlide>
                     <SwiperSlide className="w-2/5">
                        <WebSkeleton className="h-full w-full rounded-xl" />
                     </SwiperSlide>
                     <SwiperSlide className="w-2/3">
                        <WebSkeleton className="h-full w-full rounded-xl" />
                     </SwiperSlide>
                  </>
               ) : (
                  <>
                     {cards.map((item, index) => {
                        const minPrice = findObjectWithMinValue(item.apartments, 'price')?.price.toString() || 0;

                        return (
                           <SwiperSlide key={index} className="h-full w-auto flex-center-all flex-grow flex-shrink-0 basis-auto max-w-full">
                              <ExternalLink to={`${RoutesPath.building}${item.id}`} className="w-full h-full">
                                 <div className="flex flex-col h-full">
                                    <div className="absolute top-4 left-4">
                                       <div className="bg-[#242629a3] rounded-full py-2.5 px-3 text-white text-small">
                                          {item.title}, от {numberReplace(minPrice)} ₽
                                       </div>
                                    </div>
                                    <img src={getSrcImage(item.images[0])} alt="" className="h-full max-h-full max-w-full rounded-[20px]" />
                                 </div>
                              </ExternalLink>
                           </SwiperSlide>
                        );
                     })}
                  </>
               )}
               {isDesktop && (
                  <div className="absolute bottom-4 right-4 flex items-center gap-2">
                     <NavBtnPrev disabled className="slider-btn-prev" />
                     <NavBtnNext className="slider-btn-next" />
                  </div>
               )}
            </Swiper>
         </div>
      </div>
   );
};

export default DeveloperPageSlider;
