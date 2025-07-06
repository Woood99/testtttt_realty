import { isArray, isObject } from '../../../helpers/isEmptyArrObj';

export const getAttrData = (attributes, dataForm) => {
   const attrData = {};
   const combinedAttributes = attributes.flatMap(obj => obj.items);

   attributes?.forEach(attr => {
      attr.items.forEach(item => {
         if (item.type === 'flag') {
            attrData[item.name] = {
               value: typeof dataForm[item.name] === 'string' ? dataForm[item.name] : dataForm[item.name][0],
            };
         }
         if (item.type === 'list-single') {
            attrData[item.name] = {
               value: dataForm[item.name][0] || '',
            };
         }
         if (item.type === 'list-multiple') {
            attrData[item.name] = dataForm[item.name].map(item => ({
               value: item,
            }));
         }
         if (item.type === 'text-field') {
            attrData[item.name] = {
               value: dataForm[item.name],
            };
         }
         delete dataForm[item.name];
      });
   });

   for (const key in attrData) {
      const element = attrData[key];
      const currentAttributesByName = combinedAttributes.find(item => item.name === key);
      if (isArray(element)) {
         const newArray = element.filter(item => currentAttributesByName['available-values'].includes(item.value));
         attrData[key] = newArray;
      }
      if (isObject(element)) {
         const newObject = currentAttributesByName['available-values'].includes(element.value);
         if (newObject) {
            attrData[key] = { value: element.value };
         }
      }
   }

   return attrData;
};
