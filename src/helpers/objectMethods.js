export const getFilteredObject = (condition, obj) => {
   return condition ? obj : {};
};

export const mergeArraysFromObject = obj => {
   return Object.values(obj).flat();
};
