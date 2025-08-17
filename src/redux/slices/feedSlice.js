import { createSlice } from '@reduxjs/toolkit';
import cloneDeep from 'lodash.clonedeep';

const urlParams = new URLSearchParams(window.location.search);

const feedDefaultValue = {
   page: 1,
   type: '',
   values: {
      city: {},
      developers: [],
      complexes: [],
      authors: [],
      tags: urlParams.getAll('tags').map(item => +item),
   },
   filters: {
      developers: [],
      complexes: [],
      authors: [],
   },
};

const feedSlice = createSlice({
   name: 'feed',
   initialState: cloneDeep(feedDefaultValue),
   reducers: {
      setFiltersFeed(state, action) {
         state.filters[action.payload.name] = action.payload.value;
      },

      setValueFeed(state, action) {
         state.values[action.payload.name] = action.payload.value;
      },

      setTagsFeed(state, action) {
         if (action.payload.value) {
            state.values.tags = [...state.values.tags, action.payload.option.value];
         } else {
            state.values.tags = state.values.tags.filter(item => item !== action.payload.option.value);
         }
      },
      setCurrentPage(state, action) {
         state.page = action.payload;
      },
      setType(state, action) {
         state.type = action.payload;
      },
      resetFiltersFeed(state, action) {
         if (action.payload.city) {
            state.values.city = action.payload.city;
         }
         state.values.developers = [];
         state.values.complexes = [];
         state.values.authors = [];
         state.values.tags = [];

         state.filters.developers = [];
         state.filters.complexes = [];
         state.filters.authors = [];
      },
   },
});

export const { setFiltersFeed, setValueFeed, setTagsFeed, resetFiltersFeed, setCurrentPage, setType } = feedSlice.actions;

export default feedSlice.reducer;
