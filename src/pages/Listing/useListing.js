import { useDispatch, useSelector } from 'react-redux';
import { useGetTags } from '../../api/other/useGetTags';
import { getCurrentCityNameSelector, getWindowSize } from '../../redux/helpers/selectors';
import { capitalizedWord } from '../../helpers/changeString';
import { declensionWordsName } from '../../helpers/declensionWords';
import { declensionsWordsDataCity } from '../../data/declensionsWordsData';
import { useCallback, useEffect, useRef, useState } from 'react';
import debounce from 'lodash.debounce';
import { useQueryParams } from '../../hooks/useQueryParams';
import { is_gift_data } from '../../data/selectsField';
import { getDataRequest } from '../../api/requestsApi';
import { changeType, lastTriggerFn, setCurrentPage, setVisiblePlacemarks, startIsLoading } from '../../redux/slices/listingSlice';
import getCardsBuildings from '../../api/getCardsBuildings';
import { joinCardsAndPromo } from './joinCardsAndPromo';
import isEmptyArrObj from '../../helpers/isEmptyArrObj';
import isEqual from 'lodash.isequal';

export const useListing = isAdmin => {
   const currentCity = useSelector(getCurrentCityNameSelector);
   const listingSelector = useSelector(state => state.listing);
   const params = useQueryParams();
   const dispatch = useDispatch();

   const { tags: tagsDataAll } = useGetTags({ type: 'tags', assigned: 'building' });
   const { tags: advantagesDataAll } = useGetTags({ type: 'advantages', assigned: 'building' });
   const { tags: stickersDataAll } = useGetTags({ type: 'stickers', assigned: 'building' });

   const tags = tagsDataAll.filter(item => item.city === currentCity);
   const advantages = advantagesDataAll.filter(item => item.city === currentCity);
   const stickers = stickersDataAll.filter(item => item.city === currentCity);

   const titleText = `Новостройки (ЖК) в ${capitalizedWord(declensionWordsName(currentCity, declensionsWordsDataCity, 1))} от застройщика`;

   const prevFiltersRef = useRef({ ...listingSelector.resultFilters, mapVisiblePlacemarks: listingSelector.mapVisiblePlacemarks });

   const [cards, setCards] = useState([]);
   const [isLoading, setIsLoading] = useState(true);
   const [isLoadingMore, setIsLoadingMore] = useState(false);
   const [total, setTotal] = useState(0);

   const [locationModal, setLocationModal] = useState(false);

   const [fetching, setFetching] = useState(false);
   const [scrollResolution, setScrollResolution] = useState(false);

   const listingMapCardsRef = useRef(null);
   const { width } = useSelector(getWindowSize);

   const [totalPages, setTotalPages] = useState(1);

   const options = {
      cards,
      setCards,
      total,
      setTotal,
      isLoading,
      setIsLoading,
      listingMapCardsRef,
      width,
      tags,
      stickers,
      advantages,
      additionalParameters: [is_gift_data],
      locationModal,
      setLocationModal,
      isLoadingMore,
      scrollResolution,
      setScrollResolution,
      setFetching,
      setIsLoadingMore,
   };

   useEffect(() => {
      if (params.home && currentCity) {
         getDataRequest('/api/home/cashback', { per_page_cashback: 50, city: currentCity }).then(res => {
            dispatch(setVisiblePlacemarks(res.data.map(item => +item.id)));
         });
      }
   }, [currentCity]);

   useEffect(() => {
      if (!currentCity) return;

      if (isAdmin) {
         dispatch(changeType('list'));
      }
   }, [currentCity]);

   const mainRequest = useCallback(
      debounce(({ listingSelector, currentCity }) => {
         dispatch(lastTriggerFn('filter'));
         dispatch(setCurrentPage(1));

         if (listingSelector.type === 'map' && listingMapCardsRef.current) {
            listingMapCardsRef.current.scrollTo({
               top: 0,
               behavior: 'smooth',
            });
         } else {
            window.scrollTo({
               top: 0,
               behavior: 'smooth',
            });
         }

         getCardsBuildings({
            ...listingSelector.resultFilters,
            page: 1,
            city: currentCity,
            visibleObjects: listingSelector.mapVisiblePlacemarks?.length > 0 ? listingSelector.mapVisiblePlacemarks : null,
            sort: listingSelector.type === 'list' ? listingSelector.sortBy : '',
            show_hidden: isAdmin,
            building_type_id: 1,
         }).then(res => {
            setTotalPages(res.pages);
            getDataRequest(`/api/banners?page=1&limit=2`).then(banners => {
               if (res.total === 0) {
                  options.setCards(res.cards);
               } else {
                  options.setCards(joinCardsAndPromo(res.cards, banners.data.items));
               }
               options.setTotal(res.total);
               setIsLoading(false);
               if (!scrollResolution) {
                  setScrollResolution(true);
               }
            });
         });
      }, 450),
      [isAdmin]
   );

   useEffect(() => {
      if (fetching) return;

      if (listingSelector.startIsLoading) {
         dispatch(startIsLoading());
         return;
      }

      if (isEmptyArrObj(listingSelector.resultFilters)) return;
      if (!isEqual(prevFiltersRef.current, { ...listingSelector.resultFilters, mapVisiblePlacemarks: listingSelector.mapVisiblePlacemarks })) {
         prevFiltersRef.current = { ...listingSelector.resultFilters, mapVisiblePlacemarks: listingSelector.mapVisiblePlacemarks };
         setIsLoading(true);
         mainRequest({ listingSelector, currentCity });
      }
   }, [listingSelector.resultFilters, listingSelector.mapVisiblePlacemarks]);

   useEffect(() => {
      if (listingSelector.startIsLoading) {
         return;
      }
      if (fetching) return;
      dispatch(lastTriggerFn('sort'));
      setIsLoading(true);

      getCardsBuildings({
         ...listingSelector.resultFilters,
         page: 1,
         city: currentCity,
         visibleObjects: listingSelector.mapVisiblePlacemarks?.length > 0 ? listingSelector.mapVisiblePlacemarks : null,
         sort: listingSelector.type === 'list' ? listingSelector.sortBy : '',
         show_hidden: isAdmin,
         building_type_id: 1,
      }).then(res => {
         setTotalPages(res.pages);
         getDataRequest(`/api/banners?page=1&limit=2`).then(banners => {
            if (res.total === 0) {
               options.setCards(res.cards);
            } else {
               options.setCards(joinCardsAndPromo(res.cards, banners.data.items));
            }
            options.setTotal(res.total);
            dispatch(setCurrentPage(1));
            setIsLoading(false);
         });
      });
   }, [listingSelector.sortBy]);

   useEffect(() => {
      setIsLoading(true);
      setIsLoadingMore(false);

      setScrollResolution(false);
      setFetching(false);
   }, [listingSelector.type]);

   useEffect(() => {
      if (!fetching) return;

      if (isLoading) return;

      if (listingSelector.page + 1 > totalPages) {
         setFetching(false);
         return;
      }
      dispatch(lastTriggerFn('pagination'));
      setIsLoading(true);
      setIsLoadingMore(true);
      getCardsBuildings({
         ...listingSelector.resultFilters,
         page: listingSelector.page + 1,
         city: currentCity,
         visibleObjects: listingSelector.mapVisiblePlacemarks?.length > 0 ? listingSelector.mapVisiblePlacemarks : null,
         sort: listingSelector.type === 'list' ? listingSelector.sortBy : '',
         show_hidden: isAdmin,
         building_type_id: 1,
      }).then(res => {
         getDataRequest(`/api/banners?page=${listingSelector.page + 1}&limit=2`).then(banners => {
            options.setCards([...cards, ...joinCardsAndPromo(res.cards, banners.data.items)]);
            options.setTotal(res.total);
            dispatch(setCurrentPage(listingSelector.page + 1));
            setFetching(false);
            setIsLoading(false);
            setIsLoadingMore(false);
         });
      });
   }, [fetching]);

   useEffect(() => {
      if (listingSelector.type === 'list') {
         document.addEventListener('scroll', e => {
            scrollHandlerList(e, scrollResolution);
         });

         return () => {
            document.removeEventListener('scroll', e => {
               scrollHandlerList(e, scrollResolution);
            });
         };
      }
      if (listingSelector.type === 'map') {
         if (listingMapCardsRef.current) {
            listingMapCardsRef.current.addEventListener('scroll', e => {
               scrollHandlerMap(e, scrollResolution);
            });
         }
         return () => {
            if (listingMapCardsRef.current) {
               listingMapCardsRef.current.removeEventListener('scroll', e => {
                  scrollHandlerMap(e, scrollResolution);
               });
            }
         };
      }
   }, [listingSelector.type, scrollResolution]);

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

   const scrollHandlerMap = useCallback(
      debounce((e, scrollResolution) => {
         const scrollHeight = listingMapCardsRef.current.scrollHeight;
         if (
            scrollHeight - (listingMapCardsRef.current.scrollTop + window.innerHeight) < scrollHeight * 1.05 + 700 - scrollHeight &&
            scrollResolution
         ) {
            setFetching(true);
         }
      }, 100),
      []
   );

   return { tags, titleText, options };
};
