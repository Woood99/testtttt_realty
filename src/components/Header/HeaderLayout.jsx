import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";

import { BuyerRoutesPath, ROLE_SELLER, RoutesPath, SellerRoutesPath } from "@/constants";

import { declensionWordsSpecialist, isEmptyArrObj } from "@/helpers";

import { HeaderContext } from "@/context";

import { getCurrentCityNameSelector, getCurrentCitySelector, getIsDesktop, getUserInfo } from "@/redux";

const HeaderLayout = ({ theme, children, isAdmin = false }) => {
	const location = useLocation();
	const isDesktop = useSelector(getIsDesktop);

	const userInfo = useSelector(getUserInfo);
	const currentCity = useSelector(getCurrentCityNameSelector);
	const { data: cityData } = useSelector(getCurrentCitySelector);

	const listingType = useSelector(state => state.listing.type);

	const [headerNavData, setHeaderNavData] = useState([]);

	const [isOpenMenu, setIsOpenMenu] = useState(false);
	const [popupCityOpen, setPopupCityOpen] = useState(false);

	const [containerHeader, setContainerHeader] = useState(true);
	const [popupPersonalOpen, setPopupPersonalOpen] = useState(false);

	useEffect(() => {
		if (cityData.length === 0) return;
		setHeaderNavData(
			[
				{
					name: "Новостройки",
					items: [
						[
							{
								name: "Жилые комплексы",
								subtitle: `${(cityData && cityData.find(item => item.name === "Жилые комплексы")?.count) || 0} предложений`,
								link: RoutesPath.listing
							},
							{
								name: "Застройщики",
								subtitle: `${(cityData && cityData.find(item => item.name === "Каталог застройщиков")?.count) || 0} застройщиков`,
								link: RoutesPath.developers.list
							},
							{
								name: "Менеджеры",
								subtitle: `${declensionWordsSpecialist((cityData && cityData.find(item => item.name === "Каталог специалистов")?.count) || 0)}`,
								link: RoutesPath.specialists.list
							}
						],
						[
							{
								name: "Разместить заявку на покупку квартиры в новостройке",
								subtitle: "",
								link: BuyerRoutesPath.purchase.create,
								className: "col-span-2 mt-4",
								mobile: false
							}
						]
					]
				},
				{
					name: "Скидки и подарки",
					href: RoutesPath.feedPromos
				},
				{
					name: "Видео и Клипы",
					href: RoutesPath.feedVideos
				},
				{
					name: "Заявки",
					href: `${userInfo.role?.id === ROLE_SELLER.id ? `${SellerRoutesPath.purchase.list_buyers}` : RoutesPath.purchase.list}`
				}
			].filter(item => !isEmptyArrObj(item))
		);
	}, [cityData, userInfo]);

	useEffect(() => {
		if (location.pathname === RoutesPath.listing && listingType === "map") {
			setContainerHeader(false);
		} else {
			setContainerHeader(true);
		}
	}, [listingType, location]);

	const headerContextOptions = {
		isDesktop,
		dataNav: headerNavData,
		containerHeader,
		theme,
		userInfo,
		currentCity,
		listingType,
		isOpenMenu,
		setIsOpenMenu,
		popupCityOpen,
		setPopupCityOpen,
		popupPersonalOpen,
		setPopupPersonalOpen,
		isAdmin
	};

	return <HeaderContext.Provider value={headerContextOptions}>{children}</HeaderContext.Provider>;
};

export default HeaderLayout;
