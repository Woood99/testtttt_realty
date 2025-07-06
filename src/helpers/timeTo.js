export function timeToSeconds(timeString) {
   const timeParts = timeString.split(':');
   if (timeParts.length === 2) {
      timeParts.unshift('00');
   }
   const hours = parseInt(timeParts[0], 10);
   const minutes = parseInt(timeParts[1], 10);
   const seconds = parseInt(timeParts[2], 10);

   return hours * 3600 + minutes * 60 + seconds;
}
