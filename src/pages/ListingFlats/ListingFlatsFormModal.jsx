import React, { useContext } from "react";
import { useDispatch, useSelector } from "react-redux";

import { getIsDesktop } from "@/redux";

import { ListingFlatsContext } from "../../context";
import { is_cashback_data, is_discount_data, is_gift_data, sortOptionsFlats } from "../../data/selectsField";
import { declensionWordsOffer } from "../../helpers/declensionWords";
import {
	changeFieldAdditional,
	changeFieldInput,
	filterToggle,
	resetFilters,
	roomsToggle,
	setSort,
	tagsToggle
} from "../../redux/slices/listingFlatsSlice";
import AdvantageCard from "../../ui/AdvantageCard";
import { IconSort } from "../../ui/Icons";
import Modal from "../../ui/Modal";
import ModalHeader from "../../ui/Modal/ModalHeader";
import { SpinnerForBtn } from "../../ui/Spinner";
import Tag from "../../ui/Tag";
import Button from "../../uiForm/Button";
import CheckboxToggle from "../../uiForm/CheckboxToggle";
import FieldInput from "../../uiForm/FieldInput";
import FieldRow from "../../uiForm/FieldRow";
import PriceFromTo from "../../uiForm/FiltersComponent/PriceFromTo";
import Rooms from "../../uiForm/FiltersComponent/Rooms";
import Input from "../../uiForm/Input";
import MultiSelect from "../../uiForm/MultiSelect";
import Select from "../../uiForm/Select";

const ListingFlatsFormModal = ({ filterCount, condition, set }) => {
	const dispatch = useDispatch();
	const isDesktop = useSelector(getIsDesktop);

	const { isLoading, total, advantages, tags } = useContext(ListingFlatsContext);

	const listingFlatsSelector = useSelector(state => state.listingFlats);
	const filtersMain = listingFlatsSelector.filters.filtersMain;
	const filtersAdditional = listingFlatsSelector.filters.filtersAdditional;

	const optionsStyle = {
		"--modal-width": "700px"
	};

	const optionsStyleMobile = {
		"--modal-width": "100%"
	};

	const ModalHeaderLayout = () => {
		return (
			<ModalHeader set={set} className='px-8 py-6 md1:px-4 md1:py-4'>
				<h2 className='title-2'>Фильтры</h2>
			</ModalHeader>
		);
	};

	const ModalFooterLayout = () => {
		return (
			<div className='ModalFooter'>
				{filterCount > 0 && (
					<Button variant='secondary' size='Small' onClick={() => dispatch(resetFilters())}>
						Очистить {isDesktop && `фильтр ⋅ ${filterCount}`}
					</Button>
				)}
				<Button size='Small' onClick={() => set(false)} className='min-w-[220px]'>
					{isLoading ? (
						<SpinnerForBtn size={16} variant='second' />
					) : (
						<>
							Показать&nbsp;
							{declensionWordsOffer(total || 0)}
						</>
					)}
				</Button>
			</div>
		);
	};

	const handleChange = (name, selectedOptions) => {
		dispatch(changeFieldAdditional({ name, selectedOptions }));
	};

	const handleChangeInput = (name, type, value) => {
		dispatch(
			changeFieldInput({
				name: type,
				value,
				path: `filtersAdditional.${name}`
			})
		);
	};

	return (
		<Modal
			options={{ overlayClassNames: "_right", modalClassNames: "HeaderSticky !px-0", modalContentClassNames: "!py-0 !pl-8 !pr-12 md1:!px-4" }}
			style={window.innerWidth > 1222 ? optionsStyle : optionsStyleMobile}
			set={set}
			condition={condition}
			closeBtn={false}
			ModalHeader={ModalHeaderLayout}
			ModalFooter={ModalFooterLayout}>
			<div className='flex flex-col gap-6 mt-6 mb-4'>
				{[is_gift_data, is_discount_data, is_cashback_data].map((item, index) => {
					return (
						<div className='bg-primary700 rounded-lg py-4 px-4 flex justify-between gap-4' key={index}>
							<div>
								<h3 className='title-4'>{item.label}</h3>
								<p className='text-small text-primary400 mt-1'>{item.descr}</p>
							</div>
							<CheckboxToggle
								checked={listingFlatsSelector.filters[item.value]}
								set={e => {
									dispatch(
										filterToggle({
											name: item.value,
											value: e.target.checked
										})
									);
								}}
							/>
						</div>
					);
				})}
				<FieldRow name='Цена' widthChildren={999} classNameName='font-medium'>
					<PriceFromTo dispatchChange={changeFieldInput} priceSelector={filtersMain.price} nameLabelFirst='От' />
				</FieldRow>
				<FieldRow name='Количество комнат' widthChildren={999} classNameName='font-medium'>
					<Rooms dispatchChange={roomsToggle} roomsSelector={filtersMain.rooms} />
				</FieldRow>
				{Boolean(filtersAdditional.frame) && (
					<FieldRow name={filtersAdditional.frame.nameLabel} widthChildren={999} classNameName='font-medium'>
						<Select
							options={filtersAdditional.frame.options}
							onChange={value => handleChange(filtersAdditional.frame.name, value)}
							value={filtersAdditional.frame.value}
							defaultOption
						/>
					</FieldRow>
				)}

				<FieldRow name={filtersAdditional.area.nameLabel} widthChildren={999} classNameName='font-medium'>
					<FieldInput>
						<Input
							value={filtersAdditional[filtersAdditional.area.name].value[filtersAdditional.area.from.name]}
							onChange={value => handleChangeInput(filtersAdditional.area.name, filtersAdditional.area.from.name, value)}
							before={filtersAdditional.area.from.label}
							convertNumber
							onlyNumber
							maxLength={3}
						/>
						<Input
							value={filtersAdditional[filtersAdditional.area.name].value[filtersAdditional.area.to.name]}
							onChange={value => handleChangeInput(filtersAdditional.area.name, filtersAdditional.area.to.name, value)}
							before={filtersAdditional.area.to.label}
							after={filtersAdditional.area.postfix}
							convertNumber
							onlyNumber
							maxLength={3}
						/>
					</FieldInput>
				</FieldRow>
				{!isDesktop && (
					<div className='flex items-center gap-2'>
						<IconSort width={16} height={16} />
						<Select
							options={sortOptionsFlats}
							value={sortOptionsFlats.find(item => item.value === listingFlatsSelector.filters.sortBy) || sortOptionsFlats[0]}
							onChange={value => dispatch(setSort(value.value))}
							className='max-w-[300px]'
							variant='second'
							iconArrow={false}
						/>
					</div>
				)}
				<div className='border-top-lightgray' />
				{Boolean(tags?.length && !isDesktop) && (
					<div>
						<h3 className='title-3 mb-3'>Часто ищут</h3>
						<div className='flex flex-wrap gap-2'>
							{tags.map((item, index) => {
								const currentTag = {
									value: item.id,
									label: item.name
								};
								return (
									<Tag
										color='select'
										onClick={value => dispatch(tagsToggle({ value, option: currentTag, type: "tags" }))}
										value={listingFlatsSelector.filters.tags.find(item => item === currentTag.value)}
										key={index}>
										{currentTag.label}
									</Tag>
								);
							})}
						</div>
					</div>
				)}
				{Boolean(advantages?.length) && (
					<div>
						<h3 className='title-3 mb-3'>Уникальные преимущества объекта</h3>
						<div className='grid grid-cols-3 gap-4 md3:grid-cols-2'>
							{advantages.map(item => {
								const currentTag = {
									value: item.id,
									label: item.name
								};
								return (
									<AdvantageCard
										key={item.id}
										data={item}
										onChange={value => dispatch(tagsToggle({ value, option: currentTag, type: "advantages" }))}
										value={listingFlatsSelector.filters.advantages.find(item => item === currentTag.value)}
										textVisible={false}
									/>
								);
							})}
						</div>
					</div>
				)}
			</div>
		</Modal>
	);
};

export default ListingFlatsFormModal;
