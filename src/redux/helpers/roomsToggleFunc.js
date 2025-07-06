const roomsToggleFunc = (state, action, type = 'multiple') => {
   if (type === 'single') {
      state.filtersMain.rooms.value = action.payload.value ? [action.payload.id] : [];
   }
   if (type === 'multiple') {
      if (action.payload.value) {
         state.filtersMain.rooms.value.push(action.payload.id);
      } else {
         state.filtersMain.rooms.value = state.filtersMain.rooms.value.filter(item => item !== action.payload.id);
      }
   }
};

export default roomsToggleFunc;
