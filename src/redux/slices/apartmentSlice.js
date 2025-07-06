import { createSlice } from '@reduxjs/toolkit';

const initialState = {
   info: {
      type: null,
   },
   defaultPresents: [],
   selectedPresents: [],
};

const apartmentSlice = createSlice({
   name: 'apartment',
   initialState,
   reducers: {
      initPresents(state, action) {
         state.info = action.payload;
      },
      setMainPresents(state, action) {
         state.defaultPresents = [...action.payload];
      },
      addPresent(state, action) {
         const currentPrice = state.info.maxAmount - recalculation([...state.selectedPresents, action.payload]);
         if (currentPrice >= 0) {
            state.selectedPresents.push(action.payload);
            state.info.leftPrice = currentPrice;
         }
      },
      deletePresent(state, action) {
         const indexToRemove = state.selectedPresents.findLastIndex(item => item.id === action.payload);

         if (indexToRemove !== -1) {
            state.selectedPresents = state.selectedPresents.filter((_, index) => index !== indexToRemove);
         }

         state.info.leftPrice = state.info.maxAmount - recalculation(state.selectedPresents);
      },
   },
});

function recalculation(items) {
   return items.reduce((acc, item) => {
      if (item.newPrice !== null && item.newPrice > 0 && item.newPrice < item.oldPrice) {
         return (acc += item.oldPrice);
      }
      if (item.newPrice !== null && item.newPrice > item.oldPrice) {
         return (acc += item.newPrice);
      }
      return (acc += item.oldPrice - item.newPrice);
   }, 0);
}

export const { initPresents, addPresent, setMainPresents, deletePresent } = apartmentSlice.actions;

export default apartmentSlice.reducer;
