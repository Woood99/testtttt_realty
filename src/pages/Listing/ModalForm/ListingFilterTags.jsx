import { useContext } from 'react';
import { useDispatch } from 'react-redux';

import { ListingFiltersContext } from '.';
import { tagsToggle } from '../../../redux/slices/listingSlice';
import Tag from '../../../ui/Tag';

export const ListingFilterTags = () => {
   const { options, filtersOther } = useContext(ListingFiltersContext);
   const dispatch = useDispatch();

   if (!options.tags.length) return;

   return (
      <div>
         <h3 className="title-3 mb-3">Поиск по тегам</h3>
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
   );
};
