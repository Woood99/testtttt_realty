import debounce from "lodash.debounce";
import isEqual from "lodash.isequal";
import { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";

import { getCardsBuildings, getDataRequest, useGetTags } from "@/api";

import { useQueryParams } from "@/hooks";

import { capitalizedWord, declensionWordsName, isEmptyArrObj } from "@/helpers";

import { getCurrentCityNameSelector, getWindowSize } from "@/redux";

import { declensionsWordsDataCity } from "../../data/declensionsWordsData";
import { is_cashback_data, is_discount_data, is_gift_data } from "../../data/selectsField";
import { changeType, lastTriggerFn, setCurrentPage, setVisiblePlacemarks, startIsLoading } from "../../redux/slices/listingSlice";

export const useListing = (isAdmin, onlyFilter = false) => {
	const currentCity = useSelector(getCurrentCityNameSelector);
	const listingSelector = useSelector(state => state.listing);
	const params = useQueryParams();
	const dispatch = useDispatch();
	const [searchParams, setSearchParams] = useSearchParams();

	const { tags: tagsDataAll } = useGetTags({ type: "tags", assigned: "building" });
	const { tags: advantagesDataAll } = useGetTags({ type: "advantages", assigned: "building" });
	const { tags: stickersDataAll } = useGetTags({ type: "stickers", assigned: "building" });

	const tags = tagsDataAll.filter(item => item.city === currentCity);
	const advantages = advantagesDataAll.filter(item => item.city === currentCity);
	const stickers = stickersDataAll.filter(item => item.city === currentCity);
	const [paramsUrl, setParamsUrl] = useState("");

	const titleText = `Каталог новостроек (ЖК) в ${capitalizedWord(declensionWordsName(currentCity, declensionsWordsDataCity, 1))}`;

	const prevFiltersRef = useRef({ ...listingSelector.resultFilters, mapVisiblePlacemarks: listingSelector.mapVisiblePlacemarks });

	const [cards, setCards] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const [isLoadingMore, setIsLoadingMore] = useState(false);
	const [total, setTotal] = useState(0);

	const [locationModal, setLocationModal] = useState(false);

	const [fetching, setFetching] = useState(false);
	const [scrollResolution, setScrollResolution] = useState(false);

	const listingMapCardsRef = useRef(null);
	const { width } = useSelector(getWindowSize);

	const [totalPages, setTotalPages] = useState(1);

	const options = {
		cards,
		setCards,
		total,
		setTotal,
		isLoading,
		setIsLoading,
		listingMapCardsRef,
		width,
		tags,
		stickers,
		advantages,
		additionalParameters: [is_gift_data, is_discount_data, is_cashback_data],
		locationModal,
		setLocationModal,
		isLoadingMore,
		scrollResolution,
		setScrollResolution,
		setFetching,
		setIsLoadingMore,
		onlyFilter,
		paramsUrl
	};

	useEffect(() => {
		if (params.home && currentCity) {
			getDataRequest("/api/home/cashback", { per_page_cashback: 50, city: currentCity }).then(res => {
				dispatch(setVisiblePlacemarks(res.data.map(item => +item.id)));
			});
		}
	}, [currentCity]);

	useEffect(() => {
		if (!currentCity) return;

		if (isAdmin) {
			dispatch(changeType("list"));
		}
	}, [currentCity]);

	const setParamsListing = filters => {
		const params = [];

		const addParam = (name, value, type = "string") => {
			if (value === undefined || value === null || value === "") return;

			if (type === "array-csv") {
				if (Array.isArray(value) && value.length) {
					params.push(`${name}=${encodeURIComponent(value.join(","))}`);
				} else if (typeof value === "string" && value) {
					params.push(`${name}=${encodeURIComponent(value)}`);
				}
			} else if (type === "number") {
				const numValue = String(value).replace(/\s+/g, "");
				if (numValue) params.push(`${name}=${encodeURIComponent(numValue)}`);
			} else if (type === "bool") {
				if (value) params.push(`${name}=1`);
			} else {
				params.push(`${name}=${encodeURIComponent(value)}`);
			}
		};

		addParam("sort", filters.type === "list" ? filters.sortBy : "", "string");

		addParam("rooms", filters.resultFilters.filters?.rooms, "array-csv");
		addParam("priceFrom", filters.resultFilters.filters?.price?.priceFrom, "number");
		addParam("priceTo", filters.resultFilters.filters?.price?.priceTo, "number");

		addParam("tags", filters.resultFilters.tags, "array-csv");
		addParam("advantages", filters.resultFilters.advantages, "array-csv");
		addParam("stickers", filters.resultFilters.stickers, "array-csv");

		addParam("is_gift", filters.resultFilters.is_gift, "bool");
		addParam("is_video", filters.resultFilters.is_video, "bool");
		addParam("is_discount", filters.resultFilters.is_discount, "bool");

		for (const key in filters.filtersAdditional) {
			const element = filters.filtersAdditional[key];
			if (!isEmptyArrObj(element?.value)) {
				if (Array.isArray(element.value)) {
					addParam(
						key,
						element.value.map(item => item?.value),
						"array-csv"
					);
				} else if (typeof element.value === "object" && element.value !== null) {
					if (element.value.area__From) addParam("area__From", element.value.area__From, "number");
					if (element.value.area__To) addParam("area__To", element.value.area__To, "number");
				}
			}
		}

		const queryString = params.join("&");

		setParamsUrl(queryString);
		if (!onlyFilter) {
			const newSearchParams = new URLSearchParams(queryString);
			setSearchParams(newSearchParams);
		}
	};

	const mainRequest = useCallback(
		debounce(({ listingSelector, currentCity }) => {
			dispatch(lastTriggerFn("filter"));
			dispatch(setCurrentPage(1));

			if (listingSelector.type === "map" && listingMapCardsRef.current) {
				listingMapCardsRef.current.scrollTo({
					top: 0,
					behavior: "smooth"
				});
			} else {
				window.scrollTo({
					top: 0,
					behavior: "smooth"
				});
			}

			setParamsListing(listingSelector);

			getCardsBuildings({
				...listingSelector.resultFilters,
				page: 1,
				per_page: onlyFilter ? 1 : 10,
				city: currentCity,
				visibleObjects: listingSelector.mapVisiblePlacemarks?.length > 0 ? listingSelector.mapVisiblePlacemarks : null,
				sort: listingSelector.type === "list" ? listingSelector.sortBy : "",
				show_hidden: isAdmin,
				building_type_id: 1
			}).then(res => {
				setTotalPages(res.pages);
				options.setCards(res.cards);
				options.setTotal(res.total);
				setIsLoading(false);
				if (!scrollResolution) {
					setScrollResolution(true);
				}
			});
		}, 600),
		[isAdmin]
	);

	useEffect(() => {
		if (fetching) return;

		if (listingSelector.startIsLoading) {
			dispatch(startIsLoading());
			return;
		}

		if (isEmptyArrObj(listingSelector.resultFilters)) return;
		if (!isEqual(prevFiltersRef.current, { ...listingSelector.resultFilters, mapVisiblePlacemarks: listingSelector.mapVisiblePlacemarks })) {
			prevFiltersRef.current = { ...listingSelector.resultFilters, mapVisiblePlacemarks: listingSelector.mapVisiblePlacemarks };
			setIsLoading(true);
			mainRequest({ listingSelector, currentCity });
		}
	}, [listingSelector.resultFilters, listingSelector.mapVisiblePlacemarks]);

	useEffect(() => {
		if (listingSelector.startIsLoading) {
			return;
		}
		if (fetching) return;
		dispatch(lastTriggerFn("sort"));
		setIsLoading(true);

		setParamsListing(listingSelector);

		getCardsBuildings({
			...listingSelector.resultFilters,
			page: 1,
			per_page: onlyFilter ? 1 : 10,
			city: currentCity,
			visibleObjects: listingSelector.mapVisiblePlacemarks?.length > 0 ? listingSelector.mapVisiblePlacemarks : null,
			sort: listingSelector.type === "list" ? listingSelector.sortBy : "",
			show_hidden: isAdmin,
			building_type_id: 1
		}).then(res => {
			setTotalPages(res.pages);
			options.setCards(res.cards);
			options.setTotal(res.total);
			dispatch(setCurrentPage(1));
			setIsLoading(false);
		});
	}, [listingSelector.sortBy]);

	useEffect(() => {
		setIsLoading(true);
		setIsLoadingMore(false);

		setScrollResolution(false);
		setFetching(false);
	}, [listingSelector.type]);

	useEffect(() => {
		if (!fetching) return;

		if (isLoading) return;

		if (listingSelector.page + 1 > totalPages) {
			setFetching(false);
			return;
		}
		dispatch(lastTriggerFn("pagination"));
		setIsLoading(true);
		setIsLoadingMore(true);
		getCardsBuildings({
			...listingSelector.resultFilters,
			page: listingSelector.page + 1,
			per_page: onlyFilter ? 1 : 10,
			city: currentCity,
			visibleObjects: listingSelector.mapVisiblePlacemarks?.length > 0 ? listingSelector.mapVisiblePlacemarks : null,
			sort: listingSelector.type === "list" ? listingSelector.sortBy : "",
			show_hidden: isAdmin,
			building_type_id: 1
		}).then(res => {
			options.setCards([...cards, ...res.cards]);
			options.setTotal(res.total);
			dispatch(setCurrentPage(listingSelector.page + 1));
			setFetching(false);
			setIsLoading(false);
			setIsLoadingMore(false);
		});
	}, [fetching]);

	useEffect(() => {
		if (onlyFilter) return;

		if (listingSelector.type === "list") {
			document.addEventListener("scroll", e => {
				scrollHandlerList(e, scrollResolution);
			});

			return () => {
				document.removeEventListener("scroll", e => {
					scrollHandlerList(e, scrollResolution);
				});
			};
		}
		if (listingSelector.type === "map") {
			if (listingMapCardsRef.current) {
				listingMapCardsRef.current.addEventListener("scroll", e => {
					scrollHandlerMap(e, scrollResolution);
				});
			}
			return () => {
				if (listingMapCardsRef.current) {
					listingMapCardsRef.current.removeEventListener("scroll", e => {
						scrollHandlerMap(e, scrollResolution);
					});
				}
			};
		}
	}, [listingSelector.type, scrollResolution]);

	const scrollHandlerList = useCallback(
		debounce((e, scrollResolution) => {
			const scrollHeight = e.target.documentElement.scrollHeight;
			if (
				scrollHeight - (e.target.documentElement.scrollTop + window.innerHeight) < scrollHeight * 1.05 + 700 - scrollHeight &&
				scrollResolution
			) {
				setFetching(true);
			}
		}, 100),
		[]
	);

	const scrollHandlerMap = useCallback(
		debounce((e, scrollResolution) => {
			const scrollHeight = listingMapCardsRef.current.scrollHeight;
			if (
				scrollHeight - (listingMapCardsRef.current.scrollTop + window.innerHeight) < scrollHeight * 1.05 + 700 - scrollHeight &&
				scrollResolution
			) {
				setFetching(true);
			}
		}, 100),
		[]
	);

	return { tags, stickers, titleText, options };
};
