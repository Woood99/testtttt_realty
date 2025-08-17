import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import cn from 'classnames';

import { ROLE_ADMIN } from '../../constants/roles';
import getSrcImage from '../../helpers/getSrcImage';
import Modal from '../../ui/Modal';
import { IconClose } from '../../ui/Icons';
import { NavBtnNext, NavBtnPrev } from '../../ui/NavBtns';
import { Link } from 'react-router-dom';
import { RoutesPath } from '../../constants/RoutesPath';
import UserInfo from '../../ui/UserInfo';
import { capitalizeWords } from '../../helpers/changeString';
import { useStoriesModal } from './useStoriesModal';
import { ShortPlayer } from '../../ui/ShortPlayer';

const StoriesModal = ({ data = [], currentId, set }) => {
   const { activeIndex, onSlideChange, handlePrev, handleNext, init, swiperRef } = useStoriesModal(currentId);

   return (
      <div>
         <Modal
            condition={currentId}
            set={set}
            ModalChildren={() => {
               return (
                  <>
                     <button onClick={() => set(false)} className="modal-close">
                        <IconClose width={35} height={35} className="fill-white" />
                     </button>
                     <div className="!absolute top-1/2 -translate-y-1/2 left-[32px]">
                        <NavBtnPrev
                           onClick={handlePrev}
                           disabled={activeIndex === 0}
                           className="!w-[52px] !h-[52px] slider-btn-prev"
                           classnameicon="w-[28px] h-[28px]"
                        />
                     </div>
                     <div className="!absolute top-1/2 -translate-y-1/2 right-[32px]">
                        <NavBtnNext
                           onClick={handleNext}
                           disabled={activeIndex === swiperRef.current?.swiper?.slides.length - 1}
                           className="!w-[52px] !h-[52px] slider-btn-prev"
                           classnameicon="w-[28px] h-[28px]"
                        />
                     </div>
                  </>
               );
            }}
            options={{
               overlayClassNames: '',
               modalClassNames: '!shadow-none bg-transparent-imp !w-[100vw]',
               modalContentClassNames: '!p-0 flex items-center video-player shorts-player-controls',
            }}>
            <Swiper
               ref={swiperRef}
               modules={[Navigation]}
               centeredSlides={true}
               slidesPerView="auto"
               allowTouchMove={true}
               observeParents={true}
               observer={true}
               preventClicks
               slideToClickedSlide
               preventClicksPropagation
               noSwiping
               noSwipingSelector=".vjs-control"
               onSlideChange={onSlideChange}
               onInit={swiper => {
                  swiper.slideTo(currentId - 1, 0);
                  onSlideChange(swiper);
               }}
               className="max-w-[1200px] max-h-[800px] h-full w-full"
               wrapperClass="!items-center"
               spaceBetween={16}>
               {data.map((item, index) => {
                  const userData = item.type === 'promo' ? item.user : item.author?.role === ROLE_ADMIN.id ? item.developer : item.author;
                  return (
                     <SwiperSlide
                        key={item.id}
                        onClick={() => set(index + 1)}
                        className={cn(
                           'flex justify-center !w-[422px] !h-[750px]',
                           init && 'transition',
                           activeIndex === index ? '' : 'bg-overlay rounded-xl overflow-hidden'
                        )}>
                        {item.type === 'short' ? (
                           <ShortPlayer data={item} currentId={item.id} classNamePlayer="w-full h-full" />
                        ) : (
                           <div className="bg-[#b5bbed] rounded-xl ">
                              <img src={getSrcImage(item.image)} className="w-full h-full object-contain" alt={`Story ${item.id}`} />

                              <div className="absolute top-4 left-4 flex items-center gap-4">
                                 <UserInfo
                                    avatar={userData.image}
                                    name={capitalizeWords(userData.name, userData.surname)}
                                    pos={`${
                                       item.author && item.author.role !== ROLE_ADMIN.id
                                          ? `Менеджер отдела продаж ${item.developer.name}`
                                          : 'Застройщик'
                                    }`}
                                    classListUser="!text-white"
                                    className="!text-white"
                                    centered
                                    nameHref={`${
                                       item.author && item.author.role !== ROLE_ADMIN.id
                                          ? `${RoutesPath.specialists.inner}`
                                          : `${RoutesPath.developers.inner}`
                                    }${userData.id}`}
                                 />
                              </div>
                              <div className="absolute w-[94%] z-30 bottom-[20px] left-4">
                                 <Link to={`${RoutesPath.building}${item.id}`} className="blue-link-hover mb-1.5 text-white">
                                    {item.title}
                                 </Link>
                                 <h3 className="text-default overflow-hidden cut cut-1 font-medium !text-white">{item.name}</h3>
                              </div>
                           </div>
                        )}
                     </SwiperSlide>
                  );
               })}
            </Swiper>
         </Modal>
      </div>
   );
};

export default StoriesModal;
