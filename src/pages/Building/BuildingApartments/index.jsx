import cn from "classnames";
import React, { memo, useContext, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";

import { PrivateRoutesPath, ROLE_ADMIN, RoutesPath } from "@/constants";

import { appendParams, declensionWordsOffer, isEmptyArrObj } from "@/helpers";

import { BuildingApartsContext, BuildingContext } from "@/context";

import { ExternalLink, TabsNav, TabsTitle } from "@/ui";

import { Button } from "@/uiForm";

import DiscountCashbackApartmentsListModal from "../../../admin/modals/discount-cashback/DiscountCashbackApartmentsListModal";
import ObjectAdvantages from "../../../admin/pages/Object/ObjectAdvantages";
import BuildingFilter from "../BuildingFilter";
import BuildingTabsApartments from "../BuildingTabs/BuildingTabsApartments";
import BuildingTabsPlanning from "../BuildingTabs/BuildingTabsPlanning";

const BuildingApartments = ({ data = null, frames = [], tags = [], advantages = [], userRole, children, className, variant = "default" }) => {
	const { apartmentsLastUpdate } = useContext(BuildingContext);
	const params = useParams();

	const [filtersResult, setFiltersResult] = useState({});
	const sortBy = useSelector(state => state.buildingApartFilter.sortBy);

	const [layouts, setLayouts] = useState({});
	const [layoutsIsLoading, setLayoutsIsLoading] = useState(true);

	const [showDiscountModal, setShowDiscountModal] = useState(false);

	const [activeTabIndex, setActiveTabIndex] = useState(0);

	const [urlParams, setUrlParams] = useState("");

	useEffect(() => {
		const searchParams = new URLSearchParams();
		if (isEmptyArrObj(filtersResult)) {
			return;
		}
		appendParams(searchParams, "sort", sortBy, "string");
		appendParams(searchParams, "price_to", filtersResult.filters.primary?.price_to, "number");
		appendParams(searchParams, "frames", filtersResult.filters.primary.frames?.value, "string");
		appendParams(searchParams, "is_gift", filtersResult.is_gift, "bool");
		appendParams(searchParams, "is_discount", filtersResult.is_discount, "bool");

		setUrlParams(`&${searchParams.toString()}`);
	}, [filtersResult, sortBy]);

	return (
		<BuildingApartsContext.Provider
			value={{
				layouts,
				setLayouts,
				filtersResult,
				setFiltersResult,
				layoutsIsLoading,
				setLayoutsIsLoading,
				frames,
				tags,
				advantages,
				userRole
			}}>
			<div className={cn("white-block !px-0", className)}>
				{userRole === ROLE_ADMIN.name && variant === "default" && (
					<div className='flex justify-between gap-2 md1:mx-4 px-8 md1:px-4'>
						<h2 className='title-2'>Квартиры комплекса</h2>
						<div className='flex gap-2'>
							{data && <ObjectAdvantages data={data} frames={frames} />}
							<Button size='Small' onClick={() => setShowDiscountModal("discount")}>
								Скидка
							</Button>
							<Button size='Small' onClick={() => setShowDiscountModal("cashback")}>
								Кешбэк
							</Button>
							<Link to={`${PrivateRoutesPath.apartment.create}${params.id}`} target='_blank'>
								<Button Selector='div' size='Small'>
									Добавить квартиру
								</Button>
							</Link>
						</div>
					</div>
				)}
				<div className='flex justify-between gap-2 items-center px-8 md1:px-4'>
					<TabsNav>
						<TabsTitle border onChange={() => setActiveTabIndex(0)} value={activeTabIndex === 0} className='text-bigSmall'>
							По планировкам
						</TabsTitle>
						<TabsTitle border onChange={() => setActiveTabIndex(1)} value={activeTabIndex === 1} className='text-bigSmall'>
							По квартирам
						</TabsTitle>
					</TabsNav>
				</div>

				<BuildingFilter />
				{activeTabIndex === 0 && <BuildingTabsPlanning />}
				{activeTabIndex === 1 && <BuildingTabsApartments />}
				<div className='flex justify-between gap-2 mt-4 mb-2 px-8 md1:px-4 md1:flex-col'>
					<p className='text-primary400 text-small'>Информация о квартирах обновлена {apartmentsLastUpdate}</p>
					<p>
						<ExternalLink to={`${RoutesPath.listingFlats}?complex=${params.id}${urlParams.toString()}`} className='blue-link'>
							{declensionWordsOffer(layouts.totalApart)}
						</ExternalLink>{" "}
						в этом ЖК
					</p>
				</div>

				<DiscountCashbackApartmentsListModal
					condition={showDiscountModal}
					set={setShowDiscountModal}
					options={{
						type: showDiscountModal,
						frames,
						id: params.id,
						is_edit: false
					}}
				/>

				{children}
			</div>
		</BuildingApartsContext.Provider>
	);
};

export default memo(BuildingApartments);
