export const capitalizedWord = string => {
   if (typeof string !== 'string') return '';
   return string.charAt(0).toUpperCase() + string.slice(1);
};

export const getFirstLetter = (string, upperCase = false) => {
   if (typeof string !== 'string') return '';
   let letter = string.charAt(0);
   if (upperCase) {
      letter = letter.toUpperCase();
   }

   return letter;
};

export const getShortNameSurname = (name, surname) => {
   return `${capitalizedWord(name || '')} ${surname ? `${getFirstLetter(surname || '', true)}.` : ''}`;
};

export const capitalizeWords = (...words) => {
   return words
      .filter(item => item)
      .map(word => {
         if (!word) return;
         const wordWithoutSpaces = word.trim();
         return wordWithoutSpaces.charAt(0).toUpperCase() + wordWithoutSpaces.slice(1);
      })
      .join(' ');
};

export const removeWordFromText = (text, word) => {
   const parts = text.split(', ');
   if (parts.length > 1) {
      return parts.filter(item => item.toLowerCase() !== word.toLowerCase()).join(', ');
   }
};

export const stringToNumber = str => {
   return parseFloat(str.replace(/\s+/g, ''));
};
