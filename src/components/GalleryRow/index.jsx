import { GetDescrHTML } from "..";
import cn from "classnames";
import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { v4 as uuidv4 } from "uuid";
import videojs from "video.js";

import { getSrcImage, isNumber, isString } from "@/helpers";

import { getIsDesktop } from "@/redux";

import {
	BtnClose,
	FullscreenBtn,
	Maybe,
	Modal,
	ModalWrapper,
	NavBtnNext,
	NavBtnPrev,
	SliderPagination,
	Spinner,
	TabsBody,
	TabsNav,
	TabsTitle
} from "@/ui";
import { IconPlay } from "@/ui/Icons";

import { VideoBlock, getPosterVideo } from "@/ModalsMain";

import { videoToggleControls } from "../GalleryPhoto";

import styles from "./GalleryRow.module.scss";

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
		imageFit = "cover",
		mode = "default",
		galleryVariant
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
			slidesPerView='auto'
			modules={[Navigation]}
			navigation={{
				prevEl: ".slider-btn-prev",
				nextEl: ".slider-btn-next"
			}}
			spaceBetween={4}
			speed={500}
			noSwiping
			noSwipingSelector='.vjs-control'
			ref={swiperRef}
			onSlideChange={() => onSlideChangeHandler()}
			allowTouchMove={true}
			observeParents={true}
			observer={true}
			preventClicks
			preventClicksPropagation
			onReachEnd={swiper => {
				onSlideChangeHandler(swiper.activeIndex + 1);
			}}
			className='w-full cursor-pointer gallery-target-modal overflow-visible'
			style={{ height: galleryHeight }}>
			{totalSlidesData.map((galleryItem, galleryItemIndex) => {
				const currentGroupIndex = dataGallery.findIndex(i => (i.images || i.videos).find(k => k === galleryItem));

				if (isString(galleryItem)) {
					return (
						<SwiperSlide
							data-gallery-group-index={currentGroupIndex}
							className={`${styles.GalleryRowSlide} ${mode === "modal" ? styles.GalleryRowSlideFull : ""}`}
							key={galleryItemIndex}>
							<div
								className='w-full h-full'
								onClick={() => {
									if (mode === "default") {
										setIsOpenModal(isNumber(galleryItemIndex) ? galleryItemIndex : false);
									}
								}}>
								<div className='flex flex-col h-full'>
									<img
										src={getSrcImage(galleryItem)}
										alt=''
										className={`${styles.GalleryRowImage} ${imageFit === "contain" ? "!object-contain" : ""}   
                                 ${mode === "modal" && isDesktop ? "!object-contain bg-dark" : ""}`}
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
							className={`${styles.GalleryRowSlide} ${mode === "modal" ? styles.GalleryRowSlideFull : ""}`}
							key={galleryItemIndex}>
							{mode === "default" && (
								<div
									className='w-full h-full'
									onClick={() => {
										setIsOpenModal(isNumber(galleryItemIndex) ? galleryItemIndex : false);
									}}>
									<div className='flex flex-col h-full relative'>
										<img
											src={getPosterVideo(currentVideo)}
											className={`${styles.GalleryRowImage} ${imageFit === "contain" ? "!object-contain" : ""}
                                    ${mode === "modal" && isDesktop ? "!object-contain bg-dark" : ""}
                                    `}
											width={totalSlides > 1 ? 760 : null}
											alt={currentVideo?.name}
										/>
										<div className={styles.GalleryRowVideoBadge}>
											<div className={styles.GalleryRowVideoBadgeCircle}>
												<IconPlay className='fill-dark' width={22} height={22} />
											</div>
											<span className='mt-2 text-center'>Смотреть видео</span>
										</div>
									</div>
								</div>
							)}
							{mode === "modal" && <VideoBlock data={currentVideo} className={styles.GalleryRowVideo} />}
						</SwiperSlide>
					);
				}
			})}
			{visiblePagination && (
				<SliderPagination current={activeSlideIndex} total={totalSlides} className={galleryVariant === "top" ? "md1:!bottom-10" : ""} />
			)}

			{isDesktop && (
				<>
					<NavBtnPrev centery='true' disabled className='slider-btn-prev' />
					<NavBtnNext centery='true' className='slider-btn-next' />
				</>
			)}
			{fullscreen && (
				<FullscreenBtn
					className='!top-auto bottom-4'
					onClick={() => {
						videoToggleControls(swiperRef.current.swiper, "off", setVisiblePagination);
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
	imageFit = "cover",
	tabsMobile = true,
	galleryVariant = "default",
	galleryType = "thumbs"
}) => {
	const modalContentRef = useRef(null);
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
		tabsMobile
	};

	return (
		<div className='min-w-0 w-full overflow-hidden rounded-[20px]'>
			<GalleryRowLayout options={{ ...options, galleryVariant }} />
			<ModalWrapper condition={isNumber(isOpenModal)}>
				<Modal
					options={{
						overlayClassNames: "_full",
						modalContentClassNames: "!p-8 !pt-0 !pb-0 md1:!px-0 bg-[#0e1319] flex flex-col items-center"
					}}
					closeBtn={false}
					modalContentRef={modalContentRef}
					set={setIsOpenModal}
					condition={isNumber(isOpenModal)}>
					<GalleryModal
						modalContentRef={modalContentRef}
						data={dataGallery}
						setIsOpenModal={setIsOpenModal}
						condition={isOpenModal}
						imageFit={imageFit}
						type={galleryType}
						set={setIsOpenModal}
					/>
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
	mode = "default",
	galleryHeight = 420,
	isOpenModal = false,
	setIsOpenModal = () => {},
	imageFit = "cover",
	tabsMobile = true
}) => {
	const [activeTabIndex, setActiveTabIndex] = useState(0);

	const swiperRef = useRef(null);

	const [visiblePagination, setVisiblePagination] = useState(true);

	const onSlideChangeHandler = e => {
		const swiperEl = swiperRef.current.swiper;
		const currentEl = swiperEl.slides[swiperEl.activeIndex];

		setActiveTabIndex(+currentEl.dataset.galleryGroupIndex);
		videoToggleControls(swiperEl, "auto", setVisiblePagination);
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
		videoToggleControls(swiperRef.current.swiper, "off", setVisiblePagination);
		swiperRef.current.swiper.slideTo(activeIndex, 0);
	}, []);

	const currentTag = {
		value: data[activeTabIndex]?.distance || data[activeTabIndex]?.price,
		prefix: data[activeTabIndex]?.distance ? "м²" : data[activeTabIndex]?.price ? "₽" : ""
	};

	if (mode === "default") {
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

				<TabsBody className='min-w-0 overflow-hidden relative'>
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
						<div className='mt-3 md1:!mx-4'>
							<div className='cut cut-4'>
								<GetDescrHTML data={data[activeTabIndex]?.description} />
							</div>
							<button type='button' className='blue-link mt-3' onClick={() => setIsOpenModal(true)}>
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

	if (mode === "modal") {
		return (
			<div className='container-desktop !max-w-[1600px]'>
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

				<div className='grid mmd1:grid-cols-[1fr_minmax(auto,350px)] gap-x-5'>
					<TabsBody className='min-w-0  overflow-hidden'>
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
								mode
							}}
						/>
						{data[activeTabIndex]?.description && (
							<div className='mt-3 md1:!mx-4'>
								<GetDescrHTML data={data[activeTabIndex]?.description} />
							</div>
						)}
					</TabsBody>
					<div className={`md1:!mx-4 ${tabsMobile ? "mt-6" : ""} md1:border-t md1:pt-4 md1:border-primary700 md1:mt-4`}>{sidebar}</div>
				</div>
			</div>
		);
	}
};

export const GalleryModal = ({ data, imageFit, condition, modalContentRef, set }) => {
	const isDesktop = useSelector(getIsDesktop);

	const galleryModalId = useRef(`gallery-modal-id-${uuidv4()}`).current;
	const [slides, setSlides] = useState([]);
	const [startSlide, setStartSlide] = useState(null);
	const [isLoading, setIsLoading] = useState(true);
	const [activeSlide, setActiveSlide] = useState(null);
	const isInitialRender = useRef(true);
	const scrollTimer = useRef(null);

	useEffect(() => {
		if (!isNumber(condition)) return;

		const slidesNew = data
			.reduce((acc, item) => {
				return [
					...acc,
					...(item?.images?.map(item => ({ data: item, type: "image" })) || []),
					...(item?.videos?.map(item => ({ data: item, type: "video" })) || [])
				];
			}, [])
			.map((item, index) => ({ ...item, index }));

		setSlides(slidesNew);
		setTimeout(() => {
			setStartSlide(slidesNew.find(item => item.index === condition));
			setIsLoading(false);
		}, 1000);
	}, [condition]);

	useEffect(() => {
		if (!startSlide) return;
		const slideEl = modalContentRef.current.querySelector(`.${galleryModalId}-slide-${startSlide.index}`);
		if (!slideEl) return;

		slideEl.scrollIntoView({
			block: "start",
			inline: "nearest"
		});
		videoToggle(startSlide.index);
	}, [startSlide]);

	const videoToggle = (index, status = "auto") => {
		const slideEl = modalContentRef.current.querySelector(`.${galleryModalId}-slide-${index}`);
		if (slideEl && status === "auto") {
			const videoElement = slideEl.querySelector("video");
			if (videoElement) {
				const player = videoElement ? videojs.getPlayer(videoElement.id) : null;
				if (player) {
					player.volume(0.2);
					setTimeout(() => {
						player.play();
					}, 200);
				}
			}
		}

		const otherSlides = slides.filter(item => item.index !== index && item.type === "video");
		const otherSlidesEls = otherSlides.map(item => modalContentRef.current.querySelector(`.${galleryModalId}-slide-${item.index}`));

		otherSlidesEls.forEach(item => {
			const videoElement = item.querySelector("video");
			if (videoElement) {
				const player = videoElement ? videojs.getPlayer(videoElement.id) : null;
				if (player && !player.paused()) {
					player.pause();
				}
			}
		});
	};

	const handleVideoPlayback = slideIndex => {
		slides.forEach(slide => {
			if (slide.type === "video") {
				const videoEl = modalContentRef.current.querySelector(`.${galleryModalId}-slide-${slide.index} video`);
				if (videoEl) {
					const player = videojs.getPlayer(videoEl.id);
					if (player) {
						if (slide.index === slideIndex) {
							const volume = isInitialRender.current ? localStorage.getItem("video_volume") || 0.2 : 0;
							player.volume(volume);
							player.play().catch(e => console.log("Play error:", e));
						} else if (!player.paused()) {
							player.pause();
						}
					}
				}
			}
		});
		if (isInitialRender.current) {
			scrollTimer.current = setTimeout(() => {
				isInitialRender.current = false;
			}, 500);
		}
	};

	useEffect(() => {
		return () => {
			if (scrollTimer.current) {
				clearTimeout(scrollTimer.current);
			}
		};
	}, []);

	useEffect(() => {
		if (!modalContentRef.current || !slides.length) return;

		const handleIntersection = entries => {
			entries.forEach(entry => {
				const containerRect = modalContentRef.current.getBoundingClientRect();
				const containerTop = containerRect.top;
				const containerHeight = containerRect.height;

				const slideRect = entry.boundingClientRect;
				const slideTop = slideRect.top;
				const slideHeight = slideRect.height;

				const visibleTopRatio = (containerTop + containerHeight * 0.4 - slideTop) / slideHeight;

				if (visibleTopRatio > 0 && visibleTopRatio <= 1) {
					const slideIndex = parseInt(entry.target.dataset.slideIndex, 10);
					setActiveSlide(slideIndex);
					handleVideoPlayback(slideIndex);
				}
			});
		};

		const observer = new IntersectionObserver(handleIntersection, {
			root: modalContentRef.current,
			threshold: buildThresholdList(),
			rootMargin: "-40% 0px -40% 0px"
		});

		function buildThresholdList() {
			const thresholds = [];
			for (let i = 0; i <= 1.0; i += 0.01) {
				thresholds.push(i);
			}
			return thresholds;
		}

		slides.forEach((_, index) => {
			const slide = modalContentRef.current.querySelector(`.${galleryModalId}-slide-${index}`);
			if (slide) {
				slide.dataset.slideIndex = index;
				observer.observe(slide);
			}
		});

		return () => observer.disconnect();
	}, [slides, galleryModalId]);

	const scrollToSlide = index => {
		if (index < 0 || index >= slides.length) return;

		const slideEl = modalContentRef.current.querySelector(`.${galleryModalId}-slide-${index}`);
		if (!slideEl) return;

		slideEl.scrollIntoView({
			behavior: "smooth",
			block: "start",
			inline: "nearest"
		});

		setActiveSlide(index);
		handleVideoPlayback(index);

		if (index === slides.length - 1) {
			setTimeout(() => {
				const slideRect = slideEl.getBoundingClientRect();
				const containerRect = modalContentRef.current.getBoundingClientRect();

				if (slideRect.bottom > containerRect.bottom) {
					slideEl.scrollIntoView({
						behavior: "smooth",
						block: "end",
						inline: "nearest"
					});
				}
			}, 100);
		}
		if (index === 0) {
			setTimeout(() => {
				slideEl.scrollIntoView({
					behavior: "smooth",
					block: "start",
					inline: "nearest"
				});
			}, 100);
		}
	};

	const handleNextSlide = () => {
		if (activeSlide < slides.length - 1) {
			scrollToSlide(activeSlide + 1);
		} else {
			setActiveSlide(slides.length - 1);
			handleVideoPlayback(slides.length - 1);
		}
	};

	const handlePrevSlide = () => {
		if (activeSlide > 0) {
			scrollToSlide(activeSlide - 1);
		}
	};

	useEffect(() => {
		const handleKeyDown = e => {
			if (e.key === "ArrowUp") handlePrevSlide();
			if (e.key === "ArrowDown") handleNextSlide();
		};

		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, [activeSlide, slides.length]);

	return (
		<div className={cn("flex flex-col items-center", isLoading && "h-full")} id={galleryModalId}>
			<div className={cn("max-w-[1200px] mmd1:w-[1200px] flex justify-center relative", isLoading && "h-full")}>
				{isLoading && <Spinner className='!border-white !border-b-[transparent] m-auto' style={{ "--size": "65px" }} />}
				<div
					className={cn(
						"flex flex-col gap-3 justify-center pt-6 pb-4 md1:!pt-14 md1:gap-2 md1:pb-2",
						isLoading && "absolute inset-0 opacity-0 invisible"
					)}>
					{slides.map(item => {
						return (
							<div key={item.index}>
								{item.type === "image" && (
									<img
										src={getSrcImage(item.data)}
										alt=''
										className={cn(
											"h-full w-full max-h-[650px]",
											styles.GalleryRowImage,
											imageFit === "contain" && "!object-contain min-h-[750px]",
											isDesktop && "bg-[#0e1319]",
											`${galleryModalId}-slide-${item.index}`
										)}
									/>
								)}
								{item.type === "video" && (
									<VideoBlock
										data={item.data}
										className={`${galleryModalId}-slide-${item.index}`}
										onToggleVideo={value => {
											if (value === "play") {
												videoToggle(item.index, "off");
											}
										}}
										clickFullscreen
									/>
								)}
							</div>
						);
					})}
				</div>
				<Maybe condition={set && !isDesktop}>
					<BtnClose className='fixed top-2 right-2' onClick={() => set(false)} />
				</Maybe>
				<Maybe condition={isDesktop}>
					<div className='flex flex-col justify-end gap-4 z-10 sticky top-0 right-0 px-3 pt-6 pb-4 h-full-vh'>
						<div className='flex flex-col justify-between h-full'>
							<Maybe condition={set}>
								<BtnClose onClick={() => set(false)} size={46} sizeIcon={24} />
							</Maybe>
							<Maybe condition={slides.length > 1 && !isLoading}>
								<div className='flex flex-col gap-3 self-end'>
									<NavBtnPrev
										onClick={handlePrevSlide}
										disabled={activeSlide === 0}
										className='!w-[46px] !h-[46px]'
										classnameicon='!-rotate-90 fill-[#828282] w-[24px] h-[24px]'
									/>
									<NavBtnNext
										onClick={handleNextSlide}
										disabled={activeSlide === slides.length - 1}
										className='!w-[46px] !h-[46px]'
										classnameicon='!rotate-90 fill-[#828282] w-[24px] h-[24px]'
									/>
								</div>
							</Maybe>
						</div>
					</div>
				</Maybe>
			</div>
		</div>
	);
};
