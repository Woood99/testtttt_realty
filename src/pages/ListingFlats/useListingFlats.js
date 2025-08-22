import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import debounce from 'lodash.debounce';
import { useSearchParams } from 'react-router-dom';

import { addFilterAdditional, lastTriggerFn, setCurrentPage } from '../../redux/slices/listingFlatsSlice';
import { getDataRequest, sendPostRequest } from '../../api/requestsApi';
import { getFrames } from '../../api/other/getFrames';
import { getCountOfSelectedFilter } from '../../helpers/getCountOfSelectedFilter';
import { appendParams } from '../../helpers/appendParams';
import { getBuilding } from '../../api/getBuilding';
import { getSpecialists } from '../../api/Building/getSpecialists';
import { useQueryParams } from '../../hooks/useQueryParams';
import { useGetTags } from '../../api/other/useGetTags';
import { getApartmentsFromType } from '../../api/other/getApartmentsFromType';
import { isArray } from '../../helpers/isEmptyArrObj';

const getFilters = data => {
   return {
      filters: {
         primary: {
            price_from: data.filters.filtersMain.price.value.priceFrom,
            price_to: data.filters.filtersMain.price.value.priceTo,
            rooms: data.filters.filtersMain.rooms.value,
            area: data.filters.filtersMain.area,
            area_from: data.filters.filtersAdditional.area.value.areaFrom,
            area_to: data.filters.filtersAdditional.area.value.areaTo,
            frames: data.filters.filtersAdditional.frame?.value,
         },
      },
      tags: [...data.filters.tags, ...data.filters.advantages],
      is_gift: data.filters.is_gift || null,
      is_video: data.filters.is_video || null,
      is_discount: data.filters.is_discount || null,
      is_cashback: data.filters.is_cashback || null,
      sort: data.filters.sortBy,
      page: data.page,
   };
};

export const useListingFlats = () => {
   const dispatch = useDispatch();
   const params = useQueryParams();
   const [searchParams, setSearchParams] = useSearchParams();
   const urlParams = new URLSearchParams(window.location.search);

   const listingFlatsSelector = useSelector(state => state.listingFlats);

   const [types, setTypes] = useState([]);
   const [specialists, setSpecialists] = useState([]);

   const [filterCount, setFilterCount] = useState(0);

   const [init, setInit] = useState(false);
   const [isLoading, setIsLoading] = useState(true);
   const [isLoadingMore, setIsLoadingMore] = useState(false);

   const [cards, setCards] = useState([]);
   const [total, setTotal] = useState(0);
   const [totalPages, setTotalPages] = useState(1);

   const [scrollResolution, setScrollResolution] = useState(false);
   const [fetching, setFetching] = useState(false);

   const [buildingData, setBuildingData] = useState({});
   const [purchaseRequest, setPurchaseRequest] = useState({});

   const [customIds, setCustomIds] = useState([]);

   const { tags: tags } = useGetTags({ type: 'tags', assigned: 'apartment' });
   const { tags: advantages } = useGetTags({ type: 'advantages', assigned: 'apartment' });

   useEffect(() => {
      getDataRequest('/api/object-types').then(res => {
         if (!res.data) return;
         setTypes(
            res.data.map(item => ({
               value: item.id,
               label: item.name,
            }))
         );
      });

      if (params.complex) {
         getBuilding(params.complex).then(res => {
            setBuildingData(res);
         });

         getFrames(params.complex).then(res => {
            if (res.length) {
               dispatch(
                  addFilterAdditional({
                     frame: {
                        name: 'frame',
                        nameLabel: 'Корпус',
                        type: 'list-single',
                        options: res,
                        value: res.find(item => item.value === urlParams.get('frames')) || {},
                     },
                  })
               );
            }
            setInit(true);
         });

         getSpecialists(params.complex).then(res => {
            setSpecialists(res);
         });
      } else if (params.purchase) {
         getDataRequest(`/seller-api/associated-apartments`)
            .then(res => {
               setCustomIds(res.data);

               getDataRequest(`/api/purchase-orders/${params.purchase}`)
                  .then(res => {
                     setPurchaseRequest(res.data);
                     setInit(true);
                  })
                  .catch(() => {
                     setInit(true);
                  });
            })
            .catch(() => {
               setCustomIds([]);
               setInit(true);
            });
      } else if (params.promo) {
         getApartmentsFromType(params.promo, 'promo', 9999999)
            .then(res => {
               setCustomIds(res.apartments);
            })
            .finally(() => {
               setInit(true);
            });
      } else {
         setInit(true);
      }
   }, []);

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

   useEffect(() => {
      if (!init) return;

      const { filtersMain, filtersAdditional } = listingFlatsSelector.filters;
      setFilterCount(getCountOfSelectedFilter([filtersMain, filtersAdditional]));
      if (listingFlatsSelector.filters.tags.length) {
         setFilterCount(prev => prev + 1);
      }
      if (listingFlatsSelector.filters.advantages.length) {
         setFilterCount(prev => prev + 1);
      }
      if (listingFlatsSelector.filters.is_gift) {
         setFilterCount(prev => prev + 1);
      }
      if (listingFlatsSelector.filters.is_video) {
         setFilterCount(prev => prev + 1);
      }
      if (listingFlatsSelector.filters.is_discount) {
         setFilterCount(prev => prev + 1);
      }
      if (listingFlatsSelector.filters.is_cashback) {
         setFilterCount(prev => prev + 1);
      }

      const newParams = new URLSearchParams(searchParams);

      appendParams(newParams, 'sort', listingFlatsSelector.filters.sortBy, 'string');
      appendParams(newParams, 'rooms', listingFlatsSelector.filters.filtersMain.rooms.value, 'array');

      appendParams(newParams, 'price_from', listingFlatsSelector.filters.filtersMain.price.value.priceFrom, 'number');
      appendParams(newParams, 'price_to', listingFlatsSelector.filters.filtersMain.price.value.priceTo, 'number');

      appendParams(newParams, 'area_from', listingFlatsSelector.filters.filtersAdditional.area.value.areaFrom, 'number');
      appendParams(newParams, 'area_to', listingFlatsSelector.filters.filtersAdditional.area.value.areaTo, 'number');

      appendParams(newParams, 'frames', listingFlatsSelector.filters.filtersAdditional.frame?.value?.value, 'string');

      appendParams(newParams, 'tags', listingFlatsSelector.filters.tags, 'array');
      appendParams(newParams, 'advantages', listingFlatsSelector.filters.advantages, 'array');

      appendParams(newParams, 'is_gift', listingFlatsSelector.filters.is_gift, 'bool');
      appendParams(newParams, 'is_video', listingFlatsSelector.filters.is_video, 'bool');
      appendParams(newParams, 'is_discount', listingFlatsSelector.filters.is_discount, 'bool');
      appendParams(newParams, 'is_cashback', listingFlatsSelector.filters.is_cashback, 'bool');

      setSearchParams(newParams);

      fetchData({ ...listingFlatsSelector, customIds });
   }, [listingFlatsSelector.filters, init]);

   const fetchData = useCallback(
      debounce(state => {
         dispatch(lastTriggerFn('filter'));
         dispatch(setCurrentPage(1));

         window.scrollTo({
            top: 0,
         });

         setIsLoading(true);

         sendPostRequest('/api/apartments', {
            ids: params.purchase || params.promo ? state.customIds : urlParams.getAll('id'),
            per_page: 16,
            building_id: urlParams.getAll('id').length ? null : +params.complex,
            ...getFilters({ ...state, page: 1 }),
         }).then(res => {
            setIsLoading(false);

            setCards(res.data.items);
            setTotalPages(res.data.pages);
            setTotal(res.data.total);

            if (!scrollResolution) {
               setScrollResolution(true);
            }
         });
      }, 350),
      []
   );

   useEffect(() => {
      if (!fetching) return;

      if (isLoading) return;

      if (listingFlatsSelector.page + 1 > totalPages) {
         setFetching(false);
         return;
      }
      dispatch(lastTriggerFn('pagination'));
      setIsLoading(true);
      setIsLoadingMore(true);

      sendPostRequest('/api/apartments', {
         ids: params.purchase || params.promo ? customIds : urlParams.getAll('id'),
         per_page: 16,
         building_id: urlParams.getAll('id').length ? null : +params.complex,
         ...getFilters({ ...listingFlatsSelector, page: listingFlatsSelector.page + 1 }),
      }).then(res => {
         setIsLoading(false);
         setIsLoadingMore(false);
         setFetching(false);

         setCards([...cards, ...res.data.items]);
         setTotalPages(res.data.pages);
         setTotal(res.data.total);

         dispatch(setCurrentPage(listingFlatsSelector.page + 1));
      });
   }, [fetching]);

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

   return {
      types,
      tags,
      advantages,
      specialists,
      filterCount,
      buildingData,
      purchaseRequest,
      isLoading,
      isLoadingMore,
      params,
      cards,
      total,
      totalPages,
      listingFlatsSelector,
   };
};
