import cn from "classnames";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";

import { getIsDesktop } from "@/redux";

import { ButtonSelect } from "@/uiForm";

import discountImg from "../../assets/img/discount.png";
import presentImg from "../../assets/img/present.png";
import { PrivateRoutesPath, RoutesPath } from "../../constants/RoutesPath";
import { declensionBuilding } from "../../helpers/declensionWords";
import { additionalParametersToggle, changeFieldInput, roomsToggle } from "../../redux/slices/listingSlice";
import { IconLocation } from "../../ui/Icons";
import { SpinnerForBtn } from "../../ui/Spinner";
import Button from "../../uiForm/Button";
import FilterButton from "../../uiForm/FilterButton";
import PriceFromTo from "../../uiForm/FiltersComponent/PriceFromTo";
import Rooms from "../../uiForm/FiltersComponent/Rooms";
import FormRow from "../../uiForm/FormRow";

import ShowType from "./Filters/ShowType";

const FormRowLayout = ({ filterCount, setIsOpenMoreFilter, isAdmin, shadow, options }) => {
	const listingType = useSelector(state => state.listing.type);
	const { rooms, price } = useSelector(state => state.listing.filtersMain);
	const isDesktop = useSelector(getIsDesktop);
	const dispatch = useDispatch();

	const [isActiveGift, setIsActiveGift] = useState(false);
	const [isActiveDiscount, setIsActiveDiscount] = useState(false);
	const [isActiveCashback, setIsActiveCashback] = useState(false);

	const listingTypeList = listingType === "list";

	const gridClass = isDesktop
		? listingTypeList
			? "grid-cols-[145px_max-content_1fr_max-content]"
			: "grid-cols-[145px_max-content_500px_max-content]"
		: "grid-cols-[145px_max-content_400px_max-content]";

	if (options.onlyFilter) {
		return (
			<>
				<FormRow shadow={false} className={cn(`!px-0 !mt-0 md1:!pb-2`, "flex items-center")}>
					<FilterButton count={filterCount} onClick={() => setIsOpenMoreFilter(prev => !prev)} className='min-w-[145px]' />
					<Rooms dispatchChange={roomsToggle} roomsSelector={rooms} />
					<PriceFromTo dispatchChange={changeFieldInput} priceSelector={price} variant='white' />
					<a
						href={`${RoutesPath.listing}?type=map`}
						className='border border-solid border-graySecond h-10 rounded-lg flex items-center gap-2 px-3 relative flex-shrink-0 min-w-[110px]'>
						<IconLocation width={14} height={14} />
						<span>На карте</span>
					</a>
				</FormRow>
				<FormRow shadow={false} className={cn(`!px-0 !mt-0 md1:!pb-2`, "flex items-center justify-center !mt-4")}>
					<ButtonSelect
						type='present'
						isActive={isActiveGift}
						onClick={() => {
							setIsActiveGift(prev => !prev);
							dispatch(additionalParametersToggle({ value: !isActiveGift, option: { value: "is_gift" } }));
						}}
					/>
					<ButtonSelect
						type='discount'
						isActive={isActiveDiscount}
						onClick={() => {
							setIsActiveDiscount(prev => !prev);
							dispatch(additionalParametersToggle({ value: !isActiveDiscount, option: { value: "is_discount" } }));
						}}
					/>
					<ButtonSelect
						type='cashback'
						isActive={isActiveCashback}
						onClick={() => {
							setIsActiveCashback(prev => !prev);
							dispatch(additionalParametersToggle({ value: !isActiveCashback, option: { value: "is_cashback" } }));
						}}
					/>

					<a href={`${RoutesPath.listing}?${options.paramsUrl}`} className={cn(options.isLoading && "pointer-events-none")}>
						<Button Selector='div' size='Small' className='min-w-[220px]' disabled={options.isLoading}>
							{options.isLoading ? <SpinnerForBtn size={16} variant='second' /> : <>Показать {declensionBuilding(options.total)}</>}
						</Button>
					</a>
				</FormRow>
			</>
		);
	} else {
		return (
			<FormRow shadow={shadow} className={cn(`!px-0 !mt-0 md1:!pb-2`, gridClass, shadow && "!px-4")}>
				<FilterButton count={filterCount} onClick={() => setIsOpenMoreFilter(prev => !prev)} />
				<Rooms dispatchChange={roomsToggle} roomsSelector={rooms} />
				<PriceFromTo dispatchChange={changeFieldInput} priceSelector={price} variant='white' />
				{!isAdmin && <ShowType />}
				{isAdmin && (
					<Link to={PrivateRoutesPath.objects.create} className='ml-auto' target='_blank'>
						<Button Selector='div' size='Small'>
							Добавить объект
						</Button>
					</Link>
				)}
			</FormRow>
		);
	}
};

export default FormRowLayout;
