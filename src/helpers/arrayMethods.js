export const getLastElementArray = arr => {
   if (arr.length === 0) {
      return undefined;
   }
   return arr[arr.length - 1];
};

export const getFirstElementArray = arr => {
   if (arr.length === 0) {
      return undefined;
   }
   return arr[0];
};

export const combinedArray = (...arrays) => {
   const combinedArray = arrays.flat().filter(item => item);
   const uniqueNumbers = new Set(combinedArray);

   return Array.from(uniqueNumbers);
};

export const combinedArrayLength = (...arrays) => {
   return combinedArray(...arrays).length;
};

export const getSumOfArray = (...arrays) => {
   const combinedArray = arrays.flat().filter(item => item);
   return combinedArray.reduce((sum, current) => sum + current, 0);
};

export const removeDuplicatesArray = array => {
   const seen = new Set();
   return array.filter(obj => {
      const key = JSON.stringify(obj);
      if (seen.has(key)) {
         return false;
      }
      seen.add(key);
      return true;
   });
};

export const mapOrNull = (array, property = 'value') => (array && Array.isArray(array) && array.length ? array.map(item => item?.[property]) : null);
