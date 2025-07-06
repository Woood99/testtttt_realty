function clearData(data) {
   if (Array.isArray(data)) {
      data.length = 0;
   } else if (typeof data === 'object' && data !== null) {
      Object.keys(data).forEach(key => {
         if (typeof data[key] === 'object' && data[key] !== null) {
            clearData(data[key]);
         } else {
            delete data[key];
         }
      });
   }
}

export default clearData;
