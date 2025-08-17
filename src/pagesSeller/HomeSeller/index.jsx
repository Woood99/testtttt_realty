import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";

import { IconArrow } from "@/ui/Icons";

import { sendPostRequest } from "../../api/requestsApi";
import Chat from "../../components/Chat";
import SuggestionsCard from "../../components/Suggestions/SuggestionsCard";
import SuggestionsProvider from "../../components/Suggestions/SuggestionsProvider";
import { suggestionsCreateDateRange } from "../../components/Suggestions/suggestions-create-date-range";
import {
	suggestionsDateRange,
	suggestionsTypes
} from "../../components/Suggestions/suggestions-types";
import { SellerRoutesPath } from "../../constants/RoutesPath";
import SellerLayout from "../../layouts/SellerLayout";
import WalletInfoSeller from "../../pages/WalletPage/WalletInfoSeller";

import { getIsDesktop } from "@/redux";

const HomeSeller = () => {
	const suggestions_type = suggestionsTypes.sellerAll;
	const [suggestions, setSuggestions] = useState([]);
	const isDesktop = useSelector(getIsDesktop);

	useEffect(() => {
		const fetchData = async () => {
			const params = {
				per_page: 4,
				page: 1,
				author_is_user: null,
				status: "all",
				...suggestionsCreateDateRange(suggestionsDateRange[0].days),
				order_by_created_at: 0,
				order_by_view_time: null
			};

			const { data: result } = await sendPostRequest(
				suggestions_type.endpoint,
				params
			);

			setSuggestions(result.items);
		};

		fetchData();
	}, []);

	return (
		<SellerLayout
			pageTitle="Основное"
			classNameContent="!p-0 bg-transparent-imp !shadow-none min-w-0"
		>
			<div className="flex md1:overflow-x-auto md1:overflow-y-hidden scrollbar-none-mobile w-full gap-4 pb-4">
				<Link
					to={SellerRoutesPath.purchase.list_buyers}
					className="white-block-small flex-grow flex-shrink basis-0 min-w-[250px] flex justify-between gap-2 items-center"
				>
					<div>
						<h3 className="title-3">Мои покупатели</h3>
						<p className="text-blue mt-1">0 клиентов за месяц</p>
					</div>
					{!isDesktop && <IconArrow width={24} height={24} />}
				</Link>
				<Link
					to={SellerRoutesPath.view}
					className="white-block-small flex-grow flex-shrink basis-0 min-w-[250px] flex justify-between gap-2 items-center"
				>
					<div>
						<h3 className="title-3">Записи на просмотр</h3>
						<p className="text-primary400 mt-1">
							От покупателя и мои предложения
						</p>
					</div>
					{!isDesktop && <IconArrow width={24} height={24} />}
				</Link>
				<Link
					to={SellerRoutesPath.calendar_view}
					className="white-block-small flex-grow flex-shrink basis-0 min-w-[250px] flex justify-between gap-2 items-center"
				>
					<div>
						<h3 className="title-3">Календарь</h3>
						<p className="text-primary400 mt-1">
							Смотрите запланированные показы
						</p>
					</div>
					{!isDesktop && <IconArrow width={24} height={24} />}
				</Link>
			</div>
			<div className="grid grid-cols-3 gap-4 mb-4 min-h-[160px] md2:grid-cols-1">
				<div className="white-block-small mmd2:col-span-2">
					{Boolean(suggestions.length) ? (
						<div className="">
							<div className="flex w-full mb-4">
								<Link
									to={SellerRoutesPath.view}
									className="ml-auto blue-link"
								>
									Смотреть всё
								</Link>
							</div>

							<SuggestionsProvider
								suggestions_type={suggestions_type}
							>
								<Swiper
									slidesPerView={1.55}
									spaceBetween={24}
									breakpoints={{
										799: {
											slidesPerView: 2
										},
										1222: {
											slidesPerView: 1.55
										}
									}}
									className="min-w-0"
								>
									{suggestions.map((card, index) => {
										return (
											<SwiperSlide key={index}>
												<SuggestionsCard
													card={card}
													suggestions_type={
														suggestions_type
													}
													variant="default"
												/>
											</SwiperSlide>
										);
									})}
								</Swiper>
							</SuggestionsProvider>
						</div>
					) : (
						""
					)}
				</div>
				<WalletInfoSeller summ={0} className="white-block-small" />
			</div>
			<div className="white-block-small">
				<div className="rounded-xl">
					<Chat variantChat="mini" />
				</div>
			</div>
		</SellerLayout>
	);
};

export default HomeSeller;
