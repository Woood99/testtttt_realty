import React, { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import videojs from 'video.js';

import 'video.js/dist/video-js.css';
import '../../styles/components/video-player.scss';

import Modal from '../../ui/Modal';

import { BASE_URL } from '../../constants/api';
import ModalWrapper from '../../ui/Modal/ModalWrapper';
import isEmptyArrObj from '../../helpers/isEmptyArrObj';
import { IconChat, IconPause, IconPlay, IconShareArrow } from '../../ui/Icons';
import Button from '../../uiForm/Button';
import { timeToSeconds } from '../../helpers/timeTo';
import { RoutesPath } from '../../constants/RoutesPath';
import { getIsDesktop, getUserInfo } from '@/redux';
import { ROLE_ADMIN, ROLE_BUYER, ROLE_SELLER } from '../../constants/roles';
import ModalHeader from '../../ui/Modal/ModalHeader';
import Tag from '../../ui/Tag';
import { InteractiveElement } from '../../ModalsMain/VideoModal';
import ShareModal from '../../ModalsMain/ShareModal';
import { playerLocalRu } from '../../ModalsMain/VideoModal/components/playerLocalRu';
import PlayerCards from '../../ModalsMain/VideoModal/components/PlayerCards';
import PlayerTitle from '../../ModalsMain/VideoModal/components/PlayerTitle';
import PlayerAuthor from '../../ModalsMain/VideoModal/components/PlayerAuthor';
import { ApartmentsCardsVertical } from '../../ModalsMain/VideoModal/components/ApartmentsCards';
import timeTooltip from '../../ModalsMain/VideoModal/components/timeTooltip';
import { useNavigateToChat } from '../../hooks/useNavigateToChat';

const PlaybackIndicator = ({ isPlaying }) => (
   <div className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 circle-dark ${isPlaying ? 'opacity-0' : 'opacity-100'}`}>
      {isPlaying ? <IconPause width={24} height={24} className="fill-white" /> : <IconPlay width={24} height={24} className="fill-white" />}
   </div>
);

const ControlButtons = memo(({ onChat, onShare, volumePanelRef }) => (
   <div className="flex flex-col items-center gap-4">
      <div className="video-js video-js-short-volume short-player-volume" ref={volumePanelRef} />
      <button className="w-[52px] h-[52px] flex items-center justify-center" onClick={onChat}>
         <IconChat className="stroke-white fill-[transparent]" width={24} height={24} />
      </button>
      <button className="w-[52px] h-[52px] flex items-center justify-center" onClick={onShare}>
         <IconShareArrow className="fill-white" width={24} height={24} />
      </button>
   </div>
));

export const ShortPlayer = ({ data, classNamePlayer = '' }) => {
   const playerRef = useRef(null);
   const elementRef = useRef(null);
   const volumePanelRef = useRef(null);

   const [sidebarState, setSidebarState] = useState({
      apartments: false,
      building: false,
   });

   const [uiState, setUiState] = useState({
      time: 0,
      videoPlay: false,
      shareModal: false,
      interactiveOpen: false,
   });

   const isDesktop = useSelector(getIsDesktop);
   const userInfo = useSelector(getUserInfo);
   const navigateToChat = useNavigateToChat();

   const id = useRef(`short-player-${data.id}`).current;

   const previewUrl = useMemo(() => `${BASE_URL}/api/video/${data.id}/preview/0`, [data.id]);
   const shareUrl = useMemo(() => `${window.location.origin}/shorts/${data.id}`, [data.id]);

   const playerOptions = useMemo(
      () => ({
         controls: true,
         autoplay: false,
         preload: 'auto',
         muted: false,
         playsinline: true,
         language: 'ru',
         sources: [
            {
               src: `${BASE_URL}${data.video_url}`,
               type: 'video/mp4',
            },
         ],
         userActions: { doubleClick: false, click: isDesktop },
      }),
      [data.video_url, id]
   );

   const handleShare = useCallback(() => setUiState(prev => ({ ...prev, shareModal: true })), []);

   const handleInteractiveOpen = useCallback(() => setUiState(prev => ({ ...prev, interactiveOpen: true })), []);

   const interactiveButtonProps = useMemo(
      () => ({
         onClick: handleInteractiveOpen,
         size: '34',
         className: 'absolute bottom-[75px] left-4',
         children: data.interactiveEl?.type?.label,
      }),
      [handleInteractiveOpen, data.interactiveEl]
   );

   const modalCommonProps = useMemo(
      () => ({
         options: {
            modalClassNames: 'HeaderSticky !pb-0',
            overlayClassNames: '_full',
            modalContentClassNames: '!px-0 !pt-0',
         },
         closeBtn: false,
      }),
      []
   );

   const toggleSidebar = useCallback(type => {
      setSidebarState(prev => ({
         apartments: type === 'apartments' ? !prev.apartments : false,
         building: type === 'building' ? !prev.building : false,
      }));
   }, []);

   const handleChatNavigation = useCallback(async () => {
      if (data.author.role === ROLE_ADMIN.id) {
         await navigateToChat({
            building_id: data.building_id,
            organization_id: +data.developer.id,
         });
      } else if (data.author.role === ROLE_SELLER.id) {
         await navigateToChat({
            building_id: data.building_id,
            recipients_id: [data.author.id],
         });
      }
   }, [data, navigateToChat]);

   const sidebarContent = useMemo(
      () => ({
         apartments: {
            params: { ids: data.cards.slice(0, 50), per_page: 35 },
            title: 'Квартиры этого обзора',
            showMoreUrl: `${RoutesPath.listingFlats}?complex=${data.building_id}&ids=1&${data.cards.map(id => `id=${id}`).join('&')}`,
         },
         building: {
            params: { building_id: data.building_id, per_page: 35 },
            title: `Квартиры ЖК ${data.building_name}`,
            showMoreUrl: `${RoutesPath.listingFlats}?complex=${data.building_id}`,
         },
      }),
      [data]
   );

   const tagsContent = useMemo(
      () =>
         (data.tags || []).slice(0, 3).map((item, index) => (
            <Tag size="small" color="default" key={index}>
               {item.name}
            </Tag>
         )),
      [data.tags]
   );

   const showInteractiveButton = useMemo(
      () =>
         userInfo?.role?.id === ROLE_BUYER.id &&
         elementRef.current &&
         !isEmptyArrObj(data.interactiveEl) &&
         uiState.time >= timeToSeconds(data.interactiveEl.time),
      [userInfo, data.interactiveEl, uiState.time]
   );

   const renderMobileModals = useMemo(() => {
      if (isDesktop) return null;

      return (
         <>
            <ModalWrapper condition={sidebarState.apartments}>
               <Modal
                  condition={sidebarState.apartments}
                  set={() => toggleSidebar('apartments')}
                  {...modalCommonProps}
                  ModalHeader={() => (
                     <ModalHeader set={() => toggleSidebar('apartments')} className="px-4 py-4 mb-2">
                        <h2 className="title-2">{sidebarContent.apartments.title}</h2>
                     </ModalHeader>
                  )}>
                  <ApartmentsCardsVertical
                     options={{
                        player: elementRef.current,
                        ...sidebarContent.apartments,
                        condition: sidebarState.apartments,
                        set: () => toggleSidebar('apartments'),
                        className: '',
                     }}
                  />
               </Modal>
            </ModalWrapper>

            <ModalWrapper condition={sidebarState.building}>
               <Modal
                  condition={sidebarState.building}
                  set={() => toggleSidebar('building')}
                  {...modalCommonProps}
                  ModalHeader={() => (
                     <ModalHeader set={() => toggleSidebar('building')} className="px-4 py-4 mb-2">
                        <h2 className="title-2">{sidebarContent.building.title}</h2>
                     </ModalHeader>
                  )}>
                  <ApartmentsCardsVertical
                     options={{
                        player: elementRef.current,
                        ...sidebarContent.building,
                        condition: sidebarState.building,
                        set: () => toggleSidebar('building'),
                        className: '',
                     }}
                  />
               </Modal>
            </ModalWrapper>
         </>
      );
   }, [isDesktop, sidebarState, modalCommonProps, sidebarContent]);

   useEffect(() => {
      const initPlayer = () => {
         const el = document.getElementById(id);
         if (!el) return;

         const existingPlayer = videojs.getPlayer(id);
         if (existingPlayer) {
            existingPlayer.dispose();
            // Очищаем остатки из глобального списка Video.js
            delete videojs.players[id];
         }

         const player = videojs(el, playerOptions, function () {
            // Колбэк после инициализации
            this.el().style.setProperty('--bg-image', `url('${previewUrl}')`);
         });

         playerRef.current = player;

         const controlBar = player.getChild('controlBar');
         const volumePanel = controlBar.getChild('volumePanel');
         const playToggle = controlBar.getChild('playToggle');

         controlBar.removeChild(playToggle);
         controlBar.getChild('RemainingTimeDisplay')?.dispose();

         if (volumePanelRef.current) {
            controlBar.removeChild(volumePanel);
            volumePanelRef.current.appendChild(volumePanel.el());
         }

         player.addChild('PlayToggle', {}, 0);
         player.getChild('PlayToggle').el().classList.add('short-player-play');

         player.on('ended', () => player.play());
         player.on('timeupdate', () => {
            setUiState(prev => ({ ...prev, time: player.currentTime() }));
         });
         player.on('volumechange', () => {
            localStorage.setItem('video_volume', player.muted() ? 0 : player.volume());
         });
         player.on('play', () => setUiState(prev => ({ ...prev, videoPlay: true })));
         player.on('pause', () => setUiState(prev => ({ ...prev, videoPlay: false })));

         timeTooltip(player, data.timeCodes);
      };

      initPlayer();
      videojs.addLanguage('ru', playerLocalRu);

      return () => {
         if (playerRef.current && !playerRef.current.isDisposed()) {
            playerRef.current.dispose();
            delete videojs.players[id];
            playerRef.current = null;
         }
      };
   }, [data, id, playerOptions, previewUrl]);

   return (
      <div className="h-full w-full cursor-pointer">
         {isDesktop && (
            <>
               {sidebarState.apartments && (
                  <ApartmentsCardsVertical
                     options={{
                        player: elementRef.current,
                        ...sidebarContent.apartments,
                        condition: sidebarState.apartments,
                        set: () => toggleSidebar('apartments'),
                        className: 'absolute top-8 bottom-8 -left-[360px] w-[360px] rounded-tr-none rounded-br-none rounded-br-x',
                     }}
                  />
               )}
               {sidebarState.building && (
                  <ApartmentsCardsVertical
                     options={{
                        player: elementRef.current,
                        ...sidebarContent.building,
                        condition: sidebarState.building,
                        set: () => toggleSidebar('building'),
                        className: 'absolute top-8 bottom-8 -left-[360px] w-[360px] rounded-tr-none rounded-br-none rounded-br-x',
                     }}
                  />
               )}
            </>
         )}

         <div data-vjs-player>
            <div className="video-js-background" />
            <video id={id} className={`video-js ${classNamePlayer}`} playsInline />
         </div>

         <div className="absolute top-6 right-6 z-[99]">
            <button className="blue-link !text-white" onClick={() => toggleSidebar('building')}>
               Квартиры ЖК
            </button>
         </div>

         <div className="absolute bottom-[135px] right-1 z-[99]">
            <ControlButtons onChat={handleChatNavigation} onShare={handleShare} volumePanelRef={volumePanelRef} />
         </div>

         <ShareModal
            condition={uiState.shareModal}
            set={val => setUiState(prev => ({ ...prev, shareModal: val }))}
            title="Поделиться Short"
            url={shareUrl}
         />

         <PlayerAuthor
            data={data}
            player={playerRef.current}
            setInteractiveIsOpen={val => setUiState(prev => ({ ...prev, interactiveOpen: val }))}
            className={`top-4 left-4 z-[99] max-w-[300px] md3:max-w-[200px]`}
            type="short"
         />

         <div className="absolute left-4 bottom-[20px] z-40 w-full">
            {data.tags?.length > 0 && <div className="mb-4 flex gap-2 flex-wrap max-w-[80%]">{tagsContent}</div>}

            <PlayerTitle
               title={data.name}
               className="!static !w-[80%]"
               building_id={data.building_id}
               building_name={data.building_name}
               type="short"
            />

            <PlayerCards data={data} onClick={() => toggleSidebar('apartments')} />
         </div>

         {showInteractiveButton && <Button {...interactiveButtonProps} />}

         <InteractiveElement data={data} condition={uiState.interactiveOpen} set={val => setUiState(prev => ({ ...prev, interactiveOpen: val }))} />

         <div className="pointer-events-none short-player-status">
            <PlaybackIndicator isPlaying={uiState.videoPlay} />
         </div>

         {renderMobileModals}
      </div>
   );
};
