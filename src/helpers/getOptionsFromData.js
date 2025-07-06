import { isArray, isObject } from './isEmptyArrObj';

export const getOptionFromData = (data, labelName = 'name', valueName = 'id') => {
   if (!isObject(data)) {
      return {};
   }

   return {
      label: data[labelName],
      value: data[valueName],
   };
};
export const getOptionsFromData = (data, labelName = 'name', valueName = 'id') => {
   if (!isArray(data)) {
      return [];
   }

   return data.map(item => {
      return {
         label: item[labelName],
         value: item[valueName],
      };
   });
};
