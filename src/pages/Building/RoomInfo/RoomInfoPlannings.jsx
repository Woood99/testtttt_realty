import React, { memo, useContext, useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

import { getIsDesktop } from "@/redux";

import { getApartments } from "../../../api/Building/getApartments";
import { getPlannings } from "../../../api/Building/getPlannings";
import PaginationPage from "../../../components/Pagination";
import { RoutesPath } from "../../../constants/RoutesPath";
import { BuildingApartsContext, BuildingContext } from "../../../context";
import { appendParams } from "../../../helpers/appendParams";
import CardScheme from "../../../ui/CardScheme";
import Modal from "../../../ui/Modal";
import ModalWrapper from "../../../ui/Modal/ModalWrapper";
import { NavBtnNext, NavBtnPrev } from "../../../ui/NavBtns";
import Spinner from "../../../ui/Spinner";
import Button from "../../../uiForm/Button";
import RoomInfoCard from "../RoomInfoCard";

import LayoutBtn from "./LayoutBtn";
import styles from "./RoomInfo.module.scss";

const RoomInfoPlannings = memo(({ data, onClick, activeRoomId }) => {
	const { id } = useContext(BuildingContext);

	const planningsRef = useRef(null);
	const isDesktop = useSelector(getIsDesktop);
	const sortBy = useSelector(state => state.buildingApartFilter.sortBy);

	const optionsStyle = {
		"--modal-space": "0px",
		"--modal-height": "var(--vh)",
		"--modal-width": isDesktop ? "1150px" : "100%"
	};

	const apartContext = useContext(BuildingApartsContext);

	const [plannings, setPlannings] = useState([]);
	const [planningsLoading, setPlanningsLoading] = useState(false);

	const [currentPlanning, setCurrentPlanning] = useState([]);

	const [isActivePlanning, setIsActivePlanning] = useState(false);

	const [apartments, setApartments] = useState({
		cards: [],
		totalPages: null
	});

	const [apartmentsLoading, setApartmentsLoading] = useState(false);

	const [currentArea, setCurrentArea] = useState(null);

	const [currentPageApartments, setCurrentPageApartments] = useState(1);

	const isOpenPlanning = data.room === activeRoomId && plannings?.find(item => item.minArea === currentArea);

	const onClickLayout = e => {
		setCurrentArea(null);
		onClick();

		const target = e.currentTarget && e.currentTarget.closest("[data-layout-btn]");
		if (!target) return;

		setTimeout(() => {
			const rect = target.getBoundingClientRect();
			const distanceFromTop = rect.top + window.pageYOffset;
			window.scrollTo({
				top: distanceFromTop - 52 - 16,
				behavior: "smooth"
			});
		}, 100);
	};

	useEffect(() => {
		if (data.room === activeRoomId) {
			setPlanningsLoading(true);
			const params = {
				sort: sortBy || "",
				tags: [...apartContext.filtersResult.tags, ...apartContext.filtersResult.advantages],
				is_gift: apartContext.filtersResult.is_gift,
				is_discount: apartContext.filtersResult.is_discount,
				is_cashback: apartContext.filtersResult.is_cashback,
				is_video: apartContext.filtersResult.is_video,
				filters: {
					primary: {
						...apartContext.filtersResult.filters.primary,
						rooms: [activeRoomId]
					}
				}
			};
			getPlannings(id, params)
				.then(res => {
					setPlanningsLoading(false);
					setCurrentPageApartments(1);
					if (res) {
						setPlannings(res);
					}
				})
				.catch(() => {});
		}
	}, [activeRoomId]);

	useEffect(() => {
		if (data.room === activeRoomId && currentPlanning && isActivePlanning) {
			setApartmentsLoading(true);
			const params = {
				sort: sortBy || "",
				tags: [...apartContext.filtersResult.tags, ...apartContext.filtersResult.advantages],
				is_gift: apartContext.filtersResult.is_gift,
				is_discount: apartContext.filtersResult.is_discount,
				is_cashback: apartContext.filtersResult.is_cashback,
				is_video: apartContext.filtersResult.is_video,
				filters: {
					primary: {
						...apartContext.filtersResult.filters.primary,
						rooms: [activeRoomId],
						area: currentArea
					}
				},
				page: currentPageApartments
			};
			getApartments(id, params).then(res => {
				setApartmentsLoading(false);
				setApartments(res);
			});
		}
	}, [currentPageApartments, currentArea, isActivePlanning]);

	useEffect(() => {
		if (!currentArea) return;
		const res = plannings.find(item => item.minArea === currentArea);
		setCurrentPlanning(res);
	}, [plannings, currentArea]);

	const LayoutApartments = () => {
		const searchParams = new URLSearchParams();
		appendParams(searchParams, "sort", sortBy, "string");
		appendParams(searchParams, "rooms", [activeRoomId], "array");
		appendParams(searchParams, "price_to", apartContext.filtersResult.filters.primary.price_to, "number");
		appendParams(searchParams, "frames", apartContext.filtersResult.filters.primary.frames?.value, "string");
		appendParams(searchParams, "is_gift", apartContext.filtersResult.is_gift, "bool");
		appendParams(searchParams, "is_discount", apartContext.filtersResult.is_discount, "bool");
		appendParams(searchParams, "is_cashback", apartContext.filtersResult.is_cashback, "bool");
		appendParams(searchParams, "area", currentArea, "string");

		return (
			<>
				{apartments.cards.map((item, index) => {
					return <RoomInfoCard key={index} data={{ ...item, hidePrices: apartments.hidePrices }} room={activeRoomId} />;
				})}
				{Boolean(apartments?.totalPages > 1) && (
					<>
						<PaginationPage
							currentPage={currentPageApartments}
							setCurrentPage={value => setCurrentPageApartments(value)}
							total={apartments ? apartments.totalPages : 0}
							className='my-6'
							showBtn={false}
						/>
						<Link to={`${RoutesPath.listingFlats}?complex=${id}&${searchParams.toString()}`} target='_blank' className='w-full md1:px-4'>
							<Button variant='secondary' Selector='div'>
								Смотреть списком
							</Button>
						</Link>
					</>
				)}
			</>
		);
	};

	return (
		<div className={styles.RoomInfoRootMain}>
			<LayoutBtn data={data} onClick={onClickLayout} active={data.room === activeRoomId} />
			{data.room === activeRoomId && (
				<>
					{planningsLoading ? (
						<div className='flex items-center justify-center mt-10 mb-8'>
							<Spinner />
						</div>
					) : (
						<Swiper
							className='-m-2 mt-4 p-2 md1:mx-2'
							modules={[Navigation]}
							slidesPerView={1.15}
							navigation={{
								prevEl: ".slider-btn-prev",
								nextEl: ".slider-btn-next"
							}}
							ref={planningsRef}
							spaceBetween={16}
							wrapperClass='items-stretch'
							breakpoints={{
								599: {
									slidesPerView: 1.8
								},
								799: {
									slidesPerView: 2.2
								}
							}}>
							{plannings?.map((item, index) => {
								return (
									<SwiperSlide key={index} className='h-auto'>
										<CardScheme
											data={item}
											onClick={e => {
												const value = item.minArea;
												if (value !== currentArea) {
													setCurrentPageApartments(1);
													setCurrentArea(value);
													setIsActivePlanning(true);
												}
											}}
											room={activeRoomId}
											active={item.minArea === currentArea}
										/>
									</SwiperSlide>
								);
							})}
							{isDesktop && (
								<div>
									<NavBtnPrev centery='true' disabled gray='true' className='slider-btn-prev !top-1/3' />
									<NavBtnNext centery='true' gray='true' className='slider-btn-next !top-1/3' />
								</div>
							)}
						</Swiper>
					)}
				</>
			)}
			<ModalWrapper condition={isOpenPlanning}>
				<Modal
					options={{ overlayClassNames: "_center-max-content-desktop", modalContentClassNames: "!px-10 md1:!px-0 mmd1:min-h-[744px]" }}
					style={optionsStyle}
					condition={isOpenPlanning}
					set={() => {
						setCurrentArea(null);
						setIsActivePlanning(false);
					}}>
					<LayoutApartments />
				</Modal>
			</ModalWrapper>
		</div>
	);
});

export default RoomInfoPlannings;
