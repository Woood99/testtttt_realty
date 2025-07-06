import React, { useCallback, useEffect, useState } from 'react';
import cn from 'classnames';
import debounce from 'lodash.debounce';
import { useDispatch, useSelector } from 'react-redux';
import ModalForm from './ModalForm';
import { getCountOfSelectedFilter } from '../../helpers/getCountOfSelectedFilter';
import FormRowLayout from './FormRowLayout';
import isEmptyArrObj from '../../helpers/isEmptyArrObj';
import { fetchFilters, setResultFilters } from '../../redux/slices/listingSlice';

import ModalWrapper from '../../ui/Modal/ModalWrapper';
import { getCurrentCityNameSelector } from '../../redux/helpers/selectors';

const ListingForm = ({ options, isAdmin = false, shadow = false, className }) => {
   const dispatch = useDispatch();

   const [isOpenMoreFilter, setIsOpenMoreFilter] = useState(false);

   const filtersSelector = useSelector(state => state.listing);
   const currentCity = useSelector(getCurrentCityNameSelector);

   const [filterCount, setFilterCount] = useState(0);

   const onSubmitHandler = e => {
      e.preventDefault();
   };

   useEffect(() => {
      if (!currentCity) return;
      dispatch(
         fetchFilters({
            building_type: 'Новостройки',
            city: currentCity,
         })
      );
   }, [currentCity]);

   useEffect(() => {
      const { filtersMain, filtersAdditional, filtersOther } = filtersSelector;
      let count = getCountOfSelectedFilter([filtersMain, filtersAdditional, filtersOther]);
      if (filtersSelector.type === 'list' && filtersSelector.mapLocationCoordinates && filtersSelector.mapLocationCoordinates.length) {
         count++;
      }
      setFilterCount(count);
      fetchData(filtersSelector);
   }, [
      filtersSelector.filtersMain,
      filtersSelector.filtersAdditional,
      filtersSelector.mapVisiblePlacemarks,
      filtersSelector.type,
      filtersSelector.filtersOther,
   ]);

   const fetchData = useCallback(
      debounce(state => {
         let res = {
            filters: {},
            ...state.filtersOther,
         };
         const main = state.filtersMain;
         const additional = state.filtersAdditional;
         [main, additional].map(data => {
            for (const key in data) {
               const value = data[key].value;
               if (!isEmptyArrObj(value)) {
                  res.filters[data[key].name] = data[key].type === 'list-single' && data[key].options.length > 10 ? [value] : value;
               }
            }
         });
         dispatch(setResultFilters(res));
      }, 550),
      []
   );

   return (
      <form onSubmit={onSubmitHandler} className={cn(className)}>
         <FormRowLayout filterCount={filterCount} setIsOpenMoreFilter={setIsOpenMoreFilter} isAdmin={isAdmin} options={options} shadow={shadow} />
         <ModalWrapper condition={isOpenMoreFilter}>
            <ModalForm condition={isOpenMoreFilter} set={setIsOpenMoreFilter} filterCount={filterCount} options={options} />
         </ModalWrapper>
      </form>
   );
};

export default ListingForm;
