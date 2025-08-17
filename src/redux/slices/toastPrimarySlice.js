import { createSlice } from '@reduxjs/toolkit';

const initialState = {
   toast: {
      visible: false,
      data: null,
   },
};

const toastPrimarySlice = createSlice({
   name: 'toastPrimary',
   initialState,
   reducers: {
      addToastPrimary(state, action) {
         state.toast = {
            visible: true,
            data: action.payload,
         };
      },
      deleteToastPrimary(state) {
         state.toast = initialState;
      },
   },
});

export const { addToastPrimary, deleteToastPrimary } = toastPrimarySlice.actions;

export default toastPrimarySlice.reducer;
