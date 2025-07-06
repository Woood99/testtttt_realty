import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import debounce from 'lodash.debounce';

import { resetFiltersFeed, setCurrentPage, setFiltersFeed, setType, setValueFeed } from '../../redux/slices/feedSlice';
import { appendParams } from '../../helpers/appendParams';
import { getDataRequest, sendPostRequest } from '../../api/requestsApi';
import isEmptyArrObj from '../../helpers/isEmptyArrObj';
import { capitalizeWords } from '../../helpers/changeString';
import { getBuilding } from '../../api/getBuilding';
import isString from '../../helpers/isString';
import { getCitiesSelector, getCurrentCitySelector } from '../../redux/helpers/selectors';
import { getOptionFromData, getOptionsFromData } from '../../helpers/getOptionsFromData';
import { useQueryParams } from '../../hooks/useQueryParams';
import { useGetTags } from '../../api/other/useGetTags';

export const useFeedLayout = options => {
   const {
      searchParamsTab,
      setTags,
      isLoading,
      setIsLoading,
      setBuildingData,
      fetch = () => {},
      feedType = 'promo',
      totalPages,
      fetching,
      setFetching,
   } = options;

   const dispatch = useDispatch();
   const feedSelector = useSelector(state => state.feed);

   const [scrollResolution, setScrollResolution] = useState(false);

   const currentCity = useSelector(getCurrentCitySelector);

   const cities = useSelector(getCitiesSelector);
   const [searchParams, setSearchParams] = useSearchParams();

   const params = useQueryParams();

   const { tags: tagsDataAll } = useGetTags({ type: 'tags', assigned: feedSelector.type }, feedSelector.type);

   useEffect(() => {
      const currentTab = searchParamsTab.find(item => item.value === params.tab) || searchParamsTab[0];
      dispatch(setType(currentTab?.value));
      if (params.type === 'complex' && params.complex) {
         getBuilding(params.complex).then(res => {
            setBuildingData(res);
         });

         dispatch(
            setValueFeed({
               name: 'complexes',
               value: isString(params.complex)
                  ? [{ value: +params.complex }]
                  : params.complex.map(item => ({
                       value: +item,
                    })),
            })
         );
      }

      if (params.developer) {
         sendPostRequest('/api/developers/all', { city: feedSelector.values.city.value, assigned: feedType }).then(res => {
            dispatch(
               setValueFeed({
                  name: 'developers',
                  value: getOptionsFromData(res.data).filter(item => params.developer.includes(item.value.toString())),
               })
            );
         });
      }

      if (typeof params.author === 'string') {
         getDataRequest(`/api/specialists/${params.author}`).then(res => {
            dispatch(
               setValueFeed({
                  name: 'authors',
                  value: [
                     {
                        value: params.author,
                        label: capitalizeWords(res.data.name, res.data.surname),
                        avatar: res.data.image,
                     },
                  ],
               })
            );
         });
      }
   }, []);

   useEffect(() => {
      if (!currentCity) return;
      if (cities.length === 0) return;

      if (params.city) {
         const city = cities.find(item => item.name === params.city);
         dispatch(
            setValueFeed({
               name: 'city',
               value: getOptionFromData(city),
            })
         );
      } else {
         dispatch(
            setValueFeed({
               name: 'city',
               value: getOptionFromData(currentCity),
            })
         );
      }
   }, [cities]);

   useEffect(() => {
      if (params.filterHidden) return;
      if (isEmptyArrObj(feedSelector.values.city)) return;

      sendPostRequest('/api/developers/all', { city: feedSelector.values.city.value, assigned: feedType }).then(res => {
         dispatch(
            setFiltersFeed({
               name: 'developers',
               value: getOptionsFromData(res.data),
            })
         );
      });
   }, [feedSelector.values.city]);

   useEffect(() => {
      if (params.filterHidden) return;
      sendPostRequest('/api/developers/complexes', {
         developer_ids: feedSelector.values.developers?.map(item => item.value),
         assigned: feedType,
      }).then(res => {
         dispatch(
            setFiltersFeed({
               name: 'complexes',
               value: res.data,
            })
         );
      });
   }, [feedSelector.values.developers]);

   useEffect(() => {
      if (params.filterHidden) return;
      sendPostRequest('/api/organization/specialists/all', {
         developer_ids: feedSelector.values.developers?.map(item => item.value),
         complex_ids: feedSelector.values.complexes?.map(item => item.value),
         assigned: feedType,
      }).then(res => {
         dispatch(
            setFiltersFeed({
               name: 'authors',
               value: res.data.map(item => {
                  return {
                     value: item.id,
                     label: capitalizeWords(item.name, item.surname),
                     avatar: item.image,
                  };
               }),
            })
         );
      });
   }, [feedSelector.values.complexes]);

   const fetchData = useCallback(
      debounce(state => {
         dispatch(setCurrentPage(state.currentPage || 1));
         const fetchParams = {
            city: state.city ? state.city.label : '',
            developer: !isEmptyArrObj(state.developers) ? state.developers.map(item => item.value) : null,
            complex: !isEmptyArrObj(state.complexes) ? state.complexes.map(item => item.value) : null,
            author: !isEmptyArrObj(state.authors) ? state.authors.map(item => item.value) : null,
            tags: !isEmptyArrObj(state.tags) ? state.tags : null,
            type: state.activeType,
            page: state.currentPage || 1,
         };

         fetch(fetchParams).then(() => {
            const newParams = new URLSearchParams(searchParams);

            appendParams(newParams, 'city', fetchParams.city, 'string');
            appendParams(newParams, 'developer', fetchParams.developer, 'array');

            // appendParams(newParams, 'complex', fetchParams.complex, 'array');

            appendParams(newParams, 'tags', fetchParams.tags, 'array');
            appendParams(newParams, 'tab', fetchParams.type, 'string');

            setSearchParams(newParams);
            setIsLoading(false);
            setFetching(false);

            if (!scrollResolution) {
               setScrollResolution(true);
            }
         });
      }, 350),
      []
   );

   useEffect(() => {
      window.scrollTo({
         top: 0,
         behavior: 'smooth',
      });
      setIsLoading(true);
      dispatch(setCurrentPage(1));
      fetchData({ ...feedSelector.values, activeType: feedSelector.type || (feedType === 'promo' ? 'stocks' : 'videos') });
   }, [feedSelector.values, feedSelector.type]);

   useEffect(() => {
      setTags(
         tagsDataAll
            .filter(item => item.city === currentCity.name)
            .map(item => ({
               value: item.id,
               label: item.name,
            }))
      );
   }, [tagsDataAll]);

   useEffect(() => {
      document.addEventListener('scroll', e => {
         scrollHandlerList(e, scrollResolution);
      });

      return () => {
         document.removeEventListener('scroll', e => {
            scrollHandlerList(e, scrollResolution);
         });
      };
   }, [scrollResolution]);

   const scrollHandlerList = useCallback(
      debounce((e, scrollResolution) => {
         const scrollHeight = e.target.documentElement.scrollHeight;
         if (
            scrollHeight - (e.target.documentElement.scrollTop + window.innerHeight) < scrollHeight * 1.05 + 700 - scrollHeight &&
            scrollResolution
         ) {
            setFetching(true);
         }
      }, 100),
      []
   );

   const reset = () => {
      dispatch(resetFiltersFeed());
   };

   useEffect(() => {
      if (!fetching) return;
      if (isLoading) return;
      if (feedSelector.page + 1 > totalPages) {
         setFetching(false);
         return;
      }
      fetchData({
         ...feedSelector.values,
         activeType: feedSelector.type || (feedType === 'promo' ? 'stocks' : 'videos'),
         currentPage: feedSelector.page + 1,
      });
      dispatch(setCurrentPage(feedSelector.page + 1));
   }, [fetching]);

   return { cities, currentCity, feedSelector, params, reset };
};
