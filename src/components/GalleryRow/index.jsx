import React, { useEffect, useRef, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import cn from 'classnames';
import styles from './GalleryRow.module.scss';
import { getPosterVideo, VideoBlock } from '../../ModalsMain/VideoModal';
import getSrcImage from '../../helpers/getSrcImage';
import { useSelector } from 'react-redux';
import { getIsDesktop, getWindowSize } from '../../redux/helpers/selectors';
import { NavBtnNext, NavBtnPrev } from '../../ui/NavBtns';
import SliderPagination from '../../ui/SliderPagination';
import FullscreenBtn from '../../ui/FullscreenBtn';
import { videoToggleControls } from '../GalleryPhoto';
import ModalWrapper from '../../ui/Modal/ModalWrapper';
import { TabsBody, TabsNav, TabsTitle } from '../../ui/Tabs';
import Modal from '../../ui/Modal';
import { GetDescrHTML } from '../BlockDescr/BlockDescr';
import { IconPlay, IconСamcorder } from '../../ui/Icons';
import isString from '../../helpers/isString';

export const GalleryRowLayout = ({ options }) => {
   const {
      swiperRef,
      dataGallery,
      onSlideChange,
      visiblePagination,
      setVisiblePagination,
      videosData,
      setIsOpenModal,
      galleryHeight = 420,
      fullscreen = true,
      imageFit = 'cover',
      mode = 'default',
      galleryVariant,
   } = options;

   const isDesktop = useSelector(getIsDesktop);
   const [activeSlideIndex, setActiveSlideIndex] = useState(0);

   const totalSlides = dataGallery?.reduce((acc, item) => {
      return (acc += item.images?.length || item.videos?.length || 0);
   }, 0);

   const totalSlidesData = dataGallery?.reduce((acc, item) => {
      const res = item.videos ? item.videos : item.images;
      return (acc = [...acc, ...res]);
   }, []);

   const onSlideChangeHandler = (currentIndex = null) => {
      const swiperEl = swiperRef.current.swiper;

      setActiveSlideIndex(currentIndex || swiperEl.activeIndex);
      if (!currentIndex) {
         onSlideChange(currentIndex);
      }
   };

   return (
      <Swiper
         slidesPerView="auto"
         modules={[Navigation]}
         navigation={{
            prevEl: '.slider-btn-prev',
            nextEl: '.slider-btn-next',
         }}
         spaceBetween={4}
         speed={500}
         noSwiping
         noSwipingSelector=".vjs-control"
         ref={swiperRef}
         onSlideChange={() => onSlideChangeHandler()}
         allowTouchMove={true}
         observeParents={true}
         observer={true}
         preventClicks
         preventClicksPropagation
         // preventClicks={false}
         // preventClicksPropagation={false}
         onReachEnd={swiper => {
            onSlideChangeHandler(swiper.activeIndex + 1);
         }}
         className="w-full cursor-pointer gallery-target-modal overflow-visible"
         style={{ height: galleryHeight }}>
         {totalSlidesData.map((galleryItem, galleryItemIndex) => {
            const currentGroupIndex = dataGallery.findIndex(i => (i.images || i.videos).find(k => k === galleryItem));

            if (isString(galleryItem)) {
               return (
                  <SwiperSlide
                     data-gallery-group-index={currentGroupIndex}
                     className={`${styles.GalleryRowSlide} ${mode === 'modal' ? styles.GalleryRowSlideFull : ''}`}
                     key={galleryItemIndex}>
                     <div
                        className="w-full h-full"
                        onClick={() => {
                           if (mode === 'default') {
                              setIsOpenModal(galleryItemIndex || true);
                           }
                        }}>
                        <div className="flex flex-col h-full">
                           <img
                              src={getSrcImage(galleryItem)}
                              alt=""
                              className={`${styles.GalleryRowImage} ${imageFit === 'contain' ? '!object-contain' : ''}   
                                 ${mode === 'modal' && isDesktop ? '!object-contain bg-dark' : ''}`}
                           />
                        </div>
                     </div>
                  </SwiperSlide>
               );
            } else {
               const currentVideo = videosData.find(item => item.id === galleryItem.id);
               return (
                  <SwiperSlide
                     data-gallery-group-index={currentGroupIndex}
                     className={`${styles.GalleryRowSlide} ${mode === 'modal' ? styles.GalleryRowSlideFull : ''}`}
                     key={galleryItemIndex}>
                     {mode === 'default' && (
                        <div
                           className="w-full h-full"
                           onClick={() => {
                              setIsOpenModal(galleryItemIndex || true);
                           }}>
                           <div className="flex flex-col h-full relative">
                              <img
                                 src={getPosterVideo(currentVideo)}
                                 className={`${styles.GalleryRowImage} ${imageFit === 'contain' ? '!object-contain' : ''}
                                    ${mode === 'modal' && isDesktop ? '!object-contain bg-dark' : ''}
                                    `}
                                 alt={currentVideo.name}
                              />
                              <div className={styles.GalleryRowVideoBadge}>
                                 <div className={styles.GalleryRowVideoBadgeCircle}>
                                    <IconPlay className="fill-dark" width={22} height={22} />
                                 </div>
                                 <span className="mt-2">Смотреть видео</span>
                              </div>
                           </div>
                        </div>
                     )}
                     {mode === 'modal' && <VideoBlock data={currentVideo} className={styles.GalleryRowVideo} />}
                  </SwiperSlide>
               );
            }
         })}
         {visiblePagination && (
            <SliderPagination current={activeSlideIndex} total={totalSlides} className={galleryVariant === 'top' ? 'md1:!bottom-10' : ''} />
         )}

         {isDesktop && (
            <>
               <NavBtnPrev centery="true" disabled className="slider-btn-prev" />
               <NavBtnNext centery="true" className="slider-btn-next" />
            </>
         )}
         {fullscreen && (
            <FullscreenBtn
               className="!top-auto bottom-4"
               onClick={() => {
                  videoToggleControls(swiperRef.current.swiper, 'off', setVisiblePagination);
                  setIsOpenModal(true);
               }}
            />
         )}
      </Swiper>
   );
};

export const GalleryRow = ({
   swiperRef,
   onSlideChange = () => {},
   dataGallery = [],
   visiblePagination = false,
   setVisiblePagination = () => {},
   videosData = [],
   galleryHeight = 420,
   isOpenModal = false,
   setIsOpenModal = () => {},
   imageFit = 'cover',
   tabsMobile = true,
   galleryVariant = 'default',
   galleryType = 'thumbs',
}) => {
   const options = {
      swiperRef,
      visiblePagination,
      setVisiblePagination,
      dataGallery,
      onSlideChange,
      videosData,
      isOpenModal,
      setIsOpenModal,
      galleryHeight,
      imageFit,
      tabsMobile,
   };
   
   return (
      <div className="min-w-0 w-full overflow-hidden rounded-[20px]">
         <GalleryRowLayout options={{ ...options, galleryVariant }} />
         <ModalWrapper condition={isOpenModal}>
            <Modal
               options={{ overlayClassNames: '_full', modalContentClassNames: '!p-8 !pt-0 md1:!px-0 bg-[#0e1319] flex flex-col items-center' }}
               closeBtnWhite
               set={setIsOpenModal}
               condition={isOpenModal}>
               <GalleryModal data={dataGallery} setIsOpenModal={setIsOpenModal} imageFit={imageFit} type={galleryType} />
            </Modal>
         </ModalWrapper>
      </div>
   );
};

export const GalleryRowTabs = ({
   data,
   videosData = [],
   sidebar,
   activeIndex = 0,
   mode = 'default',
   galleryHeight = 420,
   isOpenModal = false,
   setIsOpenModal = () => {},
   imageFit = 'cover',
   tabsMobile = true,
}) => {
   const [activeTabIndex, setActiveTabIndex] = useState(0);

   const swiperRef = useRef(null);

   const [visiblePagination, setVisiblePagination] = useState(true);

   const onSlideChangeHandler = e => {
      const swiperEl = swiperRef.current.swiper;
      const currentEl = swiperEl.slides[swiperEl.activeIndex];

      setActiveTabIndex(+currentEl.dataset.galleryGroupIndex);
      videoToggleControls(swiperEl, 'auto', setVisiblePagination);
   };

   const handleThumbClick = index => {
      let currentIndex = 0;

      data.forEach(item => {
         if (index >= item.id && item.id !== index) {
            currentIndex += item.images?.length || item.videos?.length || 0;
         }
      });

      setActiveTabIndex(index);

      if (swiperRef.current && swiperRef.current.swiper) {
         swiperRef.current.swiper.slideTo(currentIndex);
      }
   };

   useEffect(() => {
      if (!swiperRef.current) return;
      videoToggleControls(swiperRef.current.swiper, 'off', setVisiblePagination);
      swiperRef.current.swiper.slideTo(activeIndex, 0);
   }, []);

   const currentTag = {
      value: data[activeTabIndex]?.distance || data[activeTabIndex]?.price,
      prefix: data[activeTabIndex]?.distance ? 'м²' : data[activeTabIndex]?.price ? '₽' : '',
   };

   if (mode === 'default') {
      return (
         <div>
            {tabsMobile && (
               <TabsNav>
                  {data.map((item, index) => {
                     return (
                        <TabsTitle border onChange={() => handleThumbClick(index)} value={activeTabIndex === index} key={index}>
                           {item.title}
                        </TabsTitle>
                     );
                  })}
               </TabsNav>
            )}

            <TabsBody className="min-w-0 overflow-hidden relative">
               <GalleryRow
                  dataGallery={data}
                  videosData={videosData}
                  swiperRef={swiperRef}
                  onSlideChange={onSlideChangeHandler}
                  visiblePagination={visiblePagination}
                  setVisiblePagination={setVisiblePagination}
                  sidebar={sidebar}
                  galleryHeight={galleryHeight}
                  isOpenModal={isOpenModal}
                  setIsOpenModal={setIsOpenModal}
                  imageFit={imageFit}
               />
               {data[activeTabIndex]?.description && (
                  <div className="mt-3 md1:!mx-4">
                     <div className="cut cut-4">
                        <GetDescrHTML data={data[activeTabIndex]?.description} />
                     </div>
                     <button type="button" className="blue-link mt-3" onClick={() => setIsOpenModal(true)}>
                        Подробнее
                     </button>
                     {Boolean(currentTag.prefix && currentTag.value) && (
                        <div className={styles.GalleryRowTag}>
                           {currentTag.value} {currentTag.prefix}
                        </div>
                     )}
                  </div>
               )}
            </TabsBody>
         </div>
      );
   }

   if (mode === 'modal') {
      return (
         <div className="container-desktop !max-w-[1600px]">
            {tabsMobile && (
               <TabsNav>
                  {data.map((item, index) => {
                     return (
                        <TabsTitle border onChange={() => handleThumbClick(index)} value={activeTabIndex === index} key={index}>
                           {item.title}
                        </TabsTitle>
                     );
                  })}
               </TabsNav>
            )}

            <div className="grid mmd1:grid-cols-[1fr_minmax(auto,350px)] gap-x-5">
               <TabsBody className="min-w-0  overflow-hidden">
                  <GalleryRowLayout
                     options={{
                        ...{ dataGallery: data },
                        ...{ onSlideChange: onSlideChangeHandler },
                        ...{ fullscreen: false },
                        videosData,
                        swiperRef,
                        visiblePagination,
                        setVisiblePagination,
                        galleryHeight,
                        isOpenModal,
                        setIsOpenModal,
                        imageFit,
                        mode,
                     }}
                  />
                  {data[activeTabIndex]?.description && (
                     <div className="mt-3 md1:!mx-4">
                        <GetDescrHTML data={data[activeTabIndex]?.description} />
                     </div>
                  )}
               </TabsBody>
               <div className={`md1:!mx-4 ${tabsMobile ? 'mt-6' : ''} md1:border-t md1:pt-4 md1:border-primary700 md1:mt-4`}>{sidebar}</div>
            </div>
         </div>
      );
   }
};

export const GalleryModal = ({ data, imageFit }) => {
   const isDesktop = useSelector(getIsDesktop);

   return (
      <div className="!pt-14 flex flex-col items-center">
         <div className="max-w-[1200px] flex flex-col gap-6 justify-center">
            {data.map((item, index) => {
               return (
                  <div key={index}>
                     {/* {Boolean(item.title) && (
                        <div className="mb-3 sticky top-0 left-0 right-0 w-full z-[98] bg-[#0e1319]">
                           <h3 className="title-2 !text-white pl-2 pt-2 pb-2">{item.title}</h3>
                        </div>
                     )} */}
                     <div className="flex flex-col gap-3">
                        {Boolean(item.type === 'images') &&
                           item.images.map((image, index) => {
                              return (
                                 <img
                                    key={index}
                                    src={getSrcImage(image)}
                                    alt=""
                                    className={cn(
                                       'h-full',
                                       styles.GalleryRowImage,
                                       imageFit === 'contain' && '!object-contain min-h-[750px]',
                                       isDesktop && 'bg-[#0e1319]'
                                    )}
                                 />
                              );
                           })}
                        {Boolean(item.type === 'videos') &&
                           item.videos.map((video, index) => {
                              return <VideoBlock key={index} data={video} />;
                           })}
                     </div>
                  </div>
               );
            })}
         </div>
      </div>
   );
};
