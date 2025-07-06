import React, { useContext } from 'react';
import ModalHeader from '../../../ui/Modal/ModalHeader';
import Button from '../../../uiForm/Button';
import Modal from '../../../ui/Modal';

import { useDispatch, useSelector } from 'react-redux';
import {
   changeFieldAdditional,
   changeFieldInput,
   resetFilters,
   roomsToggle,
   setSort,
   tagsToggle,
   filterToggle,
} from '../../../redux/slices/buildingApartSlice';
import Rooms from '../../../uiForm/FiltersComponent/Rooms';
import PriceFromTo from '../../../uiForm/FiltersComponent/PriceFromTo';
import FieldRow from '../../../uiForm/FieldRow';
import MultiSelect from '../../../uiForm/MultiSelect';
import FieldInput from '../../../uiForm/FieldInput';
import Input from '../../../uiForm/Input';
import Select from '../../../uiForm/Select';
import { BuildingApartsContext } from '../../../context';
import Tag from '../../../ui/Tag';
import { declensionWordsOffer } from '../../../helpers/declensionWords';
import { is_gift_data } from '../../../data/selectsField';
import CheckboxToggle from '../../../uiForm/CheckboxToggle';
import AdvantageCard from '../../../ui/AdvantageCard';
import { SpinnerForBtn } from '../../../ui/Spinner';
import { IconSort } from '../../../ui/Icons';
import { getIsDesktop } from '../../../redux/helpers/selectors';

export const sortOptionsFlats = [
   {
      label: 'Сначала дешёвые',
      value: 'priceAsc',
   },
   {
      label: 'Сначала дорогие',
      value: 'priceDesc',
   },
];

const BuildingFilterModal = ({ condition, set, filterCount }) => {
   const dispatch = useDispatch();
   const isDesktop = useSelector(getIsDesktop);
   const tagsValue = useSelector(state => state.buildingApartFilter.tags);
   const advantagesValue = useSelector(state => state.buildingApartFilter.advantages);

   const buildingApartFilter = useSelector(state => state.buildingApartFilter);

   const sortBy = useSelector(state => state.buildingApartFilter.sortBy);

   const { rooms, price } = useSelector(state => state.buildingApartFilter.filtersMain);
   const filtersSelector = useSelector(state => state.buildingApartFilter.filtersAdditional);

   const apartContext = useContext(BuildingApartsContext);

   const optionsStyle = {
      '--modal-width': '700px',
   };

   const optionsStyleMobile = {
      '--modal-width': '100%',
   };

   const ModalHeaderLayout = () => {
      return (
         <ModalHeader set={set} className="px-8 py-6 md1:px-4 md1:py-4">
            <h2 className="title-2">Фильтры</h2>
         </ModalHeader>
      );
   };

   const ModalFooterLayout = () => {
      return (
         <div className="ModalFooter">
            {filterCount > 0 && (
               <Button variant="secondary" size="Small" onClick={() => dispatch(resetFilters())}>
                  Очистить {isDesktop && `фильтр ⋅ ${filterCount}`}
               </Button>
            )}
            <Button size="Small" onClick={() => set(false)} className="min-w-[220px] md1:flex-grow">
               {apartContext.layoutsIsLoading ? (
                  <SpinnerForBtn size={16} variant="second" />
               ) : (
                  <>
                     Показать&nbsp;
                     {declensionWordsOffer(apartContext?.layouts.totalApart || 0)}
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
            path: `filtersAdditional.${name}`,
         })
      );
   };

   return (
      <Modal
         options={{
            overlayClassNames: '_right',
            modalClassNames: `HeaderSticky !px-0 !pb-0`,
            modalContentClassNames: '!py-0 !pl-8 !pr-12 md1:!px-4',
         }}
         style={window.innerWidth > 1222 ? optionsStyle : optionsStyleMobile}
         set={set}
         condition={condition}
         closeBtn={false}
         ModalHeader={ModalHeaderLayout}
         ModalFooter={ModalFooterLayout}>
         <div className="flex flex-col gap-6 mt-6 mb-4">
            {[is_gift_data].map((item, index) => (
               <div className="bg-primary700 rounded-lg py-4 px-4 flex justify-between gap-4" key={index}>
                  <div>
                     <h3 className="title-4">{item.label}</h3>
                     <p className="text-small text-primary400 mt-1">{item.descr}</p>
                  </div>
                  <CheckboxToggle
                     checked={buildingApartFilter[item.value]}
                     set={e => {
                        dispatch(
                           filterToggle({
                              name: item.value,
                              value: e.target.checked,
                           })
                        );
                     }}
                  />
               </div>
            ))}
            <FieldRow name="Цена" widthChildren={999} classNameName="font-medium">
               <PriceFromTo dispatchChange={changeFieldInput} priceSelector={price} nameLabelFirst="От" />
            </FieldRow>
            <FieldRow name="Количество комнат" widthChildren={999} classNameName="font-medium">
               <Rooms dispatchChange={roomsToggle} roomsSelector={rooms} />
            </FieldRow>
            {filtersSelector.frame && (
               <FieldRow name={filtersSelector.frame.nameLabel} widthChildren={999} classNameName="font-medium">
                  <Select
                     nameLabel=""
                     options={filtersSelector.frame.options}
                     onChange={value => handleChange(filtersSelector.frame.name, value)}
                     value={filtersSelector.frame.value}
                     defaultOption
                  />
               </FieldRow>
            )}

            <FieldRow name={filtersSelector.area.nameLabel} widthChildren={999} classNameName="font-medium">
               <FieldInput>
                  <Input
                     value={filtersSelector[filtersSelector.area.name].value[filtersSelector.area.from.name]}
                     onChange={value => handleChangeInput(filtersSelector.area.name, filtersSelector.area.from.name, value)}
                     before={filtersSelector.area.from.label}
                     onlyNumberSemicolon
                     replaceComma
                     maxLength={5}
                  />
                  <Input
                     value={filtersSelector[filtersSelector.area.name].value[filtersSelector.area.to.name]}
                     onChange={value => handleChangeInput(filtersSelector.area.name, filtersSelector.area.to.name, value)}
                     before={filtersSelector.area.to.label}
                     after={filtersSelector.area.postfix}
                     onlyNumberSemicolon
                     replaceComma
                     maxLength={5}
                  />
               </FieldInput>
            </FieldRow>

            {isDesktop ? (
               <FieldRow name="Сортировка" widthChildren={999} classNameName="font-medium !mt-0">
                  <Select
                     options={sortOptionsFlats}
                     value={sortOptionsFlats.find(item => item.value === sortBy) || sortOptionsFlats[0]}
                     onChange={value => dispatch(setSort(value.value))}
                     className="min-w-[320px]"
                     variant="second"
                     iconArrow={false}
                  />
               </FieldRow>
            ) : (
               <div className="flex items-center gap-2">
                  <IconSort width={16} height={16} />
                  <Select
                     options={sortOptionsFlats}
                     value={sortOptionsFlats.find(item => item.value === sortBy) || sortOptionsFlats[0]}
                     onChange={value => dispatch(setSort(value.value))}
                     className="min-w-[320px]"
                     variant="second"
                     iconArrow={false}
                  />
               </div>
            )}
            <div className="border-top-lightgray" />
            {Boolean(apartContext.tags.length) && (
               <div>
                  <h3 className="title-3 mb-3">Часто ищут</h3>
                  <div className="flex flex-wrap gap-2">
                     {apartContext.tags.map((item, index) => {
                        const currentTag = {
                           value: item.id,
                           label: item.name,
                        };
                        return (
                           <Tag
                              color="select"
                              onClick={value => dispatch(tagsToggle({ value, option: currentTag, type: 'tags' }))}
                              value={tagsValue.find(item => item === currentTag.value)}
                              key={index}>
                              {currentTag.label}
                           </Tag>
                        );
                     })}
                  </div>
               </div>
            )}
            {Boolean(apartContext.advantages.length) && (
               <div>
                  <h3 className="title-3 mb-3">Уникальные преимущества объекта</h3>
                  <div className="grid grid-cols-3 gap-4 md3:grid-cols-2">
                     {apartContext.advantages.map(item => {
                        const currentTag = {
                           value: item.id,
                           label: item.name,
                        };
                        return (
                           <AdvantageCard
                              key={item.id}
                              data={item}
                              onChange={value => dispatch(tagsToggle({ value, option: currentTag, type: 'advantages' }))}
                              value={advantagesValue.find(item => item === currentTag.value)}
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

export default BuildingFilterModal;
