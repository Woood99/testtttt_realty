import React, { useContext } from 'react';
import cn from 'classnames';
import { useDispatch } from 'react-redux';

import { FeedContext, FeedContextLayout } from '../../context';
import { resetFiltersFeed } from '../../redux/slices/feedSlice';
import Header from '../../components/Header';
import FeedFormRow from './FeedFormRow';
import { useFeedLayout } from './useFeedLayout';

const FeedLayout = ({ children }) => {
   const dispatch = useDispatch();

   const options = useContext(FeedContextLayout);
   const { cities, currentCity, feedSelector, params } = useFeedLayout(options);

   return (
      <FeedContext.Provider
         value={{
            currentCity: { value: currentCity.id, label: currentCity.name },
            reset: () => {
               dispatch(resetFiltersFeed());
            },
            filters: feedSelector.filters,
            values: feedSelector.values,
            params,
            citiesData: cities?.map(item => ({
               value: item.id,
               label: item.name,
            })),
            tags: options.tags,
            isLoading: options.isLoading,
         }}>
         <Header>
            {!params.filterHidden && (
               <form>
                  <FeedFormRow />
               </form>
            )}
         </Header>
         <main className={cn('main', !params.filterHidden && 'main-headerForm')}>
            <div className="main-wrapper">{children}</div>
         </main>
      </FeedContext.Provider>
   );
};

export default FeedLayout;
