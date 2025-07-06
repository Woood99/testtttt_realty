import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import FormRow from '../../uiForm/FormRow';
import FilterButton from '../../uiForm/FilterButton';
import Rooms from '../../uiForm/FiltersComponent/Rooms';
import PriceFromTo from '../../uiForm/FiltersComponent/PriceFromTo';
import ResetBtn from '../../uiForm/ResetBtn';
import { changeFieldInput, resetFilters, roomsToggle } from '../../redux/slices/listingFlatsSlice';

const ListingFlatsFormRow = ({ setIsOpenMoreFilter, filterCount }) => {
   const dispatch = useDispatch();
   const { rooms, price } = useSelector(state => state.listingFlats.filters.filtersMain);

   return (
      <FormRow className="grid-cols-[145px_max-content_385px] container !mt-0">
         <FilterButton count={filterCount} onClick={() => setIsOpenMoreFilter(prev => !prev)} />
         <Rooms dispatchChange={roomsToggle} roomsSelector={rooms} />
         <PriceFromTo dispatchChange={changeFieldInput} priceSelector={price} />
      </FormRow>
   );
};

export default ListingFlatsFormRow;
