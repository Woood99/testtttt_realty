import { createSlice } from '@reduxjs/toolkit';
import { v4 as uuidv4 } from 'uuid';

const initialState = {
   initApp: false,
   notification: false,
   notificationLogout: false,
   selectAccLogModalOpen: false,
   isConnectEcho: false,
   tabId: uuidv4(),
};

const helpSlice = createSlice({
   name: 'helpSlice',
   initialState,
   reducers: {
      toggleNotificationLogout(state, action) {
         state.notificationLogout = action.payload;
      },
      setInitApp(state, action) {
         state.initApp = action.payload;
      },
      setSelectAccLogModalOpen(state, action) {
         state.selectAccLogModalOpen = action.payload;
      },
      setIsConnectEcho(state, action) {
         state.isConnectEcho = action.payload;
      },
   },
});

export const { toggleNotificationLogout, setInitApp, setSelectAccLogModalOpen, setIsConnectEcho } = helpSlice.actions;

export default helpSlice.reducer;
