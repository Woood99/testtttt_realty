export const pricesClassName = apartments => {
   const length = apartments.length;
   if (length === 0) return '';
   if (length <= 2) {
      return '!grid-rows-[1fr]';
   }
   if (length <= 4) {
      return '!grid-rows-[1fr_1fr]';
   }
   if (length <= 6) {
      return '!grid-rows-[1fr_1fr_1fr]';
   }
   if (length >= 7) {
      return '!grid-rows-[1fr_1fr_1fr_1fr]';
   }
};
