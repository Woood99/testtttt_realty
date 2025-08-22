import cn from "classnames";
import React, { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useSelector } from "react-redux";
import videojs from "video.js";
import "video.js/dist/video-js.css";

import { BASE_URL, ROLE_ADMIN, ROLE_BUYER, ROLE_SELLER, RoutesPath } from "@/constants";

import { getCardBuildingsById } from "@/api";

import { useNavigateToChat } from "@/hooks";

import { isArray, isEmptyArrObj, timeToSeconds } from "@/helpers";
import findObjectWithMinValue from "@/helpers/findObjectWithMinValue";

import { getIsDesktop, getUserInfo } from "@/redux";

import { Button } from "@/uiForm";

import { InteractiveElement, ShareModal } from "@/ModalsMain";
import LocationModal from "@/ModalsMain/LocationModal";

import { Maybe, Modal, ModalHeader, ModalWrapper, Tag, TagDiscountSecondary, TagPresents, TagsDiscounts } from "..";

import { ApartmentsCardsVertical } from "../../ModalsMain/VideoModal/components/ApartmentsCards";
import PlayerAuthor from "../../ModalsMain/VideoModal/components/PlayerAuthor";
import PlayerCards from "../../ModalsMain/VideoModal/components/PlayerCards";
import PlayerTitle from "../../ModalsMain/VideoModal/components/PlayerTitle";
import { playerLocalRu } from "../../ModalsMain/VideoModal/components/playerLocalRu";
import timeTooltip from "../../ModalsMain/VideoModal/components/timeTooltip";
import "../../styles/components/video-player.scss";
import { IconChat, IconHome, IconLocation, IconPause, IconPlay, IconShareArrow } from "../Icons";

const PlaybackIndicator = ({ isPlaying }) => (
	<div className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 circle-dark ${isPlaying ? "opacity-0" : "opacity-100"}`}>
		{isPlaying ? <IconPause width={24} height={24} className='fill-white' /> : <IconPlay width={24} height={24} className='fill-white' />}
	</div>
);

const ControlButtons = memo(({ onChat, onShare, onToggleApartments, volumePanelRef, setIsOpenModalLocation }) => (
	<div className='flex flex-col items-center gap-4'>
		<div className='video-js video-js-short-volume short-player-volume relative mb-4 text-[12px]' ref={volumePanelRef}>
			<span className='order-1 text-[12px] absolute -bottom-3 left-1/2 transform -translate-x-1/2'>Звук</span>
		</div>
		<button className='flex items-center justify-center flex-col gap-2 text-white text-[12px]' onClick={() => setIsOpenModalLocation(true)}>
			<IconLocation className='stroke-white w-[20px] h-[20px]' width={20} height={20} />
			<span>На карте</span>
		</button>
		<button className='flex items-center justify-center flex-col gap-2 text-white text-[12px]' onClick={onToggleApartments}>
			<IconHome className='stroke-white w-[20px] h-[20px]' width={20} height={20} />
			<span>Кв-ры ЖК</span>
		</button>
		<button className='flex items-center justify-center flex-col gap-2 text-white text-[12px]' onClick={onChat}>
			<IconChat className='stroke-white w-[20px] h-[20px]' width={20} height={20} />
			<span>Чат</span>
		</button>
		<button className='flex items-center justify-center flex-col gap-2 text-white text-[12px]' onClick={onShare}>
			<IconShareArrow className='stroke-white stroke-[1.5px] fill-[transparent] w-[20px] h-[20px]' width={20} height={20} />
			<span>Поделится</span>
		</button>
	</div>
));

export const ShortPlayer = ({ data, classNamePlayer = "" }) => {
	const playerRef = useRef(null);
	const elementRef = useRef(null);
	const volumePanelRef = useRef(null);
	const [objectData, setObjectData] = useState({});
	const [isOpenModalLocation, setIsOpenModalLocation] = useState(false);

	const [sidebarState, setSidebarState] = useState({
		apartments: false,
		building: false
	});

	const [uiState, setUiState] = useState({
		time: 0,
		videoPlay: false,
		shareModal: false,
		interactiveOpen: false
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
			preload: "auto",
			muted: false,
			playsinline: true,
			language: "ru",
			sources: [
				{
					src: `${BASE_URL}${data.video_url}`,
					type: "video/mp4"
				}
			],
			userActions: { doubleClick: false, click: isDesktop }
		}),
		[data.video_url, id]
	);

	useEffect(() => {
		if (!data.building_id) return;
		getCardBuildingsById(data.building_id).then(res => {
			setObjectData(res);
		});
	}, []);

	const handleShare = useCallback(() => setUiState(prev => ({ ...prev, shareModal: true })), []);

	const handleInteractiveOpen = useCallback(() => setUiState(prev => ({ ...prev, interactiveOpen: true })), []);

	const interactiveButtonProps = useMemo(
		() => ({
			onClick: handleInteractiveOpen,
			size: "34",
			className: "mb-4",
			children: data.interactiveEl?.type?.label
		}),
		[handleInteractiveOpen, data.interactiveEl]
	);

	const modalCommonProps = useMemo(
		() => ({
			options: {
				modalClassNames: "HeaderSticky !pb-0",
				overlayClassNames: "_full",
				modalContentClassNames: "!px-0 !pt-0"
			},
			closeBtn: false
		}),
		[]
	);

	const toggleSidebar = useCallback(type => {
		setSidebarState(prev => ({
			apartments: type === "apartments" ? !prev.apartments : false,
			building: type === "building" ? !prev.building : false
		}));
	}, []);

	const handleChatNavigation = useCallback(async () => {
		if (data.author.role === ROLE_ADMIN.id) {
			await navigateToChat({
				building_id: data.building_id,
				organization_id: +data.developer.id
			});
		} else if (data.author.role === ROLE_SELLER.id) {
			await navigateToChat({
				building_id: data.building_id,
				recipients_id: [data.author.id]
			});
		}
	}, [data, navigateToChat]);

	const sidebarContent = useMemo(
		() => ({
			apartments: {
				params: { ids: data.cards.slice(0, 50), per_page: 35 },
				title: "Квартиры этого обзора",
				showMoreUrl: `${RoutesPath.listingFlats}?complex=${data.building_id}&ids=1&${data.cards.map(id => `id=${id}`).join("&")}`
			},
			building: {
				params: { building_id: data.building_id, per_page: 35 },
				title: `Квартиры ЖК ${data.building_name}`,
				showMoreUrl: `${RoutesPath.listingFlats}?complex=${data.building_id}`
			}
		}),
		[data]
	);

	const tagsContent = useMemo(
		() =>
			(data.tags || []).slice(0, 3).map((item, index) => (
				<div className='text-white cut cut-1 break-all font-medium' key={index}>
					{item.name}
				</div>
			)),
		[data.tags]
	);

	const showInteractiveButton = useMemo(
		() => userInfo?.role?.id === ROLE_BUYER.id && !isEmptyArrObj(data.interactiveEl) && uiState.time >= timeToSeconds(data.interactiveEl.time),
		[userInfo, data.interactiveEl, uiState.time]
	);

	const renderMobileModals = useMemo(() => {
		if (isDesktop) return null;

		return (
			<>
				<ModalWrapper condition={sidebarState.apartments}>
					<Modal
						condition={sidebarState.apartments}
						set={() => toggleSidebar("apartments")}
						{...modalCommonProps}
						ModalHeader={() => (
							<ModalHeader set={() => toggleSidebar("apartments")} className='px-4 py-4 mb-2'>
								<h2 className='title-2'>{sidebarContent.apartments.title}</h2>
							</ModalHeader>
						)}>
						<ApartmentsCardsVertical
							options={{
								player: elementRef.current,
								...sidebarContent.apartments,
								condition: sidebarState.apartments,
								set: () => toggleSidebar("apartments"),
								className: ""
							}}
						/>
					</Modal>
				</ModalWrapper>

				<ModalWrapper condition={sidebarState.building}>
					<Modal
						condition={sidebarState.building}
						set={() => toggleSidebar("building")}
						{...modalCommonProps}
						ModalHeader={() => (
							<ModalHeader set={() => toggleSidebar("building")} className='px-4 py-4 mb-2'>
								<h2 className='title-2'>{sidebarContent.building.title}</h2>
							</ModalHeader>
						)}>
						<ApartmentsCardsVertical
							options={{
								player: elementRef.current,
								...sidebarContent.building,
								condition: sidebarState.building,
								set: () => toggleSidebar("building"),
								className: ""
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
				delete videojs.players[id];
			}

			const player = videojs(el, playerOptions, function () {
				this.el().style.setProperty("--bg-image", `url('${previewUrl}')`);
			});

			playerRef.current = player;

			const controlBar = player.getChild("controlBar");
			const volumePanel = controlBar.getChild("volumePanel");
			const playToggle = controlBar.getChild("playToggle");

			controlBar.removeChild(playToggle);
			controlBar.getChild("RemainingTimeDisplay")?.dispose();

			if (volumePanelRef.current) {
				controlBar.removeChild(volumePanel);
				volumePanelRef.current.appendChild(volumePanel.el());
			}

			player.addChild("PlayToggle", {}, 0);
			player.getChild("PlayToggle").el().classList.add("short-player-play");

			player.on("ended", () => player.play());
			player.on("timeupdate", () => {
				setUiState(prev => ({ ...prev, time: player.currentTime() }));
			});
			player.on("volumechange", () => {
				localStorage.setItem("video_volume", player.muted() ? 0 : player.volume());
			});
			player.on("play", () => setUiState(prev => ({ ...prev, videoPlay: true })));
			player.on("pause", () => setUiState(prev => ({ ...prev, videoPlay: false })));

			timeTooltip(player, data.timeCodes);
		};

		initPlayer();
		videojs.addLanguage("ru", playerLocalRu);

		return () => {
			if (playerRef.current && !playerRef.current.isDisposed()) {
				playerRef.current.dispose();
				delete videojs.players[id];
				playerRef.current = null;
			}
		};
	}, [data, id, playerOptions, previewUrl]);

	const objectDataMinValue = findObjectWithMinValue(objectData.apartments, "bd_price");

	return (
		<div className='h-full w-full cursor-pointer'>
			<Maybe condition={isDesktop}>
				{sidebarState.apartments && (
					<ApartmentsCardsVertical
						options={{
							player: elementRef.current,
							...sidebarContent.apartments,
							condition: sidebarState.apartments,
							set: () => toggleSidebar("apartments"),
							className: "absolute top-8 bottom-8 -left-[360px] w-[360px] rounded-tr-none rounded-br-none rounded-br-x"
						}}
					/>
				)}
				{sidebarState.building && (
					<ApartmentsCardsVertical
						options={{
							player: elementRef.current,
							...sidebarContent.building,
							condition: sidebarState.building,
							set: () => toggleSidebar("building"),
							className: "absolute top-8 bottom-8 -left-[360px] w-[360px] rounded-tr-none rounded-br-none rounded-br-x"
						}}
					/>
				)}
			</Maybe>

			<div data-vjs-player>
				<div className='video-js-background' />
				<video id={id} className={`video-js ${classNamePlayer}`} playsInline />
			</div>
			<div className={cn("absolute bottom-12 right-1 z-[99]", data.cards.length && "!bottom-[105px]")}>
				<ControlButtons
					onChat={handleChatNavigation}
					onShare={handleShare}
					onToggleApartments={() => toggleSidebar("building")}
					volumePanelRef={volumePanelRef}
					setIsOpenModalLocation={setIsOpenModalLocation}
				/>
			</div>

			<PlayerAuthor
				data={data}
				player={playerRef.current}
				setInteractiveIsOpen={val => setUiState(prev => ({ ...prev, interactiveOpen: val }))}
				className={`top-4 left-4 z-[99] max-w-[300px] md3:max-w-[200px]`}
				type='short'
			/>
			<Maybe condition={objectData.buildingDiscounts?.length || objectData.present}>
				<div className='absolute top-4 right-4 z-[99] flex flex-col gap-2 items-end'>
					<Maybe condition={objectData.buildingDiscounts?.length}>
						{/* <TagsDiscounts
							discounts={objectData.buildingDiscounts}
							is_building
							by_price={objectDataMinValue?.bd_price}
							by_area={objectDataMinValue?.min_area}
						/> */}
						<TagDiscountSecondary>🔥 Скидка</TagDiscountSecondary>
					</Maybe>

					<Maybe condition={objectData.present}>
						<TagPresents
							className='h-[26px]'
							dataMainGifts={isArray(objectData.main_gifts) ? objectData.main_gifts.filter(item => item) : []}
							dataSecondGifts={isArray(objectData.second_gifts) ? objectData.second_gifts.filter(item => item) : []}
							title='Есть подарок'
						/>
					</Maybe>
				</div>
			</Maybe>

			<div className='absolute left-4 bottom-[20px] z-40 w-full' data-short-player-content>
				{showInteractiveButton && <Button {...interactiveButtonProps} />}
				{data.tags?.length > 0 && <div className='mb-4 flex gap-1.5 flex-wrap max-w-[80%]'>{tagsContent}</div>}
				<PlayerTitle
					title={data.name}
					className='!static !w-[80%]'
					building_id={objectData.id}
					building_name={objectData.title}
					building_image={objectData.images?.[0] || ""}
					type='short'
				/>

				<PlayerCards data={data} onClick={() => toggleSidebar("apartments")} />
			</div>

			<InteractiveElement
				data={data}
				condition={uiState.interactiveOpen}
				set={val => setUiState(prev => ({ ...prev, interactiveOpen: val }))}
				objectData={objectData}
			/>

			<div className='pointer-events-none short-player-status'>
				<PlaybackIndicator isPlaying={uiState.videoPlay} />
			</div>
			<Maybe condition={objectData.geo}>
				<LocationModal condition={isOpenModalLocation} set={setIsOpenModalLocation} geo={objectData.geo} />
			</Maybe>
			<ShareModal
				condition={uiState.shareModal}
				set={val => setUiState(prev => ({ ...prev, shareModal: val }))}
				title='Поделиться Short'
				url={shareUrl}
			/>

			{renderMobileModals}
		</div>
	);
};
