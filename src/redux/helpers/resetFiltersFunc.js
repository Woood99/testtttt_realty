const resetFiltersFunc = data => {
   let newState = {};
   for (const key in data) {
      const item = data[key];
      if (!item) continue;
      if (Array.isArray(item.value)) {
         newState = { ...newState, [key]: { ...item, value: [] } };
      } else if (typeof item.value === 'object' && item.value !== null) {
         newState = { ...newState, [key]: { ...item, value: {} } };
      }
   }
   return newState;
};

export default resetFiltersFunc;
