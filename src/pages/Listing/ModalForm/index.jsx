import cn from "classnames";
import React, { createContext, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";

import { getIsDesktop } from "@/redux";

import { RoutesPath } from "../../../constants/RoutesPath";
import { declensionBuilding } from "../../../helpers/declensionWords";
import { changeFieldAdditional, changeFieldInput, resetFilters, roomsToggle } from "../../../redux/slices/listingSlice";
import Modal from "../../../ui/Modal";
import ModalHeader from "../../../ui/Modal/ModalHeader";
import { SpinnerForBtn } from "../../../ui/Spinner";
import Button from "../../../uiForm/Button";
import FieldRow from "../../../uiForm/FieldRow";
import PriceFromTo from "../../../uiForm/FiltersComponent/PriceFromTo";
import Rooms from "../../../uiForm/FiltersComponent/Rooms";
import { mapLocationListingClear } from "../MapLocation";

import { ListingFilterAdvantages } from "./ListingFilterAdvantages";
import { ListingFilterFromData } from "./ListingFilterFromData";
import { ListingFilterLocation } from "./ListingFilterLocation";
import { ListingFilterMain } from "./ListingFilterMain";
import { ListingFilterStickers } from "./ListingFilterStickers";
import { ListingFilterTags } from "./ListingFilterTags";
import styles from "./ModalForm.module.scss";

export const ListingFiltersContext = createContext();

const ModalForm = ({ condition, set, filterCount, options }) => {
	const dispatch = useDispatch();

	const isDesktop = useSelector(getIsDesktop);

	const filtersOther = useSelector(state => state.listing.filtersOther);
	const { rooms, price } = useSelector(state => state.listing.filtersMain);
	const filtersSelector = useSelector(state => state.listing.filtersAdditional);

	const handleChange = useCallback((name, selectedOptions) => {
		dispatch(changeFieldAdditional({ name, selectedOptions }));
	}, []);

	const handleChangeInput = useCallback((name, type, value) => {
		dispatch(
			changeFieldInput({
				name: type,
				value,
				path: `filtersAdditional.${name}`
			})
		);
	}, []);

	const confirmedFilters = [
		"filter_developer_ids",
		"filter_building_ids",
		"area",
		"Класс жилья",
		"Год сдачи ЖК",
		"Тип дома",
		"Безопасность",
		"Безбарьерная среда",
		"Отделка",
		"Парковка",
		"Инфраструктура",
		"Благоустройство"
	];

	return (
		<Modal
			options={{ modalClassNames: `HeaderSticky !px-0 ${styles.ModalFormRoot}`, modalContentClassNames: "!py-0 !pl-8 !pr-12 md1:!px-4" }}
			style={
				window.innerWidth > 1222
					? {
							"--modal-space": "40px",
							"--modal-height": "calc(var(--vh) - 80px)",
							"--modal-width": "75%"
						}
					: {
							"--modal-space": "0",
							"--modal-height": "var(--vh)",
							"--modal-width": "100%"
						}
			}
			set={set}
			condition={condition}
			closeBtn={false}
			ModalHeader={() => (
				<ModalHeader set={set} className='px-8 py-6 md1:px-4 md1:py-4'>
					<h2 className='title-2'>Фильтры</h2>
				</ModalHeader>
			)}
			ModalFooter={() => (
				<div className='ModalFooter'>
					{filterCount > 0 ? (
						<Button
							variant='secondary'
							className='!text-red'
							size='Small'
							onClick={() => {
								mapLocationListingClear();
								dispatch(resetFilters());
							}}>
							Очистить {isDesktop && `фильтр ⋅ ${filterCount}`}
						</Button>
					) : (
						<div />
					)}

					{options.onlyFilter ? (
						<a href={`${RoutesPath.listing}?${options.paramsUrl}`} className={cn(options.isLoading && "pointer-events-none")}>
							<Button size='Small' className='min-w-[220px]' disabled={options.isLoading}>
								{options.isLoading ? <SpinnerForBtn size={16} variant='second' /> : <>Показать {declensionBuilding(options.total)}</>}
							</Button>
						</a>
					) : (
						<Button size='Small' onClick={() => set(false)} className='min-w-[220px]' disabled={options.isLoading}>
							{options.isLoading ? <SpinnerForBtn size={16} variant='second' /> : <>Показать {declensionBuilding(options.total)}</>}
						</Button>
					)}
				</div>
			)}>
			<ListingFiltersContext.Provider value={{ options, filtersSelector, filtersOther, handleChange, handleChangeInput }}>
				<div className='flex flex-col gap-7 mt-6 mb-4'>
					<ListingFilterMain />
					<div className='border-top-lightgray' />
					<ListingFilterStickers />
					<FieldRow name='Количество комнат' widthChildren={512} classNameName='font-medium'>
						<Rooms dispatchChange={roomsToggle} roomsSelector={rooms} />
					</FieldRow>
					<FieldRow name='Цена' widthChildren={512} classNameName='font-medium'>
						<PriceFromTo dispatchChange={changeFieldInput} priceSelector={price} nameLabelFirst='От' />
					</FieldRow>
					<ListingFilterLocation />

					<div className='border-top-lightgray' />
					<ListingFilterTags />
					<div className='border-top-lightgray' />
					<ListingFilterFromData name='filter_developer_ids' />
					<ListingFilterFromData name='filter_building_ids' />
					<ListingFilterFromData name='area' />
					<ListingFilterFromData name='Класс жилья' />
					<ListingFilterFromData name='Год сдачи ЖК' />
					<ListingFilterFromData name='Тип дома' />
					<ListingFilterFromData name='Безопасность' />
					<ListingFilterFromData name='Безбарьерная среда' />
					<ListingFilterFromData
						name='Отделка'
						tooltipLayout={
							<div className='max-w-[220px] flex flex-col gap-6'>
								<div>
									<h4 className='title-4 !text-white'>Черновая</h4>
									<p className='mt-1.5'>
										В черновой отделке встречаются помещения без межкомнатных перегородок. Электричество проведено до щитка в
										подъезде. Радиаторов отопления может не быть — только трубы. Стены не оштукатурены. Нет откосов, подоконников
										и сантехники
									</p>
								</div>

								<div>
									<h4 className='title-4 !text-white'>Предчистовая</h4>
									<p className='mt-1.5'>
										В предчистовой отделке или whitebox стены и потолки белые, покрыты шпаклёвкой. На полу ровная чистовая стяжка.
										Сделана электрика. Трубы в ванной и на кухне разведены
									</p>
								</div>
								<div>
									<h4 className='title-4 !text-white'>Чистовая</h4>
									<p className='mt-1.5'>
										Квартира с такой отделкой готова к переезду: на стенах — обои или краска, на полу — ламинат или линолеум.
										Розетки и выключатели установлены. Есть сантехника. Иногда застройщики устанавливают базовую мебель
									</p>
								</div>
							</div>
						}
					/>
					<ListingFilterFromData name='Парковка' />
					<ListingFilterFromData name='Инфраструктура' />
					<ListingFilterFromData name='Благоустройство' />

					{Object.keys(filtersSelector).map(key => {
						if (confirmedFilters.includes(key)) return;

						return <ListingFilterFromData name={key} key={key} />;
					})}

					<div className='border-top-lightgray' />
					<ListingFilterAdvantages />
				</div>
			</ListingFiltersContext.Provider>
		</Modal>
	);
};

export default ModalForm;
