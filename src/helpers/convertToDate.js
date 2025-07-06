const convertToDate = (date, format, separator = '.') => {
   const parts = date.split(separator);
   switch (format) {
      case 'DD-MM-YYYY':
         return `${parts[2]}-${parts[1]}-${parts[0]}`;

      default:
         return 'Invalid Format';
   }
};

export default convertToDate;
