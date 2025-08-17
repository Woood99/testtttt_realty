export const isValidTime = timeString => {
   return /^([01][0-9]|2[0-3]):[0-5][0-9]$/.test(timeString);
};
