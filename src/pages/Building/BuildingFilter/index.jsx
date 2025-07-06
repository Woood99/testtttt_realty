import React, { useCallback, useState, useEffect, useContext } from 'react';
import FormRowLayout from './FormRowLayout';
import BuildingFilterModal from './BuildingFilterModal';
import { useDispatch, useSelector } from 'react-redux';
import debounce from 'lodash.debounce';
import { getCountOfSelectedFilter } from '../../../helpers/getCountOfSelectedFilter';
import { getLayout } from '../../../api/Building/getLayout';
import ModalWrapper from '../../../ui/Modal/ModalWrapper';
import { addFilterAdditional } from '../../../redux/slices/buildingApartSlice';
import { BuildingApartsContext, BuildingContext } from '../../../context';

const BuildingFilter = () => {
   const { id, tags, advantages } = useContext(BuildingContext);
   const dispatch = useDispatch();
   const apartContext = useContext(BuildingApartsContext);

   const [isOpenMoreFilter, setIsOpenMoreFilter] = useState(false);
   const [filterCount, setFilterCount] = useState(0);

   const filtersSelector = useSelector(state => state.buildingApartFilter);
   const onSubmitHandler = e => {
      e.preventDefault();
   };

   useEffect(() => {
      const { filtersMain, filtersAdditional } = filtersSelector;
      setFilterCount(getCountOfSelectedFilter([filtersMain, filtersAdditional]));
      if (filtersSelector.tags.length) {
         setFilterCount(prev => prev + 1);
      }
      if (filtersSelector.advantages.length) {
         setFilterCount(prev => prev + 1);
      }
      if (filtersSelector.is_gift) {
         setFilterCount(prev => prev + 1);
      }
      if (filtersSelector.is_video) {
         setFilterCount(prev => prev + 1);
      }
      fetchData(filtersSelector);
   }, [filtersSelector]);

   const fetchData = useCallback(
      debounce(state => {
         let res = {
            filters: {
               primary: {
                  price_from: state.filtersMain.price.value.priceFrom,
                  price_to: state.filtersMain.price.value.priceTo,
                  rooms: state.filtersMain.rooms.value,
                  area_from: state.filtersAdditional.area.value.areaFrom,
                  area_to: state.filtersAdditional.area.value.areaTo,
                  frames: state.filtersAdditional.frame?.value,
               },
            },
         };
         if (apartContext) {
            apartContext.setFiltersResult({
               ...res,
               tags: state.tags,
               advantages: state.advantages,
               is_gift: state.is_gift || null,
               is_video: state.is_video || null,
            });
            apartContext.setLayoutsIsLoading(true);
            
            getLayout(id, {
               ...res,
               tags: [...state.tags, ...state.advantages],
               is_gift: state.is_gift || null,
               is_video: state.is_video || null,
            }).then(result => {
               const totalApart = result.items.reduce((acc, item) => {
                  return (acc += item.totalApartment);
               }, 0);
               apartContext.setLayouts({ ...result, totalApart: totalApart });
               apartContext.setLayoutsIsLoading(false);
            });
         }
      }, 350),
      []
   );

   useEffect(() => {
      const frames = apartContext?.frames;

      if (frames && frames?.length > 0) {
         dispatch(
            addFilterAdditional({
               frame: {
                  name: 'frame',
                  nameLabel: 'Корпус',
                  type: 'list-single',
                  options: frames,
                  value: {},
               },
            })
         );
      }
   }, [apartContext?.frames]);

   return (
      <form onSubmit={onSubmitHandler} className="mt-6 mb-4">
         <FormRowLayout filterCount={filterCount} setIsOpenMoreFilter={setIsOpenMoreFilter} />
         <ModalWrapper condition={isOpenMoreFilter}>
            <BuildingFilterModal
               condition={isOpenMoreFilter}
               set={setIsOpenMoreFilter}
               filterCount={filterCount}
               complexTags={tags}
               complexAdvantages={advantages}
            />
         </ModalWrapper>
      </form>
   );
};

export default BuildingFilter;
