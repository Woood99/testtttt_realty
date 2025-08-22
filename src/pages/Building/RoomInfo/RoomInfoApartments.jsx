import React, { memo, useCallback, useContext, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

import { getIsDesktop } from "@/redux";

import { getApartments } from "../../../api/Building/getApartments";
import PaginationPage from "../../../components/Pagination";
import { RoutesPath } from "../../../constants/RoutesPath";
import { BuildingApartsContext, BuildingContext } from "../../../context";
import { appendParams } from "../../../helpers/appendParams";
import { Modal, ModalWrapper } from "../../../ui";
import Button from "../../../uiForm/Button";
import RoomInfoCard from "../RoomInfoCard";

import LayoutBtn from "./LayoutBtn";
import styles from "./RoomInfo.module.scss";

const RoomInfoApartments = memo(({ data, onClick, activeRoomId }) => {
	const { id } = useContext(BuildingContext);
	const apartContext = useContext(BuildingApartsContext);

	const isDesktop = useSelector(getIsDesktop);

	const sortBy = useSelector(state => state.buildingApartFilter.sortBy);

	const optionsStyle = {
		"--modal-space": "0px",
		"--modal-height": "var(--vh)",
		"--modal-width": isDesktop ? "1150px" : "100%"
	};

	const [apartments, setApartments] = useState({
		cards: [],
		totalPages: null
	});

	const [apartmentsLoading, setApartmentsLoading] = useState(false);

	const [currentPageApartments, setCurrentPageApartments] = useState(1);

	useEffect(() => {
		if (data.room === activeRoomId) {
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
						rooms: [activeRoomId]
					}
				},
				page: currentPageApartments
			};

			getApartments(id, params).then(res => {
				setApartmentsLoading(false);
				setApartments(res);
			});
		}
	}, [activeRoomId, currentPageApartments]);

	const LayoutApartments = useCallback(() => {
		const searchParams = new URLSearchParams();

		appendParams(searchParams, "sort", sortBy, "string");
		appendParams(searchParams, "rooms", [activeRoomId], "array");
		appendParams(searchParams, "price_to", apartContext.filtersResult.filters.primary.price_to, "number");
		appendParams(searchParams, "frames", apartContext.filtersResult.filters.primary.frames?.value, "string");
		appendParams(searchParams, "is_gift", apartContext.filtersResult.is_gift, "bool");
		appendParams(searchParams, "is_discount", apartContext.filtersResult.is_discount, "bool");
		appendParams(searchParams, "is_cashback", apartContext.filtersResult.is_cashback, "bool");

		return (
			<>
				{apartments &&
					apartments.cards.map((item, index) => {
						return (
							<RoomInfoCard
								key={index}
								data={{ ...item, hidePrices: apartments.hidePrices }}
								room={activeRoomId}
								userRole={apartContext.userRole}
							/>
						);
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
	}, [apartments]);

	return (
		<div className={styles.RoomInfoRootMain}>
			<LayoutBtn data={data} planning={false} onClick={onClick} active={data.room === activeRoomId} />
			<ModalWrapper condition={data.room === activeRoomId}>
				<Modal
					options={{ overlayClassNames: "_center-max-content-desktop", modalContentClassNames: "!px-10 md1:!px-0 mmd1:min-h-[744px]" }}
					style={optionsStyle}
					condition={data.room === activeRoomId}
					set={onClick}>
					<LayoutApartments />
				</Modal>
			</ModalWrapper>
		</div>
	);
});

export default RoomInfoApartments;
