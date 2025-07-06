import cloneDeep from 'lodash.clonedeep';

const updateAdditionalFilters = arr => {
   const clone = cloneDeep(arr);
   let res = {};
   clone.forEach(item => {
      res[item.name] = { ...item };
   });

   return res;
};

export default updateAdditionalFilters;
