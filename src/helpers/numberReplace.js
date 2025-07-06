const numberReplace = number => {
   number = typeof number === 'number' ? String(number) : number.replace(/ /g, '');
   const result = number.match(/^(.*?)((?:[,.]\d+)?|)$/)[1].replace(/\B(?=(?:\d{3})*$)/g, ' ');
   return result === ' ' ? '' : result;
};

export default numberReplace;
