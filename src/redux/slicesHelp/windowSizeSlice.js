import { createSlice } from '@reduxjs/toolkit';

const windowSizeSlice = createSlice({
   name: 'windowSize',
   initialState: {
      width: window.innerWidth,
      isDesktop: window.innerWidth > 1222,
      viewportHeight: window.innerHeight,
   },
   reducers: {
      setWindowSize: (state, action) => {
         state.width = action.payload.width;
         state.isDesktop = action.payload.width > 1222;
         state.viewportHeight = action.payload.height;
      },
   },
});

export const { setWindowSize } = windowSizeSlice.actions;
export default windowSizeSlice.reducer;
