import { useContext } from 'react';
import { ListingFiltersContext } from '.';
import AdvantageCard from '../../../ui/AdvantageCard';
import { useDispatch } from 'react-redux';
import { tagsToggle } from '../../../redux/slices/listingSlice';

export const ListingFilterAdvantages = () => {
   const { options, filtersOther } = useContext(ListingFiltersContext);
   const dispatch = useDispatch();

   if (!options.advantages.length) return;

   return (
      <div>
         <h3 className="title-3">Уникальные преимущества объекта</h3>
         <div className="mt-4 grid grid-cols-6 gap-x-4 gap-y-6 md3:grid-cols-2">
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
   );
};
