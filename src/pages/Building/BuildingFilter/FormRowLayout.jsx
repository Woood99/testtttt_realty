import React from 'react';
import FormRow from '../../../uiForm/FormRow';
import FilterButton from '../../../uiForm/FilterButton';
import Rooms from '../../../uiForm/FiltersComponent/Rooms';
import { useSelector } from 'react-redux';
import { changeFieldInput, roomsToggle } from '../../../redux/slices/buildingApartSlice';
import PriceFromTo from '../../../uiForm/FiltersComponent/PriceFromTo';

const FormRowLayout = ({ filterCount, setIsOpenMoreFilter }) => {
   const { rooms, price } = useSelector(state => state.buildingApartFilter.filtersMain);

   return (
      <FormRow shadow={false} className="grid-cols-[145px_max-content_450px] scrollbarPrimary md1:mx-4">
         <FilterButton count={filterCount} onClick={() => setIsOpenMoreFilter(prev => !prev)} />
         <Rooms dispatchChange={roomsToggle} roomsSelector={rooms} />
         <PriceFromTo dispatchChange={changeFieldInput} priceSelector={price} />
      </FormRow>
   );
};

export default FormRowLayout;
