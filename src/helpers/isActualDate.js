import dayjs from 'dayjs';

export const isActualDate = (date_start, date_end) => {
   if (!date_start || !date_end) return true;

   const now = dayjs();
   const start = dayjs.unix(date_start);
   const end = dayjs.unix(date_end);

   return now.isAfter(start) && now.isBefore(end);
};
