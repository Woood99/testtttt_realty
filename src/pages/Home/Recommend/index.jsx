import { HomeContext } from "..";
import React, { useContext } from "react";
import { useSelector } from "react-redux";
import { Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

import { RoutesPath } from "@/constants";

import { getIsDesktop } from "@/redux";

import { CardPrimary, Maybe, NavBtnNext, NavBtnPrev } from "@/ui";
import { IconFire } from "@/ui/Icons";

import TitleIcon from "../TitleIcon";

const Recommend = () => {
	const { recommendedCards } = useContext(HomeContext);
	const isDesktop = useSelector(getIsDesktop);

	return (
		<Maybe
			condition={recommendedCards.buildings.length}
			render={() => (
				<section className='mt-3'>
					<div className='container-desktop'>
						<div className='white-block'>
							<TitleIcon
								icon={<IconFire width={24} height={24} />}
								text='Скидки'
								link={{ href: `${RoutesPath.listing}?is_discount=1`, name: "Смотреть всё" }}
							/>
							<Swiper
								modules={[Navigation]}
								slidesPerView={recommendedCards.buildings.length > 1 ? 1.05 : 1}
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
								{recommendedCards.buildings.map(item => {
									return (
										<SwiperSlide key={item.id}>
											<CardPrimary {...item} />
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
					</div>
				</section>
			)}
		/>
	);
};

export default Recommend;
