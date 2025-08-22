import cn from "classnames";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Navigation, Virtual } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import videojs from "video.js";
import "video.js/dist/video-js.css";

import { BASE_URL, ROLE_BUYER, RoutesPath } from "@/constants";

import { getDataRequest, sendPostRequest } from "@/api";

import { getSrcImage, isEmptyArrObj, isIOS, timeToSeconds } from "@/helpers";

import { checkAuthUser, getIsDesktop, getUserInfo } from "@/redux";

import { Modal, ModalWrapper, NavBtnNext, NavBtnPrev, ShortPlayer, Spinner, Tag } from "@/ui";
import { IconArrow, IconClose, IconPause, IconPlay, IconShareArrow } from "@/ui/Icons";

import { Button } from "@/uiForm";

import { RecordViewing, SelectAccLogModal, ShareModal } from "@/ModalsMain";

import "../../styles/components/video-player.scss";

import PlayerAuthor from "./components/PlayerAuthor";
import PlayerTitle from "./components/PlayerTitle";
import customTimeDisplay from "./components/customTimeDisplay";
import { playerLocalRu } from "./components/playerLocalRu";
import timeCodes from "./components/timeCodes";
import timeTooltip from "./components/timeTooltip";

const checkAutoplaySupport = async () => {
	try {
		const video = document.createElement("video");
		video.src =
			"data:video/mp4;base64,AAAAFGZ0eXBpc29tAAACAGlzb21pc28yYXZjMW1wNDEAAAAIZnJlZQAABtRtZGF0AAAAMgAAAAYAIAgIAQAAAAAAABQIAgEIAgEIBgEABgEABgQABgQABgQABgQABgQABgQABgQAAAAAAACQRkRJUj8AAAAAABwIAgEIAgEIBgEABgEABgQABgQABgQABgQABgQABgQABgQAAAAAAAAAAAAA//hETURPPwAAAAAABAAIAQEIAQEIBQEABQEABQQABQQABQQABQQABQQABQQABQQAAAAAAAARGUkNSAgAAAAAABwIAgEIAgEIBgEABgEABgQABgQABgQABgQABgQABgQABgQAAAAAAAAAAAAA//hESURLFAAAAAAABAAIAQEIAQEIBQEABQEABQQABQQABQQABQQABQQABQQABQQAAAAAAAARGVJOQgAAAAAAAQIAgEIAgEIBgEABgEABgQABgQABgQABgQABgQABgQABgQAAAAAAAAAAAAA//hETENMUgAAAAAAAQIAgEIAgEIBgEABgEABgQABgQABgQABgQABgQABgQABgQAAAAAAAAAAAAA";
		video.muted = false;
		const playPromise = video.play();

		if (playPromise !== undefined) {
			await playPromise;
			video.pause();
			return true;
		}
		return false;
	} catch (error) {
		return false;
	}
};

const splitIntoChunks = (array, chunkSize) => {
	const chunks = [];
	for (let i = 0; i < array.length; i += chunkSize) {
		chunks.push(array.slice(i, i + chunkSize));
	}
	return chunks;
};

export const ShortsModal = ({ condition, set, data, startData = null, startIndex = 0, dynamicShortsParams }) => {
	const isDesktop = useSelector(getIsDesktop);

	const [dynamicShorts, setDynamicShorts] = useState(null);
	const [dynamicShortsLoading, setDynamicShortsLoading] = useState(false);

	const fetchAllData = async urlChunks => {
		try {
			if (!urlChunks.length) return;
			const requests = urlChunks.map(chunk => getDataRequest(`/api/video-url`, { url: chunk }));
			const responses = await Promise.all(requests);
			return responses.flatMap(res => res.data);
		} catch (error) {
			console.error("Ошибка при запросе:", error);
			throw error;
		}
	};

	useEffect(() => {
		if (!condition || !dynamicShortsParams) return;
		setDynamicShortsLoading(true);
		const fetchData = async () => {
			const allUrls = await sendPostRequest(dynamicShortsParams.url, dynamicShortsParams.params).then(res => res.data);
			const urlChunks = splitIntoChunks(allUrls.shorts, 65);
			const results = await fetchAllData(urlChunks);

			const idsFromData = data.map(item => item.id);

			const result = [...data, ...results.filter(item => !idsFromData.includes(item.id))];

			setDynamicShorts(result);
			setDynamicShortsLoading(false);
		};
		fetchData();
	}, [condition]);

	return (
		<ModalWrapper condition={condition}>
			<Modal
				options={{
					overlayClassNames: "_full",
					modalClassNames: `!bg-[#0e1319] ${!isDesktop ? "HeaderSticky !pb-0" : ""}`,
					modalContentClassNames: "!p-0"
				}}
				set={value => {
					if (!value) {
						set(value);
						setDynamicShorts(null);
						setDynamicShortsLoading(false);
					}
				}}
				condition={condition}
				closeBtn={false}
				ModalHeader={() => (
					<>
						{!isDesktop && (
							<div className='ModalHeader px-4 py-3 !bg-[#0e1319] !shadow-none'>
								<button
									type='button'
									onClick={() => {
										set(false);
										setDynamicShorts(null);
										setDynamicShortsLoading(false);
									}}>
									<IconArrow className='rotate-180 fill-white' width={32} height={32} />
								</button>
							</div>
						)}
					</>
				)}>
				<div className='!px-8 !pt-8 !pb-0 md1:!px-0 md1:!pt-0'>
					<Shorts
						data={dynamicShorts || data}
						startData={startData}
						startIndex={startIndex}
						condition={condition}
						closeBtnOnClick={() => {
							set(false);
						}}
					/>

					{/* {!!condition && (
						<>
							{(dynamicShortsParams || dynamicShortsLoading) && !dynamicShorts?.length ? (
								<div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'>
									<Spinner className='!border-white !border-b-[transparent]' style={{ "--size": "65px" }} />
								</div>
							) : (
								<>
									<Shorts
										data={dynamicShorts || data}
										startData={startData}
										startIndex={startIndex}
										condition={condition}
										closeBtnOnClick={() => {
											set(false);
										}}
									/>
								</>
							)}
						</>
					)} */}
				</div>
			</Modal>
		</ModalWrapper>
	);
};

let shortReadyNext = true;

export const Shorts = ({ data = [], startIndex = 0, single = false, closeBtnOnClick = false }) => {
	const isDesktop = useSelector(getIsDesktop);
	const swiperRef = useRef(null);
	const modalContainerRef = useRef(null);
	const [currentIndex, setCurrentIndex] = useState(0);
	const [initShortIds, setInitShortIds] = useState([]);

	const handleNavigation = useCallback(direction => {
		if (!shortReadyNext || !swiperRef.current?.swiper) return;

		shortReadyNext = false;
		const swiper = swiperRef.current.swiper;

		if (direction === "prev" && !swiper.isBeginning) {
			swiper.slidePrev();
		} else if (direction === "next" && !swiper.isEnd) {
			swiper.slideNext();
		}

		setTimeout(() => {
			shortReadyNext = true;
		}, 500);
	}, []);

	const handlePrev = useCallback(() => handleNavigation("prev"), [handleNavigation]);
	const handleNext = useCallback(() => handleNavigation("next"), [handleNavigation]);

	const handleSlideChange = useCallback(
		async swiper => {
			const activeIndex = swiper.activeIndex;
			setCurrentIndex(activeIndex);

			const activeId = data[activeIndex]?.id;
			const prevId = data[activeIndex - 1]?.id;
			const nextId = data[activeIndex + 1]?.id;

			setInitShortIds([activeId, prevId, nextId].filter(Boolean));
			const canAutoplay = await checkAutoplaySupport();

			swiper.slides.forEach(slide => {
				const video = slide.querySelector("video");
				if (!video) return;
				const player = videojs.getPlayer(video.id);

				if (!player) return;
				const isActiveSlide = +slide.getAttribute("data-swiper-slide-index") === swiper.activeIndex;

				if (isActiveSlide) {
					player.ready(() => {
						const volume = parseFloat(localStorage.getItem("video_volume") || "0.5");
						player.volume(volume);
						if (isIOS && !canAutoplay) {
							player.muted(true);
						}

						player.play().catch(error => {
							console.log(error);
						});
					});
				} else {
					player.pause();
				}
			});
		},
		[data]
	);

	const onHandlerClick = useCallback((swiper, e) => {
		if (isDesktop) return;
		if (e.target.closest(".vjs-control-bar") || e.target.closest(".vjs-volume-panel") || e.target.closest("[data-short-player-content]")) return;

		const currentSlide = swiper.slides.find(item => +item.getAttribute("data-swiper-slide-index") === swiper.activeIndex);

		if (!currentSlide) return;

		const videoElement = currentSlide.querySelector("video");
		if (!videoElement) return;

		const player = videojs.getPlayer(videoElement.id);

		if (player) {
			player.paused() ? player.play() : player.pause();
		}
	}, []);

	useEffect(() => {
		const container = modalContainerRef.current;
		if (!container) return;

		const handleWheel = event => {
			if (!shortReadyNext) return;
			if (event.target.closest(".video-player-sidebar-dynamic")) return;

			shortReadyNext = false;

			if (event.deltaY > 0) {
				swiperRef.current?.swiper?.slideNext();
			} else {
				swiperRef.current?.swiper?.slidePrev();
			}

			setTimeout(() => {
				shortReadyNext = true;
			}, 500);
		};

		container.addEventListener("wheel", handleWheel, { passive: false });
		return () => container.removeEventListener("wheel", handleWheel);
	}, []);

	return (
		<div ref={modalContainerRef} className='shorts-container'>
			<div className='video-player shorts-player shorts-player-controls'>
				<Swiper
					modules={[Navigation, Virtual]}
					ref={swiperRef}
					virtual={{
						enabled: true,
						addSlidesAfter: 0
					}}
					slidesPerView={1}
					spaceBetween={16}
					grabCursor
					keyboard={{
						enabled: true,
						onlyInViewport: true
					}}
					direction='vertical'
					speed={isDesktop ? 500 : 220}
					className='h-full mmd1:pl-[385px] mmd1:-ml-[385px]'
					onSlideChange={handleSlideChange}
					onClick={onHandlerClick}
					onInit={swiper => {
						const initialIndex = startIndex >= 0 && startIndex < data.length ? startIndex : 0;
						swiper.slideTo(initialIndex, 0);
						setTimeout(() => {
							handleSlideChange(swiper);
						}, 300);
					}}
					touchStartPreventDefault={false}
					touchReleaseOnEdges
					resistanceRatio={0.7}
					touchAngle={45}
					longSwipesMs={300}
					breakpoints={{
						1222: {
							touchEventsTarget: "container",
							simulateTouch: false
						}
					}}>
					{data.map((card, index) => (
						<SwiperSlide
							key={index}
							virtualIndex={index}
							className={cn("shorts-player-slide", initShortIds.includes(card.id) && "_init")}>
							<ShortPlayer data={card} />
						</SwiperSlide>
					))}
				</Swiper>

				{!single && isDesktop && (
					<>
						<button
							type='button'
							onClick={closeBtnOnClick}
							className='!w-[52px] !h-[52px] !absolute top-0 -right-[60px] bg-white rounded-full flex-center-all shadow-primary'>
							<IconClose width={28} height={28} className='fill-[#828282]' />
						</button>
						<NavBtnPrev
							onClick={handlePrev}
							disabled={currentIndex === 0}
							className='!w-[52px] !h-[52px] slider-btn-prev !absolute bottom-[84px] -right-[60px]'
							classnameicon='!-rotate-90 fill-[#828282] w-[28px] h-[28px]'
							aria-label='Previous video'
						/>
						<NavBtnNext
							onClick={handleNext}
							disabled={currentIndex === data.length - 1}
							className='!w-[52px] !h-[52px] slider-btn-next !absolute bottom-4 -right-[60px]'
							classnameicon='!rotate-90 fill-[#828282] w-[28px] h-[28px]'
							aria-label='Next video'
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

export const VideoBlock = ({ data, className = "", classNameVideo, onToggleVideo, clickFullscreen = false }) => {
	const playerRef = useRef(null);
	const poster = getPosterVideo(data);

	return (
		<div className={className}>
			<VideoPlayer
				refElement={playerRef}
				data={data}
				variant='default'
				className={cn("w-full h-full", classNameVideo)}
				autoplay={false}
				poster={poster}
				onToggleVideo={onToggleVideo}
				clickFullscreen={clickFullscreen}
			/>
		</div>
	);
};

export const VideoPlayer = ({
	condition = true,
	data,
	variant = "default",
	className = "",
	autoplay = true,
	poster = "",
	children,
	mute = true,
	refElement,
	visibleControls = true,
	childrenVideo,
	classNameButtonPlay,
	onToggleVideo,
	clickFullscreen = false,
	objectData
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
		language: "ru",
		poster: poster,
		playbackRates: [0.5, 0.75, 1, 1.5, 2],
		sources: [
			{
				src: data.video_url_test || `${BASE_URL}${data.video_url}`,
				type: "video/mp4"
			}
		],
		userActions: {
			click: function () {
				if (!isDesktop) return;
				if (this.paused()) {
					this.play()
						.then(() => {
							if (clickFullscreen && !this.isFullscreen()) {
								this.requestFullscreen();
							}
						})
						.catch(error => {
							console.error("Ошибка воспроизведения:", error);
						});
				} else {
					this.pause();
				}
			}
		}
	};

	useEffect(() => {
		if (playerRef.current && refElement) {
			refElement.current = playerRef.current;
		}
	}, [playerRef.current]);

	videojs.addLanguage("ru", playerLocalRu);

	useEffect(() => {
		if (condition && !playerRef.current) {
			const videoElement = document.createElement("video-js");
			videoRef.current.appendChild(videoElement);
			const player = (playerRef.current = videojs(videoElement, OPTIONS));
			setElement(videoElement);
			const timeUpdateArr = [];
			player.volume(localStorage.getItem("video_volume") || 0.5);

			if (variant !== "default") {
				timeCodes(player, data.timeCodes, timeUpdateArr);
			}
			customTimeDisplay(player, timeUpdateArr, visibleControls);
			if (!visibleControls && player) {
				const progressControl = player.controlBar.progressControl;
				if (progressControl) {
					progressControl.dispose();
				}
			}
			timeTooltip(player, data.timeCodes);

			player.on("timeupdate", () => {
				timeUpdateArr.forEach(item => item());
				setTime(player.currentTime());
			});
			player.on("volumechange", () => {
				localStorage.setItem("video_volume", player.muted() ? 0 : player.volume());
			});
			player.on("useractive", function () {
				setIsActivePanel(true);
			});

			player.on("userinactive", function () {
				setIsActivePanel(false);
			});
			player.on("play", () => {
				onToggleVideo?.("play");
			});
			player.on("pause", () => {
				onToggleVideo?.("pause");
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
			if (event.target.classList.contains("video-js") || event.target.classList.contains("vjs-tech")) {
				if (playerRef.current.paused()) {
					playerRef.current.play().catch(error => {
						console.error("Ошибка воспроизведения:", error);
					});
				} else {
					playerRef.current.pause();
				}
				if (!playerRef.current.isFullscreen()) {
					playerRef.current.requestFullscreen();
				}
			}
		};

		videoEl.addEventListener("touchstart", handleTap);

		return () => {
			videoEl.removeEventListener("touchstart", handleTap);
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

	if (variant === "default") {
		return (
			<div
				className={`video-player video-player-default ${className}`}
				style={{ "--bg-image": `url('${BASE_URL}/api/video/${data.id}/preview/0')` }}>
				<div className='video-js-background video-js-background--video' />
				<div ref={videoRef} className='h-full' />
				{!playerRef.current?.hasStarted_ && (
					<button
						type='button'
						className={cn(
							"absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex items-center justify-center z-[9999]",
							classNameButtonPlay
						)}
						onClick={() => playerRef.current?.play()}>
						<IconPlay className='fill-white' width={46} height={46} />
					</button>
				)}
			</div>
		);
	}

	if (variant === "page") {
		return (
			<div className={`video-player ${className}`}>
				<div className='self-start overflow-hidden rounded-[20px]'>
					<div className='bg-white rounded-[20px] overflow-hidden'>
						<div ref={videoRef} className='relative md1:fixed md1:top-[50px] md1:left-0 md1:w-full z-[99]'>
							{(!playerRef.current?.hasStarted_ || (!isDesktop && isActivePanel) || playerRef.current?.paused()) && (
								<button
									type='button'
									className={cn(
										"pointer-events-none absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex items-center justify-center z-[9999]",
										classNameButtonPlay
									)}>
									{playerRef.current?.paused() ? (
										<IconPlay className='fill-white' width={46} height={46} />
									) : (
										<IconPause className='fill-white' width={46} height={46} />
									)}
								</button>
							)}

							{userInfo?.role?.id === ROLE_BUYER.id &&
								playerRef.current &&
								!isEmptyArrObj(data.interactiveEl) &&
								Boolean(playerRef.current.currentTime() >= timeToSeconds(data.interactiveEl.time)) && (
									<Button onClick={() => setInteractiveIsOpen(true)} size='34' className='absolute bottom-[64px] right-4 z-10'>
										{data.interactiveEl.type.label}
									</Button>
								)}
							<InteractiveElement data={data} condition={interactiveIsOpen} set={setInteractiveIsOpen} />
						</div>
						<div className='mt-4 order-1 md1:mt-[calc(56.25%+0px)]'>
							<div className='flex items-start gap-6 justify-between px-4 pb-4 shadow-primary md1:flex-col'>
								<div className='flex-grow'>
									{Boolean(data.building_name) && (
										<Link to={`${RoutesPath.building}${objectData.id}`} className='mb-2 flex items-center gap-2'>
											<span className='blue-link font-medium'>{data.building_name}</span>
										</Link>
									)}
									<PlayerTitle title={data.name} className='!static !w-full' classNameTitle='title-3' />
									{data.tags.length > 0 && (
										<div className='mt-3 mb-6 flex gap-2 flex-wrap'>
											{data.tags.map((item, index) => (
												<Tag size='small' color='default' key={index}>
													{item.name}
												</Tag>
											))}
										</div>
									)}
									<PlayerAuthor
										data={data}
										player={videojs.getPlayer(element?.id)}
										setInteractiveIsOpen={setInteractiveIsOpen}
										className='relative mt-4'
									/>
								</div>
								<Button
									variant='secondary'
									size='32'
									className='flex gap-2 items-center text-blue'
									onClick={() => setIsShareModal(true)}>
									<IconShareArrow className='fill-blue' width={16} height={16} />
									Поделиться видео
								</Button>
								<ShareModal
									condition={isShareModal}
									set={setIsShareModal}
									title='Поделиться видео'
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

export const InteractiveElement = ({ data, condition, set, objectData }) => {
	const authUser = useSelector(checkAuthUser);

	if (!data.interactiveEl || isEmptyArrObj(data.interactiveEl)) return;

	return authUser ? (
		<>
			{data.interactiveEl.type.value === "record-viewing" && (
				<ModalWrapper condition={condition}>
					<RecordViewing
						condition={condition}
						set={set}
						type='building'
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
	);
};
