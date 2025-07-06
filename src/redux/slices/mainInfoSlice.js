import { createSlice } from '@reduxjs/toolkit';

const initialState = {
   cities: [],
   userInfo: {},
   authLoading: true,
   likes: [],
   city: {
      id: null,
      name: '',
      data: [],
   },
};

const mainInfoSlice = createSlice({
   name: 'mainInfo',
   initialState,
   reducers: {
      updateMainInfo(state, action) {
         state.city = action.payload;
      },
      setCities(state, action) {
         state.cities = action.payload;
      },
      setUserInfo(state, action) {
         state.userInfo = action.payload;
         state.authLoading = false;
      },
      setLikes(state, action) {
         state.likes = action.payload;
      },
   },
});

export const { updateMainInfo, setCities, setUserInfo, setLikes } = mainInfoSlice.actions;

export default mainInfoSlice.reducer;
