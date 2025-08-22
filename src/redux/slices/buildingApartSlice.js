import { createSlice } from '@reduxjs/toolkit';
import cloneDeep from 'lodash.clonedeep';

import updateAdditionalFilters from '../helpers/updateAdditionalFilters';

import { apartmentsFilterRooms, apartmentsFilterPrice, apartmentsAdditionalFilters } from '../../data/building';

import roomsToggleFunc from '../helpers/roomsToggleFunc';
import changeFieldInputFunc from '../helpers/changeFieldInput';
import resetFiltersFunc from '../helpers/resetFiltersFunc';

export const buildingApartFilterDefaultValue = {
   sortBy: 'priceAsc',
   tags: [],
   advantages: [],
   is_gift: false,
   is_discount: false,
   is_cashback: false,
   is_video: false,
   filtersMain: {
      price: updateAdditionalFilters([apartmentsFilterPrice]).price,
      rooms: updateAdditionalFilters([apartmentsFilterRooms]).rooms,
   },
   filtersAdditional: updateAdditionalFilters(apartmentsAdditionalFilters),

   data: {
      currentLayout: null,
      currentPlanning: null,
   },
};

const initialState = () => {
   const currentObject = cloneDeep(buildingApartFilterDefaultValue);
   return currentObject;
};

const buildingApartSlice = createSlice({
   name: 'buildingApartFilter',
   initialState: initialState(),

   reducers: {
      addFilterAdditional(state, action) {
         state.filtersAdditional = { ...action.payload, ...state.filtersAdditional };
      },

      roomsToggle(state, action) {
         roomsToggleFunc(state, action);
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
         state.filtersAdditional = resetFiltersFunc(state.filtersAdditional);
         state.tags = [];
         state.advantages = [];
         state.is_gift = false;
         state.is_video = false;
         state.is_discount = false;
         state.is_cashback = false;
      },

      setSort(state, action) {
         state.sortBy = action.payload;
      },
      filterToggle(state, action) {
         state[action.payload.name] = action.payload.value;
      },

      tagsToggle(state, action) {
         if (action.payload.value) {
            state[action.payload.type] = [...state[action.payload.type], action.payload.option.value];
         } else {
            state[action.payload.type] = state[action.payload.type].filter(item => item !== action.payload.option.value);
         }
      },
   },
});

export const { roomsToggle, changeFieldInput, resetFilters, changeFieldAdditional, addFilterAdditional, setSort, tagsToggle, filterToggle } =
   buildingApartSlice.actions;

export default buildingApartSlice.reducer;
