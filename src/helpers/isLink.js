const isLink = str => {
   const urlRegex = /^(https?:\/\/)?([\w-]+\.)+[\w-]+(\/[\w\-\.\/?%&=@#]*)?$/;

   // Проверяем стандартные URL (http/https)
   if (urlRegex.test(str)) {
      return true;
   }

   // Проверяем ссылки с www (без http/https)
   if (/^www\.[\w-]+\.[\w-]+(\/.*)?$/.test(str)) {
      return true;
   }

   // Проверяем короткие URL типа "example.com"
   if (/^[\w-]+\.[\w-]+(\/.*)?$/.test(str) && !str.includes(' ')) {
      return true;
   }

   return false;
};

export default isLink;