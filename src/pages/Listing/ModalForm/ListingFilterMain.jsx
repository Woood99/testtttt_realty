import { useContext } from 'react';
import { ListingFiltersContext } from '.';
import { useDispatch } from 'react-redux';
import CheckboxToggle from '../../../uiForm/CheckboxToggle';
import { additionalParametersToggle } from '../../../redux/slices/listingSlice';

export const ListingFilterMain = () => {
   const { options, filtersOther } = useContext(ListingFiltersContext);
   const dispatch = useDispatch();

   return (
      <div className="grid grid-cols-3 gap-4 md1:grid-cols-1">
         {options.additionalParameters.map((item, index) => {
            return (
               <div className="bg-primary700 rounded-lg py-4 px-4 flex gap-3" key={index}>
                  <div className="self-center">
                     <img src={item.icon} width={item.iconSize} height={item.iconSize} alt="" />
                  </div>
                  <div>
                     <h3 className="title-4">{item.label}</h3>
                     <p className="text-small text-primary400 mt-1">{item.descr}</p>
                  </div>
                  <CheckboxToggle
                     className="ml-auto self-center"
                     checked={filtersOther[item.value]}
                     set={e => {
                        console.log(item);
                        
                        dispatch(additionalParametersToggle({ value: e.target.checked, option: item }));
                     }}
                  />
               </div>
            );
         })}
      </div>
   );
};
