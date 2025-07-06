import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import cn from 'classnames';

import FormRow from '../../uiForm/FormRow';
import ShowType from './Filters/ShowType';
import FilterButton from '../../uiForm/FilterButton';
import { changeFieldInput, roomsToggle } from '../../redux/slices/listingSlice';

import Rooms from '../../uiForm/FiltersComponent/Rooms';
import PriceFromTo from '../../uiForm/FiltersComponent/PriceFromTo';
import Button from '../../uiForm/Button';
import { PrivateRoutesPath } from '../../constants/RoutesPath';
import { getIsDesktop } from '../../redux/helpers/selectors';

const FormRowLayout = ({ filterCount, setIsOpenMoreFilter, isAdmin, shadow }) => {
   const listingType = useSelector(state => state.listing.type);
   const { rooms, price } = useSelector(state => state.listing.filtersMain);
   const isDesktop = useSelector(getIsDesktop);

   const listingTypeList = listingType === 'list';

   const gridClass = isDesktop
      ? listingTypeList
         ? 'grid-cols-[145px_max-content_1fr_max-content]'
         : 'grid-cols-[145px_max-content_500px_max-content]'
      : 'grid-cols-[145px_max-content_400px_max-content]';

   return (
      <FormRow shadow={shadow} className={cn(`!px-0 !mt-0 md1:!pb-2`, gridClass, shadow && '!px-4')}>
         <FilterButton count={filterCount} onClick={() => setIsOpenMoreFilter(prev => !prev)} />
         <Rooms dispatchChange={roomsToggle} roomsSelector={rooms} />
         <PriceFromTo dispatchChange={changeFieldInput} priceSelector={price} />
         {!isAdmin && <ShowType />}
         {isAdmin && (
            <Link to={PrivateRoutesPath.objects.create} className="ml-auto" target="_blank">
               <Button Selector="div" size="Small">
                  Добавить объект
               </Button>
            </Link>
         )}
      </FormRow>
   );
};

export default FormRowLayout;
