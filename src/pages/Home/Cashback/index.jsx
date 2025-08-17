import { HomeContext } from "..";
import React, { memo, useContext } from "react";
import { useSelector } from "react-redux";
import { Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

import { RoutesPath } from "@/constants";

import { getIsDesktop } from "@/redux";

import { CardPrimary, Maybe, NavBtnNext, NavBtnPrev } from "@/ui";
import { IconStar } from "@/ui/Icons";

import TitleIcon from "../TitleIcon";

import CashbackBanner from "./CashbackBanner";

const Cashback = () => {
	const { cashbackCards, stickers } = useContext(HomeContext);
	const isDesktop = useSelector(getIsDesktop);

	return (
		<Maybe
			condition={cashbackCards.data.length}
			render={() => (
				<section className='mt-3'>
					<div className='container-desktop'>
						<div className='white-block'>
							<TitleIcon
								icon={<IconStar width={24} height={24} />}
								text='Топ продаж'
								link={{
									href: `${RoutesPath.listing}?&stickers=${encodeURIComponent(stickers.map(item => item.id).join(","))}`,
									name: "Смотреть всё"
								}}
							/>

							<Swiper
								modules={[Navigation]}
								slidesPerView={cashbackCards.data.length > 1 ? 1.05 : 1}
								navigation={{
									prevEl: ".slider-btn-prev",
									nextEl: ".slider-btn-next"
								}}
								spaceBetween={16}
								breakpoints={{
									799: {
										slidesPerView: 2,
										spaceBetween: 24
									},
									1222: {
										slidesPerView: 3,
										spaceBetween: 24
									}
								}}
								className='md1:px-4 md1:-mx-4'>
								{cashbackCards.data.map((item, index) => {
									return (
										<SwiperSlide key={index}>
											<CardPrimary {...item} className='h-full' maxImagesLength={2} />
										</SwiperSlide>
									);
								})}
								{isDesktop && (
									<>
										<NavBtnPrev disabled className='slider-btn-prev !absolute top-[95px] left-4' />
										<NavBtnNext className='slider-btn-next !absolute top-[95px] right-4' />
									</>
								)}
							</Swiper>
						</div>
						<CashbackBanner />
					</div>
				</section>
			)}
		/>
	);
};

export default memo(Cashback);
