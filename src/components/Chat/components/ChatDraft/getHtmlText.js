export const getHtmlText = html => {
   const tmp = document.createElement('div');
   tmp.innerHTML = html;

   let text = tmp.textContent || tmp.innerText || '';
   text = text.replace(/\u00A0/g, ' ');
   text = text.replace(/\s+/g, ' ').trim();

   return text;
};
