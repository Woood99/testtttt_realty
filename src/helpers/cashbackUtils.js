export const getMaxCashback = data => {
   if (!data || data.length === 0) {
      return {
         value: 0,
      };
   }
   return data.reduce((prev, current) => (prev.value > current.value ? prev : current));
};
