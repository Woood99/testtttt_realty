import React from 'react';

import Modal from '../../../ui/Modal';
import ModalHeader from '../../../ui/Modal/ModalHeader';
import { useDispatch, useSelector } from 'react-redux';
import {
   additionalParametersToggle,
   changeFieldAdditional,
   changeFieldInput,
   resetFilters,
   roomsToggle,
   setMapLocationCoordinates,
   tagsToggle,
} from '../../../redux/slices/listingSlice';
import Button from '../../../uiForm/Button';

import Rooms from '../../../uiForm/FiltersComponent/Rooms';
import PriceFromTo from '../../../uiForm/FiltersComponent/PriceFromTo';

import styles from './ModalForm.module.scss';
import { FiltersFromDataRow } from '../../../unifComponents/FiltersFromData';
import FieldRow from '../../../uiForm/FieldRow';
import { IconFinger, IconTrash } from '../../../ui/Icons';
import Tag from '../../../ui/Tag';
import { SpinnerForBtn } from '../../../ui/Spinner';
import CheckboxToggle from '../../../uiForm/CheckboxToggle';
import { filterTypeMultipleSelect } from '../../../data/selectsField';
import AdvantageCard from '../../../ui/AdvantageCard';
import { mapLocationListingClear } from '../MapLocation';
import { getIsDesktop } from '../../../redux/helpers/selectors';

const ModalForm = ({ condition, set, filterCount, options }) => {
   const dispatch = useDispatch();

   const isDesktop = useSelector(getIsDesktop);
   const { type, mapLocationCoordinates } = useSelector(state => state.listing);

   const filtersOther = useSelector(state => state.listing.filtersOther);
   const { rooms, price } = useSelector(state => state.listing.filtersMain);
   const filtersSelector = useSelector(state => state.listing.filtersAdditional);

   const optionsStyle = {
      '--modal-space': '40px',
      '--modal-height': 'calc(var(--vh) - 80px)',
      '--modal-width': '1000px',
   };

   const optionsStyleMobile = {
      '--modal-space': '0',
      '--modal-height': 'var(--vh)',
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
            {filterCount > 0 ? (
               <Button
                  variant="secondary"
                  size="Small"
                  onClick={() => {
                     mapLocationListingClear();
                     dispatch(resetFilters());
                  }}>
                  Очистить {isDesktop && `фильтр ⋅ ${filterCount}`}
               </Button>
            ) : (
               <div />
            )}
            <Button size="Small" onClick={() => set(false)} className="min-w-[220px]">
               {options.isLoading ? <SpinnerForBtn size={16} variant="second" /> : <>Показать {options.total} новостроек</>}
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
         options={{ modalClassNames: `HeaderSticky !px-0 ${styles.ModalFormRoot}`, modalContentClassNames: '!py-0 !pl-8 !pr-12 md1:!px-4' }}
         style={window.innerWidth > 1222 ? optionsStyle : optionsStyleMobile}
         set={set}
         condition={condition}
         closeBtn={false}
         ModalHeader={ModalHeaderLayout}
         ModalFooter={ModalFooterLayout}>
         <div className="flex flex-col gap-7 mt-6 mb-4">
            <div>
               {options.additionalParameters.map((item, index) => {
                  return (
                     <div className="bg-primary700 rounded-lg py-4 px-4 flex justify-between gap-4" key={index}>
                        <div>
                           <h3 className="title-4">{item.label}</h3>
                           <p className="text-small text-primary400 mt-1">{item.descr}</p>
                        </div>
                        <CheckboxToggle
                           checked={filtersOther[item.value]}
                           set={e => {
                              dispatch(additionalParametersToggle({ value: e.target.checked, option: item }));
                           }}
                        />
                     </div>
                  );
               })}
            </div>
            <div className="border-top-lightgray" />
            {Boolean(options.stickers.length) && (
               <div>
                  <FieldRow name="Лидер продаж" widthChildren={512} classNameName="font-medium">
                     <div className="flex flex-wrap gap-2">
                        {options.stickers.map((item, index) => {
                           const currentTag = {
                              value: item.id,
                              label: item.name,
                           };
                           return (
                              <Tag
                                 color="select"
                                 onClick={value => dispatch(tagsToggle({ value, option: currentTag, type: 'stickers' }))}
                                 value={filtersOther.stickers.find(item => item === currentTag.value)}
                                 key={index}>
                                 {currentTag.label}
                              </Tag>
                           );
                        })}
                     </div>
                  </FieldRow>
               </div>
            )}
            {Object.keys(filtersSelector).map((key, index) => {
               if (key !== 'filter_developer_ids' && key !== 'filter_building_ids' && key !== 'area') {
                  return;
               }

               const data = filtersSelector[key];
               let currentType = data.type;
               if (data.type === 'list-multiple' && !filterTypeMultipleSelect(data.label) && data.options.length <= 10) {
                  currentType = 'tags-multiple';
               }
               if (data.type === 'list-single' && data.options.length <= 10) {
                  currentType = 'tags-single';
               }

               return (
                  <FiltersFromDataRow
                     data={{ ...data, type: currentType }}
                     key={index}
                     handleChangeInput={handleChangeInput}
                     handleChange={handleChange}
                     filtersSelector={filtersSelector}
                     widthChildren={512}
                  />
               );
            })}
            <FieldRow name="Цена" widthChildren={512} classNameName="font-medium">
               <PriceFromTo dispatchChange={changeFieldInput} priceSelector={price} nameLabelFirst="От" />
            </FieldRow>
            {Object.keys(filtersSelector).map((key, index) => {
               if (key === 'filter_developer_ids' || key === 'filter_building_ids' || key === 'area') {
                  return;
               }

               const data = filtersSelector[key];
               let currentType = data.type;
               if (data.type === 'list-multiple' && !filterTypeMultipleSelect(data.label) && data.options.length <= 50) {
                  currentType = 'tags-multiple';
               }
               if (data.type === 'list-single' && data.options.length <= 50) {
                  currentType = 'tags-single';
               }

               return (
                  <FiltersFromDataRow
                     data={{ ...data, type: currentType }}
                     key={index}
                     handleChangeInput={handleChangeInput}
                     handleChange={handleChange}
                     filtersSelector={filtersSelector}
                     widthChildren={512}
                  />
               );
            })}
            <FieldRow name="Количество комнат" widthChildren={512} classNameName="font-medium">
               <Rooms dispatchChange={roomsToggle} roomsSelector={rooms} />
            </FieldRow>
            {type === 'list' && (
               <FieldRow name="Расположение" widthChildren={512} classNameName="font-medium">
                  <div className="flex items-center gap-2 w-full">
                     <Button
                        variant="secondary"
                        size="Small"
                        className="!rounded-xl w-full"
                        onClick={() => options.setLocationModal(true)}
                        active={mapLocationCoordinates && mapLocationCoordinates.length}>
                        {mapLocationCoordinates && mapLocationCoordinates.length ? (
                           <>Вы указали область на карте</>
                        ) : (
                           <>
                              Нарисовать область на карте
                              <IconFinger width={18} height={18} className="ml-3" />
                           </>
                        )}
                     </Button>
                     {Boolean(mapLocationCoordinates && mapLocationCoordinates.length) && (
                        <button
                           type="button"
                           title="Очистить"
                           onClick={() => {
                              dispatch(setMapLocationCoordinates([]));
                              mapLocationListingClear();
                           }}>
                           <IconTrash width={15} height={15} className="fill-red" />
                        </button>
                     )}
                  </div>
               </FieldRow>
            )}

            <div className="border-top-lightgray" />
            {Boolean(options.tags.length) && (
               <div>
                  <h3 className="title-3 mb-3">Часто ищут</h3>
                  <div className="flex-wrap flex gap-1.5">
                     {options.tags.map((item, index) => {
                        const currentTag = {
                           value: item.id,
                           label: item.name,
                        };
                        return (
                           <Tag
                              size="medium"
                              className="!rounded-xl"
                              onClick={value => dispatch(tagsToggle({ value, option: currentTag, type: 'tags' }))}
                              value={filtersOther.tags.find(item => item === currentTag.value)}
                              key={index}>
                              {currentTag.label}
                           </Tag>
                        );
                     })}
                  </div>
               </div>
            )}
            {Boolean(options.advantages.length) && (
               <div>
                  <h3 className="title-3">Уникальные преимущества объекта</h3>
                  <div className="mt-4 grid grid-cols-4 gap-x-3 gap-y-4 md3:grid-cols-2">
                     {options.advantages.map(item => {
                        const currentTag = {
                           value: item.id,
                           label: item.name,
                        };
                        return (
                           <AdvantageCard
                              key={item.id}
                              data={item}
                              onChange={value => dispatch(tagsToggle({ value, option: currentTag, type: 'advantages' }))}
                              value={filtersOther.advantages.find(item => item === currentTag.value)}
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

export default ModalForm;
