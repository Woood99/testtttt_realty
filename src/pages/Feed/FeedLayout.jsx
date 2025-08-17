import React from 'react';
import { useDispatch } from 'react-redux';

import { FeedContext } from '../../context';
import { resetFiltersFeed, setType } from '../../redux/slices/feedSlice';
import Header from '../../components/Header';
import { useFeed } from './useFeed';
import FeedTop from './FeedTop';
import { TabsNav, TabsTitle } from '../../ui/Tabs';

const FeedLayout = ({ children, options }) => {
   const dispatch = useDispatch();

   const {
      cities,
      currentCity,
      feedSelector,
      params,
      tags,
      setTags,
      isLoading,
      searchParams,
      setSearchParams,
      buildingData,
      dataCards,
      fetching,
      totalPages,
      filterCount,
      isLoadingTags,
   } = useFeed(options);

   const resetFilters = () => {
      dispatch(
         resetFiltersFeed({
            city: { value: currentCity.id, label: currentCity.name },
         })
      );
   };

   const onChangeTab = index => {
      const newParams = new URLSearchParams(searchParams);
      const currentTabName = options.searchParamsTab.find(item => item.id === index)?.value;
      if (feedSelector.type !== currentTabName) {
         setTags([]);
      }
      newParams.set('tab', currentTabName);
      setSearchParams(newParams, { replace: true });
      dispatch(setType(currentTabName));
      if (currentTabName === 'main') {
         resetFilters();
      }
   };

   return (
      <FeedContext.Provider
         value={{
            currentCity: { value: currentCity.id, label: currentCity.name },
            reset: resetFilters,
            feedSelector,
            filters: feedSelector.filters,
            values: feedSelector.values,
            params,
            citiesData: cities?.map(item => ({
               value: item.id,
               label: item.name,
            })),
            tags: tags || [],
            isLoading,
            buildingData,
            title: options.title,
            dataCards,
            fetching,
            totalPages,
            feedType: options.feedType,
            filterCount,
            onChangeTab,
            searchParamsTab: options.searchParamsTab,
            isLoadingTags,
         }}>
         <Header />
         <main className="main">
            <div className="main-wrapper">
               <div className="container-desktop">
                  <div className="white-block">
                     <FeedTop />
                     <TabsNav>
                        {options.searchParamsTab.map((item, index) => {
                           return (
                              <TabsTitle
                                 border
                                 onChange={() => {
                                    onChangeTab(index);
                                 }}
                                 value={feedSelector.type === item.value}
                                 key={index}>
                                 {item.label}
                              </TabsTitle>
                           );
                        })}
                     </TabsNav>
                  </div>
                  {children}
               </div>
            </div>
         </main>
      </FeedContext.Provider>
   );
};

export default FeedLayout;
