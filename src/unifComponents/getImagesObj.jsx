const getImagesObj = (arr = []) => {
   return arr.map((file, index) => {
      return {
         id: index + 1,
         image: file.image || URL.createObjectURL(file),
         file: file.path || file.name ? file : file.file,
      };
   });
};

export const getVideoObj = (arr = []) => {
   return arr.map((file, index) => {
      return {
         id: index + 1,
         video: file.video || URL.createObjectURL(file),
         file: file.path || file.name ? file : file.file,
      };
   });
};

export const getPdfObj = (arr = []) => {
   return arr.map((file, index) => {
      return {
         id: index + 1,
         pdf: file.pdf || URL.createObjectURL(file),
         file: file.path || file.name ? file : file.file,
      };
   });
};

export default getImagesObj;
