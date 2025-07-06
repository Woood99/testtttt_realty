const convertSum = number => {
   number = String(number);
   number = number.replace(/\s/g, '');
   let result;
   if (number < 1000) {
      result = Number(number);
      return `${result} ₽`;
   }

   result =
      Math.floor(Number(number)) >= 1.0e6
         ? (Math.round(Number(number)) / 1.0e6).toFixed(1) + ' млн.'
         : Math.round(Number(number)) >= 1.0e3
         ? (Math.round(Number(number)) / 1.0e3).toFixed(1) + ' тыс.'
         : Math.round(Number(number));
   return result.replace('.0', '');
};

export default convertSum;
