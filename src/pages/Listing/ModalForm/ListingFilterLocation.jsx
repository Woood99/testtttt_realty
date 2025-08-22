import { useContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { ListingFiltersContext } from '.';
import FieldRow from '../../../uiForm/FieldRow';
import Button from '../../../uiForm/Button';
import { IconFinger, IconTrash } from '../../../ui/Icons';
import { setMapLocationCoordinates } from '../../../redux/slices/listingSlice';
import { mapLocationListingClear } from '../MapLocation';

export const ListingFilterLocation = () => {
   const { options } = useContext(ListingFiltersContext);
   const { type, mapLocationCoordinates } = useSelector(state => state.listing);
   const dispatch = useDispatch();

   if (!(type === 'list' && !options.onlyFilter)) return;

   return (
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
                  <IconTrash width={15} height={15} className="stroke-red" />
               </button>
            )}
         </div>
      </FieldRow>
   );
};
