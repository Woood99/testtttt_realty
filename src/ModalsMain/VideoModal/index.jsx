import React, { useEffect, useRef, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import { useSelector } from 'react-redux';
import { useCookies } from 'react-cookie';
import { Link } from 'react-router-dom';
import videojs from 'video.js';
import cn from 'classnames';

import 'video.js/dist/video-js.css';
import '../../styles/components/video-player.scss';

import Modal from '../../ui/Modal';

import { BASE_URL } from '../../constants/api';
import customTimeDisplay from './components/customTimeDisplay';
import timeTooltip from './components/timeTooltip';
import timeCodes from './components/timeCodes';
import { NavBtnNext, NavBtnPrev } from '../../ui/NavBtns';
import ShareModal from '../ShareModal';
import ModalWrapper from '../../ui/Modal/ModalWrapper';
import SelectAccLogModal from '../SelectAccLogModal';
import RecordViewing from '../RecordViewing';
import isEmptyArrObj from '../../helpers/isEmptyArrObj';
import { IconArrow, IconChat, IconPause, IconPlay, IconShareArrow } from '../../ui/Icons';
import { ApartmentsCardsVertical } from './components/ApartmentsCards';
import PlayerAuthor from './components/PlayerAuthor';
import PlayerTitle from './components/PlayerTitle';
import Button from '../../uiForm/Button';
import getSrcImage from '../../helpers/getSrcImage';
import PlayerCards from './components/PlayerCards';
import { timeToSeconds } from '../../helpers/timeTo';
import { RoutesPath } from '../../constants/RoutesPath';
import { getIsDesktop, getUserInfo } from '../../redux/helpers/selectors';
import { isIOS } from '../../helpers/deviceUtils';
import { playerLocalRu } from './components/playerLocalRu';
import { ROLE_ADMIN, ROLE_BUYER, ROLE_SELLER } from '../../constants/roles';
import ModalHeader from '../../ui/Modal/ModalHeader';
import { getCardBuildingsById } from '../../api/getCardsBuildings';
import { useNavigateToChat } from '../../hooks/useNavigateToChat';
import Tag from '../../ui/Tag';

let shortReadyNext = true;

export const ShortsModal = ({ condition, set, data, startData = null, startIndex = 0 }) => {
   const isDesktop = useSelector(getIsDesktop);
   return (
      <ModalWrapper condition={condition}>
         <Modal
            options={{
               overlayClassNames: '_full',
               modalClassNames: `!bg-[#0e1319] ${!isDesktop ? 'HeaderSticky !pb-0' : ''}`,
               modalContentClassNames: '!p-0',
            }}
            set={set}
            condition={condition}
            closeBtnDark
            closeBtn={isDesktop}
            ModalHeader={() => (
               <>
                  {!isDesktop && (
                     <div className="ModalHeader px-4 py-3 !bg-[#0e1319] !shadow-none">
                        <button type="button" onClick={() => set(false)}>
                           <IconArrow className="rotate-180 fill-white" width={32} height={32} />
                        </button>
                     </div>
                  )}
               </>
            )}>
            <div className="!px-8 !pt-8 !pb-0 md1:!px-0 md1:!pt-0">
               <Shorts data={data} startData={startData} startIndex={startIndex} condition={condition} />
            </div>
         </Modal>
      </ModalWrapper>
   );
};

export const Shorts = ({ data, condition = true, startIndex, startData, single = false }) => {
   const [startShort, setStartShort] = useState(null);
   const isDesktop = useSelector(getIsDesktop);

   const swiperRef = useRef(null);
   const [currentIndex, setCurrentIndex] = useState(0);

   const modalContainerRef = useRef(null);

   const [initIds, setInitIds] = useState([]);

   useEffect(() => {
      if (!modalContainerRef.current) return;

      const handleWheel = event => {
         if (!shortReadyNext) return;

         if (swiperRef.current && swiperRef.current.swiper) {
            if (!event.target.closest('.video-player-sidebar-dynamic')) {
               shortReadyNext = false;

               if (event.deltaY > 0) {
                  swiperRef.current.swiper.slideNext();
               } else {
                  swiperRef.current.swiper.slidePrev();
               }
               setTimeout(() => {
                  shortReadyNext = true;
               }, 350);
            }
         }
      };

      modalContainerRef.current.addEventListener('wheel', handleWheel, { passive: false });

      return () => {
         if (modalContainerRef.current) {
            modalContainerRef.current.removeEventListener('wheel', handleWheel);
         }
      };
   }, [modalContainerRef.current, swiperRef.current, startShort]);

   useEffect(() => {
      if (startData) {
         setStartShort(startData || data[0]);
      }
   }, [startData]);

   const handlePrev = () => {
      if (!shortReadyNext) return;
      if (swiperRef.current && swiperRef.current.swiper) {
         shortReadyNext = false;
         swiperRef.current.swiper.slidePrev();
      }
      setTimeout(() => {
         shortReadyNext = true;
      }, 350);
   };

   const handleNext = () => {
      if (!shortReadyNext) return;
      if (swiperRef.current && swiperRef.current.swiper) {
         shortReadyNext = false;
         swiperRef.current.swiper.slideNext();
      }
      setTimeout(() => {
         shortReadyNext = true;
      }, 350);
   };

   const handleSlideChange = swiper => {
      setCurrentIndex(swiper.activeIndex);
      const prevSlide = swiper.slides[swiper.activeIndex - 1];
      const currentSlide = swiper.slides[swiper.activeIndex];
      const nextSlide = swiper.slides[swiper.activeIndex + 1];
      let newIds = [];

      if (currentSlide) {
         newIds.push(data[swiper.activeIndex].id);
      }
      if (nextSlide) {
         newIds.push(data[swiper.activeIndex + 1].id);
      }

      if (prevSlide) {
         newIds.push(data[swiper.activeIndex - 1].id);
      }

      setInitIds(newIds);

      setTimeout(() => {
         swiper.slides.forEach((slide, index) => {
            const videoElement = slide.querySelector('video');
            if (videoElement) {
               const player = videojs.getPlayer(videoElement.id);
               if (player) {
                  if (index !== swiper.activeIndex) {
                     player.pause();
                  } else {
                     player.volume(localStorage.getItem('video_volume') || 0.5);

                     setTimeout(() => {
                        player.play();
                     }, 300);
                  }
               }
            }
         });
      }, 50);
   };

   const onHandlerTouchStart = swiper => {
      const currentSlide = swiper.slides[swiper.activeIndex];
      if (!currentSlide) return;
      const videoElement = currentSlide.querySelector('video');
      if (!videoElement) return;
      videoElement.classList.add('pointer-events-none');
   };

   const onHandlerTouchEnd = swiper => {
      const currentSlide = swiper.slides[swiper.activeIndex];
      if (!currentSlide) return;
      const videoElement = currentSlide.querySelector('video');
      if (!videoElement) return;
      videoElement.classList.remove('pointer-events-none');
   };

   const onHandlerClick = (swiper, e) => {
      if (e.target.closest('.vjs-control-bar')) return;
      const currentSlide = swiper.slides[swiper.activeIndex];
      if (!currentSlide) return;
      const videoElement = currentSlide.querySelector('video');
      if (!videoElement) return;
      const player = videojs.getPlayer(videoElement.id);
      if (player) {
         if (player.paused()) {
            if (e.target.closest('.video-js')) {
               player.play();
            }
         } else {
            player.pause();
         }
      }
   };

   useEffect(() => {
      if (!condition) return;
      if (swiperRef.current && startShort && swiperRef.current && swiperRef.current.swiper) {
         setTimeout(() => {
            const swiper = swiperRef.current.swiper;
            swiper.slides.forEach((slide, index) => {
               const videoElement = slide.querySelector('video');

               if (videoElement) {
                  const player = videojs.getPlayer(videoElement.id);

                  if (player) {
                     if (index === swiper.activeIndex) {
                        player.play();
                     }
                  }
               }
            });
         }, 250);
      }
   }, [startShort, condition]);

   useEffect(() => {
      if (condition) return;

      if (swiperRef.current && swiperRef.current.swiper) {
         const swiper = swiperRef.current.swiper;
         swiper.slides.forEach(slide => {
            const videoElement = slide.querySelector('video');
            if (videoElement) {
               const player = videojs.getPlayer(videoElement.id);
               if (player) {
                  player.dispose();
               }
            }
         });
         swiper.disable();
      }
   }, [condition]);

   return (
      <div ref={modalContainerRef}>
         <div className="video-player shorts-player shorts-player-controls">
            <Swiper
               modules={[Navigation]}
               ref={swiperRef}
               // slidesPerView={data.length > 1 ? 1.1117 : 1}
               slidesPerView={1}
               spaceBetween={16}
               grabCursor
               keyboard
               direction="vertical"
               speed={800}
               className="h-full mmd1:pl-[385px] mmd1:-ml-[385px]"
               onSlideChange={handleSlideChange}
               onTouchStart={onHandlerTouchStart}
               onTouchEnd={onHandlerTouchEnd}
               onClick={onHandlerClick}
               onInit={swiper => {
                  swiper.slideTo(startIndex !== -1 ? startIndex : 0, 0);
                  handleSlideChange(swiper);
               }}
               breakpoints={{
                  1222: {
                     touchEventsTarget: 'container',
                     simulateTouch: false,
                  },
               }}>
               {data.map(card => {
                  return (
                     <SwiperSlide key={card.id} className={`shorts-player-slide ${initIds.includes(card.id) ? '_init' : ''}`}>
                        {Boolean(initIds.includes(card.id)) && <ShortPlayer data={card} currentId={card.id} />}
                     </SwiperSlide>
                  );
               })}
            </Swiper>
            {!single && isDesktop && (
               <>
                  <NavBtnPrev
                     onClick={handlePrev}
                     disabled={currentIndex === 0}
                     className="!w-[52px] !h-[52px] slider-btn-prev !absolute bottom-[84px] -right-[60px] short-player-icon"
                     classnameicon="!-rotate-90 fill-[#828282] w-[28px] h-[28px]"
                  />
                  <NavBtnNext
                     onClick={handleNext}
                     disabled={currentIndex === swiperRef.current?.swiper?.slides.length - 1}
                     className="!w-[52px] !h-[52px] slider-btn-next !absolute bottom-4 -right-[60px] short-player-icon"
                     classnameicon="!rotate-90 fill-[#828282] w-[28px] h-[28px]"
                  />
               </>
            )}
         </div>
      </div>
   );
};

export const getPosterVideo = data => {
   if (!data) return;
   return data.image_url ? getSrcImage(data.image_url) : `${BASE_URL}/api/video/${data.id}/preview/0`;
};

export const VideoBlock = ({ data, className = '', classNameVideo }) => {
   const playerRef = useRef(null);
   const poster = getPosterVideo(data);

   return (
      <div className={className}>
         <VideoPlayer
            refElement={playerRef}
            data={data}
            variant="default"
            className={cn('w-full h-full', classNameVideo)}
            autoplay={false}
            poster={poster}
         />
      </div>
   );
};

export const VideoPlayer = ({
   condition = true,
   data,
   variant = 'default',
   className = '',
   autoplay = true,
   poster = '',
   children,
   mute = true,
   refElement,
   visibleControls = true,
   childrenVideo,
   classNameButtonPlay,
}) => {
   const isDesktop = useSelector(getIsDesktop);
   const videoRef = useRef(null);
   const playerRef = useRef(null);
   const [element, setElement] = useState(null);

   const [isShareModal, setIsShareModal] = useState(false);
   const [interactiveIsOpen, setInteractiveIsOpen] = useState(false);
   const [isActivePanel, setIsActivePanel] = useState(true);
   const userInfo = useSelector(getUserInfo);

   const [time, setTime] = useState(0);

   const OPTIONS = {
      autoplay: autoplay,
      controls: true,
      mute: mute,
      language: 'ru',
      poster: poster,
      playbackRates: [0.5, 0.75, 1, 1.5, 2],
      sources: [
         {
            src: data.video_url_test || `${BASE_URL}${data.video_url}`,
            type: 'video/mp4',
         },
      ],
      userActions: {
         click: function () {
            if (!isDesktop) return;
            if (this.paused()) {
               this.play().catch(error => {
                  console.error('Ошибка воспроизведения:', error);
               });
            } else {
               this.pause();
            }
         },
      },
   };

   useEffect(() => {
      if (playerRef.current && refElement) {
         refElement.current = playerRef.current;
      }
   }, [playerRef.current]);

   videojs.addLanguage('ru', playerLocalRu);

   useEffect(() => {
      if (condition && !playerRef.current) {
         const videoElement = document.createElement('video-js');
         videoRef.current.appendChild(videoElement);
         const player = (playerRef.current = videojs(videoElement, OPTIONS));
         setElement(videoElement);
         const timeUpdateArr = [];
         player.volume(localStorage.getItem('video_volume') || 0.5);

         if (variant !== 'default') {
            timeCodes(player, data.timeCodes, timeUpdateArr);
         }
         customTimeDisplay(player, timeUpdateArr, visibleControls);
         if (!visibleControls && player) {
            const progressControl = player.controlBar.progressControl;
            if (progressControl) {
               progressControl.dispose(); // Удаляет элемент управления прогрессом
            }
         }
         timeTooltip(player, data.timeCodes);

         player.on('timeupdate', () => {
            timeUpdateArr.forEach(item => item());
            setTime(player.currentTime());
         });
         player.on('volumechange', () => {
            localStorage.setItem('video_volume', player.muted() ? 0 : player.volume());
         });
         player.on('useractive', function () {
            console.log('Панель управления видима');
            setIsActivePanel(true);
         });

         player.on('userinactive', function () {
            setIsActivePanel(false);
         });
      } else {
         videoRef.current = null;
         playerRef.current = null;
      }
   }, [condition]);

   useEffect(() => {
      if (!(playerRef.current && videoRef.current)) return;
      const videoEl = playerRef.current.el();

      const handleTap = event => {
         if (event.target.classList.contains('video-js') || event.target.classList.contains('vjs-tech')) {
            if (playerRef.current.paused()) {
               playerRef.current
                  .play()
                  .then(() => {
                     if (isIOS() && !playerRef.current.isFullscreen()) {
                        playerRef.current.requestFullscreen();
                     }
                  })
                  .catch(error => {
                     console.error('Ошибка воспроизведения:', error);
                  });
            } else {
               playerRef.current.pause();
            }
         }
      };

      videoEl.addEventListener('touchstart', handleTap);

      return () => {
         videoEl.removeEventListener('touchstart', handleTap);
      };
   }, [playerRef.current, videoRef.current]);

   useEffect(() => {
      if (playerRef.current && poster) {
         setTimeout(() => {
            playerRef.current.poster(poster);
            playerRef.current.load();
         }, 250);
      }
   }, [poster]);

   if (variant === 'default') {
      return (
         <div
            className={`video-player video-player-default ${className}`}
            style={{ '--bg-image': `url('${BASE_URL}/api/video/${data.id}/preview/0')` }}>
            <div className="video-js-background video-js-background--video" />
            <div ref={videoRef} className="h-full" />
            {!playerRef.current?.hasStarted_ && (
               <button
                  type="button"
                  className={cn(
                     'absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex items-center justify-center z-[9999]',
                     classNameButtonPlay
                  )}
                  onClick={() => playerRef.current?.play()}>
                  <IconPlay className="fill-white" width={46} height={46} />
               </button>
            )}
         </div>
      );
   }

   if (variant === 'page') {
      return (
         <div className={`video-player ${className}`}>
            <div className="self-start overflow-hidden rounded-[20px]">
               <div className="bg-white rounded-[20px] overflow-hidden">
                  <div ref={videoRef} className="relative md1:fixed md1:top-[50px] md1:left-0 md1:w-full z-[999]">
                     {(!playerRef.current?.hasStarted_ || (!isDesktop && isActivePanel) || playerRef.current?.paused()) && (
                        <button
                           type="button"
                           className={cn(
                              'pointer-events-none absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex items-center justify-center z-[9999]',
                              classNameButtonPlay
                           )}>
                           {playerRef.current?.paused() ? (
                              <IconPlay className="fill-white" width={46} height={46} />
                           ) : (
                              <IconPause className="fill-white" width={46} height={46} />
                           )}
                        </button>
                     )}

                     {userInfo?.role?.id === ROLE_BUYER.id &&
                        playerRef.current &&
                        !isEmptyArrObj(data.interactiveEl) &&
                        Boolean(playerRef.current.currentTime() >= timeToSeconds(data.interactiveEl.time)) && (
                           <Button onClick={() => setInteractiveIsOpen(true)} size="34" className="absolute bottom-[75px] right-4">
                              {data.interactiveEl.type.label}
                           </Button>
                        )}
                     <InteractiveElement data={data} condition={interactiveIsOpen} set={setInteractiveIsOpen} />
                  </div>
                  <div className="mt-4 order-1 md1:mt-[calc(56.25%+0px)]">
                     <div className="flex items-start gap-6 justify-between px-4 pb-4 shadow-primary md1:flex-col">
                        <div className="flex-grow">
                           {Boolean(data.building_name) && (
                              <Link to={`${RoutesPath.building}${data.building_id}`} className="mb-2 font-medium blue-link">
                                 ЖК {data.building_name}
                              </Link>
                           )}
                           <PlayerTitle title={data.name} className="!static !w-full" classNameTitle="title-3" />
                           {data.tags.length > 0 && (
                              <div className="mt-3 mb-6 flex gap-2 flex-wrap">
                                 {data.tags.map((item, index) => (
                                    <Tag size="small" color="default" key={index}>
                                       {item.name}
                                    </Tag>
                                 ))}
                              </div>
                           )}
                           <PlayerAuthor
                              data={data}
                              player={videojs.getPlayer(element?.id)}
                              setInteractiveIsOpen={setInteractiveIsOpen}
                              className="relative mt-4"
                           />
                        </div>
                        <Button variant="secondary" size="32" className="flex gap-2 items-center text-blue" onClick={() => setIsShareModal(true)}>
                           <IconShareArrow className="fill-blue" width={16} height={16} />
                           Поделиться видео
                        </Button>
                        <ShareModal
                           condition={isShareModal}
                           set={setIsShareModal}
                           title="Поделиться видео"
                           url={window.location.origin + `/videos/${data.id}`}
                        />
                     </div>
                  </div>
               </div>
               {childrenVideo}
            </div>
            {children}
         </div>
      );
   }
};

export const ShortPlayer = ({ data, currentId, classNamePlayer = '' }) => {
   const id = `short-player-${data.id}`;
   const [element, setElement] = useState(null);
   const [time, setTime] = useState(0);
   const [videoPlay, setVideoPlay] = useState(id === currentId);
   const volumePanelRef = useRef(null);

   const [isActiveSidebar, setIsActiveSidebar] = useState(false);
   const [isActiveSidebarBuildingByApartments, setIsActiveSidebarBuildingByApartments] = useState(false);

   const isDesktop = useSelector(getIsDesktop);
   const userInfo = useSelector(getUserInfo);
   const navigateToChat = useNavigateToChat();

   const OPTIONS = {
      controls: true,
      autoplay: id === currentId,
      preload: 'auto',
      muted: false,
      language: 'ru',
      sources: [
         {
            src: `${BASE_URL}${data.video_url}`,
            type: 'video/mp4',
         },
      ],
      userActions: {
         doubleClick: false,
      },
   };

   videojs.addLanguage('ru', playerLocalRu);

   const [isShareModal, setIsShareModal] = useState(false);
   const [interactiveIsOpen, setInteractiveIsOpen] = useState(false);

   useEffect(() => {
      const el = document.getElementById(id);

      setElement(el);
      if (el) {
         const player = videojs.getPlayer(el.id);
         if (player) player.dispose();
      }

      const player = videojs(id, OPTIONS);
      if (!player) return;
      player.el().style.setProperty('--bg-image', `url('${BASE_URL}/api/video/${data.id}/preview/0')`);

      const timeUpdateArr = [];
      player.volume(localStorage.getItem('video_volume') || 0.5);
      player.on('ended', () => {
         player.play();
      });
      timeTooltip(player, data.timeCodes);

      const controlBar = player.getChild('controlBar');
      const volumePanel = controlBar.getChild('volumePanel');
      const playToggle = controlBar.getChild('playToggle');

      const remainingTime = controlBar.getChild('RemainingTimeDisplay');
      if (remainingTime) {
         remainingTime.dispose();
      }

      controlBar.removeChild(playToggle);

      if (volumePanelRef.current) {
         controlBar.removeChild(volumePanel);
         volumePanelRef.current.appendChild(volumePanel.el());
      }

      player.addChild('PlayToggle', {}, 0);

      player.getChild('PlayToggle').el().classList.add('short-player-play');

      player.on('timeupdate', () => {
         timeUpdateArr.forEach(item => item());
         setTime(player.currentTime());
      });

      player.on('volumechange', () => {
         localStorage.setItem('video_volume', player.muted() ? 0 : player.volume());
      });

      player.on('play', function () {
         setVideoPlay(true);
      });

      player.on('pause', function () {
         setVideoPlay(false);
      });
   }, [data]);

   const goToChat = async () => {
      if (data.author.role === ROLE_ADMIN.id) {
         await navigateToChat({ building_id: data.building_id, organization_id: +data.developer.id });
      }
      if (data.author.role === ROLE_SELLER.id) {
         await navigateToChat({ building_id: data.building_id, recipients_id: [data.author.id] });
      }
   };

   return (
      <div className="h-full w-full cursor-pointer">
         {isActiveSidebar && isDesktop && (
            <ApartmentsCardsVertical
               options={{
                  player: element,
                  params: { ids: data.cards.slice(0, 50), per_page: 35 },
                  condition: isActiveSidebar,
                  set: setIsActiveSidebar,
                  showMoreUrl: `${RoutesPath.listingFlats}?complex=${data.building_id}&ids=1&${data.cards.map(id => `id=${id}`).join('&')}`,
                  className: 'absolute top-8 bottom-8 -left-[360px] w-[360px] rounded-tr-none rounded-br-none rounded-br-x',
                  title: 'Квартиры этого обзора',
               }}
            />
         )}
         {isActiveSidebarBuildingByApartments && isDesktop && (
            <ApartmentsCardsVertical
               options={{
                  player: element,
                  params: { building_id: data.building_id, per_page: 35 },
                  condition: isActiveSidebarBuildingByApartments,
                  set: setIsActiveSidebarBuildingByApartments,
                  showMoreUrl: `${RoutesPath.listingFlats}?complex=${data.building_id}`,
                  className: 'absolute top-8 bottom-8 -left-[360px] w-[360px] rounded-tr-none rounded-br-none rounded-br-x',
                  title: `Квартиры ЖК ${data.building_name}`,
               }}
            />
         )}
         <div data-vjs-player>
            <div className="video-js-background" />
            <video id={id} className={`video-js ${classNamePlayer}`} />
         </div>
         <button
            className="!absolute z-[99] top-6 right-6 blue-link !text-white"
            onClick={() => {
               setIsActiveSidebar(false);
               setIsActiveSidebarBuildingByApartments(prev => !prev);
            }}>
            Квартиры ЖК
         </button>
         <div className="absolute bottom-[135px] right-1 z-[99]">
            <div className="flex flex-col items-center gap-4">
               <div className="video-js video-js-short-volume short-player-volume" ref={volumePanelRef} />
               <button className="w-[52px] h-[52px] flex items-center justify-center" onClick={goToChat}>
                  <IconChat className="stroke-white fill-[transparent]" width={24} height={24} />
               </button>
               <button onClick={() => setIsShareModal(true)} className="w-[52px] h-[52px] flex items-center justify-center">
                  <IconShareArrow className="fill-white" width={24} height={24} />
               </button>
            </div>
         </div>
         <ShareModal condition={isShareModal} set={setIsShareModal} title="Поделиться Short" url={window.location.origin + `/shorts/${data.id}`} />
         <PlayerAuthor
            data={data}
            player={videojs.getPlayer(element?.id)}
            setInteractiveIsOpen={setInteractiveIsOpen}
            className={`${data.cards.length ? 'top-4' : 'top-4'} left-4 z-[99]`}
            type="short"
         />
         <div className="absolute left-4 bottom-[20px] z-40 w-full">
            {data.tags.length > 0 && (
               <div className="mb-4 flex gap-2 flex-wrap">
                  {data.tags.slice(0, 3).map((item, index) => (
                     <Tag size="small" color="default" key={index}>
                        {item.name}
                     </Tag>
                  ))}
               </div>
            )}
            <PlayerTitle
               title={data.name}
               className="!static !w-[80%]"
               building_id={data.building_id}
               building_name={data.building_name}
               type="short"
            />
            <PlayerCards
               data={data}
               onClick={() => {
                  setIsActiveSidebarBuildingByApartments(false);
                  setIsActiveSidebar(prev => !prev);
               }}
            />
         </div>
         {userInfo?.role?.id === ROLE_BUYER.id &&
            element &&
            !isEmptyArrObj(data.interactiveEl) &&
            Boolean(time >= timeToSeconds(data.interactiveEl.time)) && (
               <Button onClick={() => setInteractiveIsOpen(true)} size="34" className="absolute bottom-[75px] left-4">
                  {data.interactiveEl.type.label}
               </Button>
            )}
         <InteractiveElement data={data} condition={interactiveIsOpen} set={setInteractiveIsOpen} />
         <div className="pointer-events-none short-player-status">
            {!videoPlay ? (
               <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 circle-dark">
                  <IconPlay width={24} height={24} className="fill-white" />
               </div>
            ) : (
               <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 circle-dark">
                  <IconPause width={24} height={24} className="fill-white" />
               </div>
            )}
         </div>
         <ModalWrapper condition={isActiveSidebar && !isDesktop}>
            <Modal
               condition={isActiveSidebar && !isDesktop}
               set={setIsActiveSidebar}
               options={{ modalClassNames: 'HeaderSticky !pb-0', overlayClassNames: '_full', modalContentClassNames: '!px-0 !pt-0' }}
               closeBtn={false}
               ModalHeader={() => (
                  <ModalHeader set={setIsActiveSidebar} className="px-4 py-4 mb-2">
                     <h2 className="title-2">Квартиры этого обзора</h2>
                  </ModalHeader>
               )}>
               <ApartmentsCardsVertical
                  options={{
                     player: element,
                     params: { ids: data.cards.slice(0, 50), per_page: 35 },
                     condition: isActiveSidebar,
                     set: setIsActiveSidebar,
                     showMoreUrl: `${RoutesPath.listingFlats}?complex=${data.building_id}&ids=1&${data.cards.map(id => `id=${id}`).join('&')}`,
                     className: '',
                  }}
               />
            </Modal>
         </ModalWrapper>
         <ModalWrapper condition={isActiveSidebarBuildingByApartments && !isDesktop}>
            <Modal
               condition={isActiveSidebarBuildingByApartments && !isDesktop}
               set={setIsActiveSidebarBuildingByApartments}
               options={{ modalClassNames: 'HeaderSticky !pb-0', overlayClassNames: '_full', modalContentClassNames: '!px-0 !pt-0' }}
               closeBtn={false}
               ModalHeader={() => (
                  <ModalHeader set={setIsActiveSidebarBuildingByApartments} className="px-4 py-4 mb-2">
                     <h2 className="title-2">Квартиры ЖК {data.building_name}</h2>
                  </ModalHeader>
               )}>
               <ApartmentsCardsVertical
                  options={{
                     player: element,
                     params: { building_id: data.building_id, per_page: 35 },
                     condition: isActiveSidebarBuildingByApartments,
                     set: setIsActiveSidebarBuildingByApartments,
                     showMoreUrl: `${RoutesPath.listingFlats}?complex=${data.building_id}`,
                     className: '',
                  }}
               />
            </Modal>
         </ModalWrapper>
      </div>
   );
};

const InteractiveElement = ({ data, condition, set }) => {
   const [cookies] = useCookies();
   const [objectData, setObjectData] = useState({});

   useEffect(() => {
      getCardBuildingsById(data.building_id).then(res => {
         setObjectData(res);
      });
   }, []);

   return (
      Boolean(data.interactiveEl && !isEmptyArrObj(data.interactiveEl)) &&
      (cookies.loggedIn ? (
         <>
            {data.interactiveEl.type.value === 'record-viewing' && (
               <ModalWrapper condition={condition}>
                  <RecordViewing
                     condition={condition}
                     set={set}
                     type="building"
                     id={data.building_id}
                     developName={data.developer.name}
                     objectData={objectData}
                     onUpdate={() => {
                        set(false);
                     }}
                  />
               </ModalWrapper>
            )}
         </>
      ) : (
         <SelectAccLogModal
            condition={condition}
            set={() => {
               if (condition) {
                  return set();
               }
            }}
         />
      ))
   );
};
