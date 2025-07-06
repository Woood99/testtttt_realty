import dayjs from 'dayjs';

export const isToday = date => {
   const today = dayjs();
   const dateToCheck = dayjs(date);

   return dateToCheck.isSame(today, 'day');
};

export const isYesterday = date => {
   const yesterday = dayjs().subtract(1, 'day');
   return dayjs(date).isSame(yesterday, 'day');
};

export const getLastSeenOnline = date => {
   const parsedDate = dayjs(date);

   if (isToday(date)) {
      return `Сегодня в ${parsedDate.format('HH:mm')}`;
   }

   if (isYesterday(date)) {
      return `Вчера в ${parsedDate.format('HH:mm')}`;
   }
   if (parsedDate.isSame(dayjs(), 'year')) {
      return parsedDate.format('D MMMM в HH:mm');
   }

   return parsedDate.format('D MMMM YYYY [в] HH:mm');
};

export const getLastOnline = date => {
   const parsedDate = dayjs(date);

   if (isToday(date)) {
      return parsedDate.format('HH:mm');
   }
   
   if (parsedDate.isSame(dayjs(), 'year')) {
      return parsedDate.format('D MMMM ');
   }

   return parsedDate.format('D MMMM YYYY г.');
};
