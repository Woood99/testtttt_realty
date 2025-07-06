const normalizeLink = url => {
   // Если ссылка уже начинается с http:// или https://, оставляем как есть
   if (/^https?:\/\//i.test(url)) {
      return url;
   }

   // Добавляем https:// для ссылок типа google.com или www.google.com
   if (/^[a-zA-Z0-9-]+\.[a-zA-Z]{2,}/.test(url) || /^www\.[a-zA-Z0-9-]+\.[a-zA-Z]{2,}/.test(url)) {
      return `https://${url.replace(/^www\./, '')}`;
   }

   return url; // Если не похоже на URL, возвращаем как есть (или можно выбросить ошибку)
};

export default normalizeLink;