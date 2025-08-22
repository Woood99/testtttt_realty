import { createSlice } from '@reduxjs/toolkit';
import cloneDeep from 'lodash.clonedeep';

import updateAdditionalFilters from '../helpers/updateAdditionalFilters';

import roomsToggleFunc from '../helpers/roomsToggleFunc';
import changeFieldInputFunc from '../helpers/changeFieldInput';
import { apartmentsAdditionalFilters, apartmentsFilterPrice, apartmentsFilterRooms } from '../../data/building';
import resetFiltersFunc from '../helpers/resetFiltersFunc';

const urlParams = new URLSearchParams(window.location.search);

export const listingDefaultValue = {
   lastTrigger: 'filter',
   page: 1,
   filters: {
      sortBy: urlParams.get('sort') || 'priceAsc',
      tags: urlParams.getAll('tags').map(item => +item),
      advantages: urlParams.getAll('advantages').map(item => +item),
      is_gift: !!urlParams.get('is_gift') || false,
      is_video: !!urlParams.get('is_video') || false,
      is_cashback: !!urlParams.get('is_cashback') || false,
      is_discount: !!urlParams.get('is_discount') || false,
      filtersMain: {
         price: {
            ...updateAdditionalFilters([apartmentsFilterPrice]).price,
            value: {
               ...(urlParams.get('price_from') ? { priceFrom: urlParams.get('price_from') } : {}),
               ...(urlParams.get('price_to') ? { priceTo: urlParams.get('price_to') } : {}),
            },
         },
         rooms: {
            ...updateAdditionalFilters([apartmentsFilterRooms]).rooms,
            value: urlParams.getAll('rooms').map(item => +item),
         },
         area: urlParams.get('area') || null,
      },
      filtersAdditional: {
         area: {
            ...updateAdditionalFilters([...apartmentsAdditionalFilters]).area,
            value: {
               ...(urlParams.get('area_from') ? { areaFrom: urlParams.get('area_from') } : {}),
               ...(urlParams.get('area_to') ? { areaTo: urlParams.get('area_to') } : {}),
            },
         },
      },
   },
};

const listingFlatsSlice = createSlice({
   name: 'listingFlats',
   initialState: cloneDeep(listingDefaultValue),
   reducers: {
      addFilterAdditional(state, action) {
         state.filters.filtersAdditional = { ...action.payload, ...state.filters.filtersAdditional };
      },

      roomsToggle(state, action) {
         roomsToggleFunc(state.filters, action);
      },

      changeFieldInput(state, action) {
         changeFieldInputFunc(state.filters, action);
      },

      changeFieldAdditional(state, action) {
         const currentFilter = state.filters.filtersAdditional[action.payload.name];

         if (!currentFilter) return;

         currentFilter.value = action.payload.selectedOptions;
      },

      resetFilters(state) {
         state.filters.filtersMain = resetFiltersFunc(state.filters.filtersMain);
         state.filters.filtersAdditional = resetFiltersFunc(state.filters.filtersAdditional);
         state.filters.tags = [];
         state.filters.advantages = [];
         state.filters.is_gift = false;
         state.filters.is_video = false;
         state.filters.is_discount = false;
         state.filters.is_cashback = false;
      },

      setSort(state, action) {
         state.filters.sortBy = action.payload;
      },
      filterToggle(state, action) {
         state.filters[action.payload.name] = action.payload.value;
      },

      tagsToggle(state, action) {
         if (action.payload.value) {
            state.filters[action.payload.type] = [...state.filters[action.payload.type], action.payload.option.value];
         } else {
            state.filters[action.payload.type] = state.filters[action.payload.type].filter(item => item !== action.payload.option.value);
         }
      },

      lastTriggerFn(state, action) {
         state.lastTrigger = action.payload;
      },

      setCurrentPage(state, action) {
         state.page = action.payload;
      },
   },
});

export const {
   roomsToggle,
   changeFieldInput,
   resetFilters,
   changeFieldAdditional,
   addFilterAdditional,
   setSort,
   tagsToggle,
   filterToggle,
   lastTriggerFn,
   setCurrentPage,
} = listingFlatsSlice.actions;

export default listingFlatsSlice.reducer;
