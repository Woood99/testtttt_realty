import React from "react";
import { useDispatch, useSelector } from "react-redux";

import { getIsDesktop } from "@/redux";
import { changeFieldAdditional, changeFieldInput, filterToggle } from "@/redux/slices/buildingApartSlice";

import { ButtonSelect, FormRow, PriceFromTo, Select } from "@/uiForm";

const FormRowLayout = () => {
	const dispatch = useDispatch();
	const { price } = useSelector(state => state.buildingApartFilter.filtersMain);
	const buildingApartFilter = useSelector(state => state.buildingApartFilter);
	const isDesktop = useSelector(getIsDesktop);

	const filtersSelector = useSelector(state => state.buildingApartFilter.filtersAdditional);

	const handleChange = (name, selectedOptions) => {
		dispatch(changeFieldAdditional({ name, selectedOptions }));
	};

	return (
		<FormRow
			shadow={false}
			className='mmd1:grid-cols-[max-content_max-content_max-content_1fr] md1:grid-cols-[max-content_max-content_max-content_230px_1fr] scrollbarPrimary'>
			<ButtonSelect
				type='present'
				isActive={buildingApartFilter.is_gift}
				onClick={() => {
					dispatch(
						filterToggle({
							name: "is_gift",
							value: !buildingApartFilter.is_gift
						})
					);
				}}
			/>
			<ButtonSelect
				type='discount'
				isActive={buildingApartFilter.is_discount}
				onClick={() => {
					dispatch(
						filterToggle({
							name: "is_discount",
							value: !buildingApartFilter.is_discount
						})
					);
				}}
			/>
			<ButtonSelect
				type='cashback'
				isActive={buildingApartFilter.is_cashback}
				onClick={() => {
					dispatch(
						filterToggle({
							name: "is_cashback",
							value: !buildingApartFilter.is_cashback
						})
					);
				}}
			/>
			{!isDesktop && (
				<PriceFromTo
					dispatchChange={changeFieldInput}
					priceSelector={price}
					variant='white'
					priceFromVisible={false}
					priceToBefore='Цена до'
				/>
			)}

			{filtersSelector.frame && (
				<Select
					variant='third'
					nameLabel='Корпус'
					options={filtersSelector.frame.options}
					onChange={value => handleChange(filtersSelector.frame.name, value)}
					value={filtersSelector.frame.value}
					defaultOption
				/>
			)}
		</FormRow>
	);
};

export default FormRowLayout;
