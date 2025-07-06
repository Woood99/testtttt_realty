const findObjectWithMinValue = (arr, key) => {
   if (!arr) return;
   if (arr.length === 0) return;

   let minObject = arr[0];
   let minValue = arr[0][key];

   for (let i = 1; i < arr.length; i++) {
      if (arr[i][key] < minValue) {
         minValue = arr[i][key];
         minObject = arr[i];
      }
   }

   return minObject;
};

export default findObjectWithMinValue;
