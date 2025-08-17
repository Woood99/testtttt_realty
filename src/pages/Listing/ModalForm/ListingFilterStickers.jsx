import { useContext } from 'react';
import { useDispatch } from 'react-redux';

import { ListingFiltersContext } from '.';
import { tagsToggle } from '../../../redux/slices/listingSlice';
import Tag from '../../../ui/Tag';
import FieldRow from '../../../uiForm/FieldRow';

export const ListingFilterStickers = () => {
   const { options, filtersOther } = useContext(ListingFiltersContext);
   const dispatch = useDispatch();

   if (!options.stickers.length) return;

   return (
      <FieldRow name="Лидер продаж" widthChildren={99999} classNameName="font-medium">
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
   );
};
