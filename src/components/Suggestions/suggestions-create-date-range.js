import dayjs from 'dayjs';

export const suggestionsCreateDateRange = (days = 1) => {
   const currentDate = dayjs();
   const toDate = currentDate.subtract(days, 'day');

   return {
      from: dayjs(toDate).format('YYYY-MM-DD HH:mm:ss'),
      to: dayjs(currentDate).format('YYYY-MM-DD HH:mm:ss'),
   };
};
