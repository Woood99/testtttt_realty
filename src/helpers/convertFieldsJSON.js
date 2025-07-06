const convertFieldsJSON = obj => {
   const result = {};

   for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
         const value = obj[key];

         if (typeof value === 'string' && (value.startsWith('[') || value.startsWith('{'))) {
            try {
               result[key] = JSON.parse(value);
            } catch (e) {
               result[key] = value;
            }
         } else {
            result[key] = value;
         }
      }
   }

   return result;
};

export default convertFieldsJSON;
