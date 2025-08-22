const isLink = str => {
   const urlRegex = /^(https?:\/\/)?([\w-]+\.)+[\w-]+(\/[\w\-\.\/?%&=@#]*)?$/;

   if (urlRegex.test(str)) {
      return true;
   }

   if (/^www\.[\w-]+\.[\w-]+(\/.*)?$/.test(str)) {
      return true;
   }

   if (/^[\w-]+\.[\w-]+(\/.*)?$/.test(str) && !str.includes(' ')) {
      return true;
   }

   return false;
};

export default isLink;