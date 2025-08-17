import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import qs from 'qs';
import cloneDeep from 'lodash.clonedeep';

import updateAdditionalFilters from '../helpers/updateAdditionalFilters';

import { filterPrice, filterRooms } from '../../data/listingFilters';

import roomsToggleFunc from '../helpers/roomsToggleFunc';
import changeFieldInputFunc from '../helpers/changeFieldInput';
import clearData from '../../helpers/clearData';
import { getDataRequest } from '../../api/requestsApi';
import { isNumber } from '../../helpers/isEmptyArrObj';
import resetFiltersFunc from '../helpers/resetFiltersFunc';

const urlParams = new URLSearchParams(window.location.search);

export const fetchFilters = createAsyncThunk('listing/fetchFilters', async params => {
   const { data } = await getDataRequest('/api/catalog/filters', params);
   return data;
});

export const listingDefaultValue = {
   type: 'list',
   page: 1,
   mapVisiblePlacemarks: [],
   mapPlacemarks: [],
   resultFilters: {},
   startIsLoading: true,
   isInitMap: false,
   lastTrigger: 'filter',
   sortBy: urlParams.get('sort') || 'price_asc',
   mapLocationCoordinates: [],
   filtersOther: {
      tags: urlParams.has('tags')
         ? urlParams
              .getAll('tags')
              .join(',')
              .split(',')
              .map(item => +item)
         : [],
      advantages: urlParams.has('advantages')
         ? urlParams
              .getAll('advantages')
              .join(',')
              .split(',')
              .map(item => +item)
         : [],
      stickers: urlParams.has('stickers')
         ? urlParams
              .getAll('stickers')
              .join(',')
              .split(',')
              .map(item => +item)
         : [],
      is_video: !!urlParams.get('is_video'),
      is_gift: !!urlParams.get('is_gift'),
      is_discount: !!urlParams.get('is_discount'),
      is_cashback: !!urlParams.get('is_cashback'),
   },
   filtersMain: {
      price: {
         ...updateAdditionalFilters([filterPrice]).price,
         value: {
            ...(urlParams.has('priceFrom') && { priceFrom: urlParams.get('priceFrom') }),
            ...(urlParams.has('priceTo') && { priceTo: urlParams.get('priceTo') }),
         },
      },
      rooms: {
         ...updateAdditionalFilters([filterRooms]).rooms,
         value: urlParams.has('rooms') ? [+urlParams.get('rooms')] : [],
      },
   },
   filtersAdditional: {},
};

const initialState = () => {
   const currentObject = cloneDeep(listingDefaultValue);
   if (window.location.search) {
      const params = qs.parse(window.location.search.substring(1));

      if (params.type) {
         currentObject.type = params.type;
      }
   }

   return currentObject;
};

const listingSlice = createSlice({
   name: 'listing',
   initialState: initialState(),
   reducers: {
      roomsToggle(state, action) {
         roomsToggleFunc(state, action, 'single');
      },

      changeType(state, action) {
         state.type = action.payload;
      },

      changeFieldInput(state, action) {
         changeFieldInputFunc(state, action);
      },

      changeFieldAdditional(state, action) {
         const currentFilter = state.filtersAdditional[action.payload.name];
         if (!currentFilter) return;
         currentFilter.value = action.payload.selectedOptions;
      },

      resetFilters(state) {
         state.filtersMain = resetFiltersFunc(state.filtersMain);
         state.filtersOther = {
            tags: [],
            advantages: [],
            stickers: [],
            is_video: false,
            is_gift: false,
            is_discount: false,
            is_cashback: false,
         };
         state.filtersAdditional = resetFiltersFunc(state.filtersAdditional);

         if (state.type === 'list') {
            state.mapVisiblePlacemarks = null;
            state.mapLocationCoordinates = [];
         }
      },

      setVisiblePlacemarks(state, action) {
         state.mapVisiblePlacemarks = [...action.payload];
      },

      setVisiblePlacemarksNull(state) {
         state.mapVisiblePlacemarks = null;
      },

      setMapPlacemarks(state, action) {
         state.mapPlacemarks = action.payload;
      },

      tagsToggle(state, action) {
         if (action.payload.value) {
            state.filtersOther[action.payload.type] = [...state.filtersOther[action.payload.type], action.payload.option.value];
         } else {
            state.filtersOther[action.payload.type] = state.filtersOther[action.payload.type].filter(item => item !== action.payload.option.value);
         }
      },

      additionalParametersToggle(state, action) {
         state.filtersOther[action.payload.option.value] = action.payload.value;
      },

      setResultFilters(state, action) {
         state.resultFilters = action.payload;
      },

      setSort(state, action) {
         state.sortBy = action.payload;
      },

      startIsLoading(state, action) {
         state.startIsLoading = false;
      },

      setCurrentPage(state, action) {
         state.page = action.payload;
      },

      lastTriggerFn(state, action) {
         state.lastTrigger = action.payload;
      },

      setMapInit(state, action) {
         state.isInitMap = action.payload;
      },

      setMapLocationCoordinates(state, action) {
         state.mapLocationCoordinates = action.payload;
         if (action.payload.length === 0 && state.type === 'list') {
            state.mapVisiblePlacemarks = null;
            state.mapLocationCoordinates = [];
         }
      },
   },
   extraReducers: builder => {
      builder
         .addCase(fetchFilters.pending, state => {
            state.filtersAdditional = {};
         })
         .addCase(fetchFilters.fulfilled, (state, action) => {
            const updateFilters = action.payload.map(filter => {
               let currentFilter = filter;

               if (currentFilter.type === 'field-fromTo') {
                  currentFilter = {
                     ...currentFilter,
                     value: {},
                  };
               }
               const filterName = currentFilter.name;

               if (urlParams.has(filterName)) {
                  const valuesOptions = currentFilter.options.filter(item => {
                     return urlParams
                        .getAll(filterName)
                        .join(',')
                        .split(',')
                        .map(el => (isNumber(item.value) ? +el : el))
                        .includes(item.value);
                  });

                  currentFilter = {
                     ...currentFilter,
                     value: valuesOptions,
                  };
               }
               if (urlParams.has('area__From') && filterName === 'area') {
                  currentFilter = {
                     ...currentFilter,
                     value: {
                        ...currentFilter.value,
                        area__From: urlParams.get('area__From'),
                     },
                  };
               }
               if (urlParams.has('area__To') && filterName === 'area') {
                  currentFilter = {
                     ...currentFilter,
                     value: {
                        ...currentFilter.value,
                        area__To: urlParams.get('area__To'),
                     },
                  };
               }
               return currentFilter;
            });

            state.filtersAdditional = updateAdditionalFilters(updateFilters);
         })
         .addCase(fetchFilters.rejected, state => {
            state.filtersAdditional = {};
         });
   },
});

export const {
   roomsToggle,
   changeType,
   changeFieldInput,
   resetFilters,
   changeFieldAdditional,
   setVisiblePlacemarks,
   setResultFilters,
   startIsLoading,
   setCurrentPage,
   lastTriggerFn,
   setVisiblePlacemarksNull,
   setSort,
   tagsToggle,
   additionalParametersToggle,
   setMapPlacemarks,
   setMapInit,
   setMapLocationCoordinates,
} = listingSlice.actions;

export default listingSlice.reducer;
