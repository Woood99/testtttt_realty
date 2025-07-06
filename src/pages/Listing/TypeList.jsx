import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import EmptyBlock from '../../components/EmptyBlock';
import { setVisiblePlacemarksNull } from '../../redux/slices/listingSlice';
import Spinner from '../../ui/Spinner';
import { useQueryParams } from '../../hooks/useQueryParams';
import Button from '../../uiForm/Button';
import { RoutesPath } from '../../constants/RoutesPath';
import { CardPrimaryRowSkeleton } from '../../ui/CardPrimaryRow/CardPrimaryRowSkeleton';
import CardPrimaryRow from '../../ui/CardPrimaryRow';

const TypeList = ({ options, children }) => {
   const dispatch = useDispatch();
   const { lastTrigger, resultFilters } = useSelector(state => state.listing);
   const params = useQueryParams();

   useEffect(() => {
      dispatch(setVisiblePlacemarksNull());
   }, []);

   return (
      <div className="container">
         {children}
         <div className="flex flex-col gap-3">
            {options.isLoading && (lastTrigger === 'filter' || lastTrigger === 'sort') ? (
               [...new Array(16)].map((_, index) => {
                  return <CardPrimaryRowSkeleton key={index} />;
               })
            ) : options.cards.length > 0 ? (
               <>
                  {options.cards.map(item => {
                     if (item.type === 'promo') {
                        // return <BannerMain data={item} key={`${item.id}-promo`} />;
                     } else {
                        return <CardPrimaryRow variant="shadow" key={item.id} {...item} visibleRooms={resultFilters.filters.rooms} />;
                     }
                  })}
                  {options.isLoadingMore && (
                     <div className="flex items-center my-5">
                        <Spinner className="mx-auto" />
                     </div>
                  )}
               </>
            ) : (
               <EmptyBlock />
            )}

            {params.home && (
               <a href={`${RoutesPath.listing}`} className="w-full mt-4">
                  <Button variant="secondary" Selector="div">
                     Смотреть всё
                  </Button>
               </a>
            )}
         </div>
      </div>
   );
};

export default TypeList;
