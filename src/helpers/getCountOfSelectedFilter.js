import isEmptyArrObj from './isEmptyArrObj';

export function getCountOfSelectedFilter(arr) {
   let res = 0;
   arr.forEach(item => {
      Object.keys(item).forEach(key => {
         if (item[key]) {
            if (item[key] === true) {
               res++;
            } else {
               if (!isEmptyArrObj(item[key].value) && !isEmptyArrObj(item[key]) && item[key] !== false) {
                  res++;
               }
            }
         }
      });
   });

   return res;
}

export function getCountOfSelectedFilterObj(obj, exceptionsNames = [], exceptionsObj = {}) {
   let res = 0;

   Object.keys(obj).forEach(key => {
      const item = obj[key];
      if (item && key !== 'page') {
         if (!exceptionsNames.includes(key)) {
            if (Array.isArray(item) || typeof item === 'object') {
               if (!isEmptyArrObj(item)) {
                  res++;
               }
            } else {
               if (Boolean(item)) {
                  if (exceptionsObj[key] !== item) {
                     res++;
                  }
               }
            }
         }
      }
   });

   return res;
}
