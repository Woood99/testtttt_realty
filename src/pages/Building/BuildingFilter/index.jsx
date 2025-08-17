import debounce from "lodash.debounce";
import React, { useCallback, useContext, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { getLayout } from "@/api";

import { BuildingApartsContext, BuildingContext } from "@/context";

import { addFilterAdditional } from "../../../redux/slices/buildingApartSlice";

import FormRowLayout from "./FormRowLayout";

const BuildingFilter = () => {
	const { id } = useContext(BuildingContext);
	const dispatch = useDispatch();
	const apartContext = useContext(BuildingApartsContext);

	const filtersSelector = useSelector(state => state.buildingApartFilter);
	const onSubmitHandler = e => {
		e.preventDefault();
	};

	useEffect(() => {
		fetchData(filtersSelector);
	}, [filtersSelector]);

	const fetchData = useCallback(
		debounce(state => {
			let res = {
				filters: {
					primary: {
						price_from: state.filtersMain.price.value.priceFrom,
						price_to: state.filtersMain.price.value.priceTo,
						rooms: state.filtersMain.rooms.value,
						area_from: state.filtersAdditional.area.value.areaFrom,
						area_to: state.filtersAdditional.area.value.areaTo,
						frames: state.filtersAdditional.frame?.value
					}
				}
			};
			if (apartContext) {
				apartContext.setFiltersResult({
					...res,
					tags: state.tags,
					advantages: state.advantages,
					is_gift: state.is_gift || null,
					is_discount: state.is_discount || null,
					is_video: state.is_video || null
				});
				apartContext.setLayoutsIsLoading(true);

				getLayout(id, {
					...res,
					tags: [...state.tags, ...state.advantages],
					is_gift: state.is_gift || null,
					is_discount: state.is_discount || null,
					is_video: state.is_video || null
				}).then(result => {
					const totalApart = result.items.reduce((acc, item) => {
						return (acc += item.totalApartment);
					}, 0);
					apartContext.setLayouts({ ...result, totalApart: totalApart });
					apartContext.setLayoutsIsLoading(false);
				});
			}
		}, 600),
		[]
	);

	useEffect(() => {
		const frames = apartContext?.frames;

		if (frames && frames?.length > 0) {
			dispatch(
				addFilterAdditional({
					frame: {
						name: "frame",
						nameLabel: "Корпус",
						type: "list-single",
						options: frames,
						value: {}
					}
				})
			);
		}
	}, [apartContext?.frames]);

	return (
		<form onSubmit={onSubmitHandler} className="mt-6 mb-4 px-8 md1:px-4">
			<FormRowLayout />
		</form>
	);
};

export default BuildingFilter;
