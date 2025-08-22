import React, { useCallback, useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";

import { getIsDesktop, getWindowSize } from "@/redux";

import { getDataRequest } from "../../../api/requestsApi";
import MapPlacemarks from "../../../components/MapPlacemarks/MapPlacemarks";
import HorizontalScrollMouse from "../../../ui/HorizontalScrollMouse";
import { IconLocation } from "../../../ui/Icons";
import { SpinnerForBtn } from "../../../ui/Spinner";
import { TabsNav, TabsTitle } from "../../../ui/Tabs";
import { Tooltip } from "../../../ui/Tooltip";
import Button from "../../../uiForm/Button";
import Checkbox from "../../../uiForm/Checkbox";
import { toggleFullscreen } from "../../../unifComponents/ymap/YmapFullscreen";

export const schollIcon = () => {
	return `<svg aria-hidden="true" width="18" height="18" fill="white" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
         <path d="M16.219 6.435 8.484 2.813.75 6.337l7.734 4.112 4.896-2.546v4.015c0 .195.195.391.391.391h.588a.421.421 0 0 0 .391-.391v-4.7l1.469-.783Z" />
         <path d="M4.96 10.057v3.525s2.643 1.566 3.524 1.566c.881 0 3.525-1.566 3.525-1.566v-3.525c-1.175.588-2.35 1.175-3.525 1.665-1.175-.49-2.35-1.077-3.524-1.665Z" />
   </svg>`;
};

export const kindergartenIcon = () => {
	return `<svg aria-hidden="true" width="18" height="18" fill="white" xmlns="http://www.w3.org/2000/svg">
                  <path d="M1 1v12c3.429.625 6 2 6 2V3S4.429 1.5 1 1Zm14 0v12c-3.429.625-6 2-6 2V3s2.571-1.5 6-2Z"/>
   </svg>`;
};

export const medicineIcon = () => {
	return `<svg aria-hidden="true" width="18" height="18" viewBox="0 0 18 18" fill="white" xmlns="http://www.w3.org/2000/svg">
    <path d="M11.625 2.438c.362 0 .656.293.656.656v1.969h2.625c.362 0 .656.293.656.656v9.187a.656.656 0 0 1-.656.656H3.094a.656.656 0 0 1-.656-.656V5.72c0-.363.293-.657.656-.657h2.625V3.095c0-.362.294-.656.656-.656h5.25Zm-1.969 5.25H8.344v1.968H6.375v1.313h1.968v1.969h1.313v-1.97h1.969V9.657H9.656V7.687ZM10.97 3.75H7.03v1.313h3.938V3.75Z"/>
</svg>`;
};
export const shopsIcon = () => {
	return `<svg aria-hidden="true" width="18" height="18" viewBox="0 0 18 18" fill="white" xmlns="http://www.w3.org/2000/svg">
       <path d="M4.464 5.348 2.437 3.322l.885-.885 2.026 2.027h9.526a.625.625 0 0 1 .6.805l-1.5 5a.625.625 0 0 1-.6.445h-7.66v1.25h6.875v1.25h-7.5a.625.625 0 0 1-.625-.625V5.35Zm.938 10.366a.938.938 0 1 1 0-1.875.938.938 0 0 1 0 1.875Zm7.5 0a.937.937 0 1 1 0-1.874.937.937 0 0 1 0 1.874Z"/>
      </svg>`;
};
export const busStop = () => {
	return `<svg
         xmlns="http://www.w3.org/2000/svg"
         xmlns:xlink="http://www.w3.org/1999/xlink"
         version="1.1"
         width="18"
         height="18"
         fill="white"
         viewBox="0 0 24 24">
         <path d="M22 7V16C22 16.71 21.62 17.36 21 17.72V19.25C21 19.66 20.66 20 20.25 20H19.75C19.34 20 19 19.66 19 19.25V18H12V19.25C12 19.66 11.66 20 11.25 20H10.75C10.34 20 10 19.66 10 19.25V17.72C9.39 17.36 9 16.71 9 16V7C9 4 12 4 15.5 4S22 4 22 7M13 15C13 14.45 12.55 14 12 14S11 14.45 11 15 11.45 16 12 16 13 15.55 13 15M20 15C20 14.45 19.55 14 19 14S18 14.45 18 15 18.45 16 19 16 20 15.55 20 15M20 7H11V11H20V7M7 9.5C6.97 8.12 5.83 7 4.45 7.05C3.07 7.08 1.97 8.22 2 9.6C2.03 10.77 2.86 11.77 4 12V20H5V12C6.18 11.76 7 10.71 7 9.5Z" />
      </svg>`;
};

const types = [
	{
		type: "scholl",
		icon: schollIcon()
	},
	{
		type: "kindergarten",
		icon: kindergartenIcon()
	},
	{
		type: "medicine",
		icon: medicineIcon()
	},
	{
		type: "shops",
		icon: shopsIcon()
	},
	{
		type: "stop",
		icon: busStop()
	}
];

const dataNearest = {
	name: "",
	type: "nearest",
	title: ["Ближайшие проекты", "Ближайших проектов нет"],
	minWidth: 215,
	icon: <IconLocation width={15} height={15} className='!stroke-primary400 !fill-[transparent]' />
};

const dataInfrastructure = [
	{
		name: "школа",
		type: "scholl",
		title: ["Школы", "Школ нету"],
		minWidth: 121
	},
	{
		name: "детский сад",
		type: "kindergarten",
		title: ["Детские сады", "Детских садов нет"],
		minWidth: 180
	},
	{
		name: "медицина",
		type: "medicine",
		title: ["Медицина", "Медицинских центров нет"],
		minWidth: 151
	},
	{
		name: "магазины",
		type: "shops",
		title: ["Магазины", "Магазинов нет"],
		minWidth: 151
	},
	{
		name: "остановка",
		type: "stop",
		title: ["Остановки", "Остановок нет"],
		minWidth: 151
	}
];

const handleSearchSubmit = (query, type, options) => {
	const { setIsLoading, currentType, setCurrentType, placemarks, setPlacemarks, coordinates } = options;
	if (currentType === type) {
		setCurrentType(null);
		return;
	}
	setCurrentType(type);
	if (placemarks.find(item => item.type === type).loaded) {
		return;
	}
	setIsLoading(true);
	if (type === "nearest") {
		getDataRequest(`/api/geo-search?lat=${coordinates[0]}&lon=${coordinates[1]}&radius=2`).then(res => {
			const items = res.data
				.map(item => {
					return {
						id: item.id,
						minPrice: item.apartments.length > 0 ? Math.min(...item.apartments.map(item => item.price)) : 0,
						geo: item.geo
					};
				})
				.filter(item => {
					return item.geo[0] !== coordinates[0] && item.geo[1] !== coordinates[1];
				});

			const result = {
				type: "nearest",
				items,
				loaded: true,
				loadedNull: !Boolean(items.length)
			};
			setPlacemarks(prev => [...prev.filter(item => item.type !== "nearest"), result]);
			setIsLoading(false);
		});
	} else {
		const ymaps = window.ymaps;
		ymaps.ready(() => {
			const searchControl = new ymaps.control.SearchControl({
				options: {
					results: 100,
					boundedBy: [
						[coordinates[0] - 0.05, coordinates[1] - 0.05],
						[coordinates[0] + 0.05, coordinates[1] + 0.05]
					],
					strictBounds: true,
					provider: "yandex#search"
				}
			});

			searchControl.search(query).then(res => {
				const results = res.geoObjects.toArray().map((geoObject, index) => ({
					id: index + 1,
					type: "infrastructure",
					settings: types.find(item => item.type === type),
					geo: geoObject.geometry.getCoordinates(),
					name: geoObject.properties.get("name"),
					address: geoObject.properties.get("description")
				}));

				setPlacemarks(prev => [
					...prev.filter(item => item.type !== type),
					{
						type,
						items: results,
						loaded: true,
						loadedNull: !Boolean(results.length)
					}
				]);
				setIsLoading(false);
			});
		});
	}
};

const LayoutButtonsInfrastructure = ({ options }) => {
	const { isLoading, currentType, placemarks } = options;

	return (
		<HorizontalScrollMouse
			widthScreen={1222}
			className={` md1:!w-full flex items-center gap-2 ${window.innerWidth > 1222 ? "top-4" : "bottom-4"}`}>
			{dataInfrastructure.map(item => {
				const isActive =
					!isLoading && placemarks.find(currentItem => currentItem.type === item.type).items.length && currentType === item.type;
				const disabled = placemarks.find(currentItem => currentItem.type === item.type).loadedNull;
				return (
					<div key={item.type} style={{ minWidth: `${item.minWidth}px` }}>
						<Button
							size='Small'
							variant='third'
							className='w-full px-6 py-2 gap-3'
							onClick={() => handleSearchSubmit(item.name, item.type, options)}
							active={isActive}
							disabled={disabled}>
							{isLoading && currentType === item.type ? (
								<SpinnerForBtn size={16} />
							) : (
								<>
									{placemarks.find(currentItem => currentItem.type === item.type).loadedNull ? item.title[1] : item.title[0]}
									<div>
										{item.icon || (
											<div
												className='fill-primary400-elements h-[18px]'
												dangerouslySetInnerHTML={{ __html: types.find(t => t.type === item.type).icon }}
											/>
										)}
									</div>
								</>
							)}
						</Button>
					</div>
				);
			})}
		</HorizontalScrollMouse>
	);
};

const BuildingMapTabsLayout = ({ options, tabs = false }) => {
	const {
		currentType,
		setCurrentType,
		placemarks,
		setPlacemarks,
		coordinates,
		activeTab,
		setActiveTab,
		isLoading,
		setIsLoading,
		map,
		openInfrastructure,
		setOpenInfrastructure
	} = options;

	const tabsData = [
		{
			title: "Предложения рядом"
		}
	];

	if (tabs) {
		return (
			<TabsNav>
				{tabsData.map((item, index) => {
					return (
						<TabsTitle
							border
							onChange={() => {
								setActiveTab(index);

								if (index === 0) {
									handleSearchSubmit(dataNearest.name, dataNearest.type, {
										isLoading,
										setIsLoading,
										currentType,
										setCurrentType,
										placemarks,
										setPlacemarks,
										coordinates
									});
								} else {
									setCurrentType(null);
								}
							}}
							value={activeTab === index}
							key={index}>
							{item.title}
						</TabsTitle>
					);
				})}
			</TabsNav>
		);
	} else {
		const data = [dataNearest];
		return (
			<>
				{[data[0]].map(item => {
					return (
						<div key={item.type} style={{ minWidth: `${item.minWidth}px` }}>
							<Button
								size='Small'
								variant='third'
								className='ymap-action ymap-action-text min-w-full !font-normal'
								onClick={() => {
									handleSearchSubmit(item.name, item.type, options);
									if (map) {
										map.container.enterFullscreen();
									}
								}}
								active={
									!isLoading &&
									placemarks.find(currentItem => currentItem.type === item.type).items.length &&
									currentType === item.type
								}
								disabled={placemarks.find(currentItem => currentItem.type === item.type).loadedNull}>
								{isLoading && currentType === item.type ? (
									<SpinnerForBtn size={16} />
								) : (
									<>
										<div>
											{item.icon || (
												<div
													className='fill-primary400-elements'
													dangerouslySetInnerHTML={{ __html: types.find(t => t.type === item.type).icon }}
												/>
											)}
										</div>
										{placemarks.find(currentItem => currentItem.type === item.type).loadedNull ? item.title[1] : item.title[0]}
									</>
								)}
							</Button>
						</div>
					);
				})}
			</>
		);
	}
};

const BuildingMap = ({ coordinates = [], variant = "default", zoom = 13, currentBuilding = null, onClose = null }) => {
	const isDesktop = useSelector(getIsDesktop);
	const [currentType, setCurrentType] = useState(null);
	const [isLoading, setIsLoading] = useState(false);

	const [map, setMap] = useState(null);

	const [isFullscreen, setIsFullscreen] = useState(false);

	const [placemarks, setPlacemarks] = useState(
		["nearest", "scholl", "kindergarten", "medicine", "shops", "stop"].map(item => ({
			type: item,
			items: [],
			loaded: false,
			loadedNull: false
		}))
	);

	const [activeTab, setActiveTab] = useState(1);

	const [openInfrastructure, setOpenInfrastructure] = useState(false);

	return (
		<>
			{variant === "block" ? (
				<div className='white-block'>
					<h2 className='title-2 mb-4'>Расположение объекта</h2>
					{isDesktop && (
						<BuildingMapTabsLayout
							tabs
							options={{
								activeTab,
								setActiveTab,
								placemarks,
								setPlacemarks,
								currentType,
								setCurrentType,
								coordinates,
								isDesktop,
								isLoading,
								setIsLoading,
								setIsFullscreen,
								map,
								setOpenInfrastructure,
								openInfrastructure
							}}
						/>
					)}

					<div className='relative w-full h-full'>
						<MapPlacemarks
							currentBuilding={currentBuilding}
							coordinates={coordinates}
							sale={currentType ? placemarks.find(item => item.type === currentType).items : []}
							markCoord={coordinates}
							zoom={zoom}
							isFullscreen={isFullscreen}
							setIsFullscreen={setIsFullscreen}
							idMap='map-placemark-block'
							className='mt-4 !h-[512px] md3:!h-[230px]'
							features
							route={activeTab === 2 || !isDesktop || isFullscreen}
							options={{ setMap }}
							buttons={
								<>
									{(isFullscreen || !isDesktop) && (
										<BuildingMapTabsLayout
											options={{
												activeTab,
												setActiveTab,
												placemarks,
												setPlacemarks,
												currentType,
												setCurrentType,
												coordinates,
												isDesktop,
												isLoading,
												setIsLoading,
												setIsFullscreen,
												map,
												setOpenInfrastructure,
												openInfrastructure
											}}
										/>
									)}
								</>
							}
						/>
					</div>
				</div>
			) : (
				<>
					<MapPlacemarks
						coordinates={coordinates}
						sale={currentType ? placemarks.find(item => item.type === currentType).items : []}
						markCoord={coordinates}
						zoom={zoom}
						className='h-full md1:rounded-none'
						idMap='map-placemark-modal'
						features
						route
						isFullscreen={isFullscreen}
						setIsFullscreen={setIsFullscreen}
						options={{ setMap }}
						defaultIsFullscreen={!isDesktop}
						onClose={onClose}
						buttons={
							<>
								<BuildingMapTabsLayout
									options={{
										activeTab,
										setActiveTab,
										placemarks,
										setPlacemarks,
										currentType,
										setCurrentType,
										coordinates,
										isDesktop,
										isLoading,
										setIsLoading,
										setIsFullscreen,
										map,
										setOpenInfrastructure,
										openInfrastructure
									}}
								/>
							</>
						}
					/>
				</>
			)}
		</>
	);
};

export default BuildingMap;
