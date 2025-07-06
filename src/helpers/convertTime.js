import plural from 'plural-ru';

const convertTime = ms => {
   const seconds = Math.floor((ms / 1000) % 60);
   const minutes = Math.floor((ms / (1000 * 60)) % 60);
   const hours = Math.floor((ms / (1000 * 60 * 60)) % 24);
   const days = Math.floor(ms / (1000 * 60 * 60 * 24));

   return {
      days,
      hours,
      minutes,
      seconds,
   };
};

export default convertTime;

export const getTimeString = seconds => {
   const data = convertTime(seconds * 1000);
   let string = '';

   if (data.days && data.days !== 0) {
      string += `${data.days} ${plural(data.days, 'день', 'дня', 'дней')} `;
   }
   if (data.hours && data.hours !== 0) {
      string += `${data.hours} ${plural(data.hours, 'час', 'часа', 'часов')}`;
   }
   return string;
};
