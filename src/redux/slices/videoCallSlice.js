import { createSlice } from '@reduxjs/toolkit';

const initialState = {
   isCalling: false,
   isReceivingCall: false,
   videoCallDelayTimer: false,
};

const videoCallSlice = createSlice({
   name: 'videoCall',
   initialState,
   reducers: {
      setIsCalling: (state, action) => {
         state.isCalling = action.payload; // я звоню
      },
      setIsReceivingCall: (state, action) => {
         state.isReceivingCall = action.payload; // мне звонят
      },
      setVideoCallDelayTimer: (state, action) => {
         state.videoCallDelayTimer = action.payload; // таймер для делая
      },
   },
});

export const { setIsCalling, setIsReceivingCall, setVideoCallDelayTimer } = videoCallSlice.actions;

export default videoCallSlice.reducer;
