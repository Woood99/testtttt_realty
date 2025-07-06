const isEmptyArrObj = value => {
   if (Array.isArray(value)) {
      return value.length === 0;
   } else if (typeof value === 'object' && value !== null) {
      return Object.keys(value).length === 0;
   }
   return false;
};

export const isObject = value => {
   return value !== null && typeof value === 'object' && Object.prototype.toString.call(value) === '[object Object]';
};

export const isArray = value => {
   return Array.isArray(value);
};

export const isNumber = value => {
   return typeof value === 'number' && !isNaN(value) && isFinite(value);
};

export default isEmptyArrObj;
