import React, { useContext } from 'react';
import { FeedContext } from '../../context';
import Select from '../../uiForm/Select';
import MultiSelect from '../../uiForm/MultiSelect';
import { useDispatch } from 'react-redux';
import { setValueFeed } from '../../redux/slices/feedSlice';

const FeedFormMainFilters = () => {
   const dispatch = useDispatch();
   const { citiesData, filters, values } = useContext(FeedContext);

   return (
      <>
         <Select
            nameLabel="Город"
            options={citiesData}
            value={values.city || {}}
            onChange={value => {
               dispatch(setValueFeed({ name: 'city', value }));
            }}
            search
         />
         <MultiSelect
            nameLabel="Застройщик"
            options={filters.developers}
            onChange={selectedOption => {
               dispatch(setValueFeed({ name: 'developers', value: selectedOption }));
            }}
            value={values.developers || []}
            search
            btnsActions
         />
         <MultiSelect
            nameLabel="Комплекс"
            options={filters.complexes}
            onChange={selectedOption => {
               dispatch(setValueFeed({ name: 'complexes', value: selectedOption }));
            }}
            value={values.complexes || []}
            search
            btnsActions
         />
         <MultiSelect
            nameLabel="Автор"
            options={filters.authors}
            onChange={selectedOption => {
               dispatch(setValueFeed({ name: 'authors', value: selectedOption }));
            }}
            value={values.authors || []}
            search
            btnsActions
         />
      </>
   );
};

export default FeedFormMainFilters;
