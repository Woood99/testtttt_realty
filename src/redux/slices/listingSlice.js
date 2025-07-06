import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import qs from 'qs';
import cloneDeep from 'lodash.clonedeep';

import updateAdditionalFilters from '../helpers/updateAdditionalFilters';

import { filterPrice, filterRooms } from '../../data/listingFilters';

import roomsToggleFunc from '../helpers/roomsToggleFunc';
import changeFieldInputFunc from '../helpers/changeFieldInput';
import clearData from '../../helpers/clearData';
import { getDataRequest } from '../../api/requestsApi';

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
   sortBy: 'price_asc',
   mapLocationCoordinates: [],
   filtersOther: {
      tags: [],
      advantages: [],
      stickers: [],
      is_video: false,
      is_gift: false,
   },
   filtersMain: {
      price: updateAdditionalFilters([filterPrice]).price,
      rooms: updateAdditionalFilters([filterRooms]).rooms,
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
         state.filtersMain = cloneDeep(listingDefaultValue.filtersMain);
         state.filtersOther = cloneDeep(listingDefaultValue.filtersOther);
         Object.keys(state.filtersAdditional).forEach(key => {
            clearData(state.filtersAdditional[key].value);
         });
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
               if (filter.type === 'field-fromTo') {
                  return { ...filter, value: {} };
               }
               return filter;
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
