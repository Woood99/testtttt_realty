const getTextLength = html => {
   if (!html) return;

   const tempDiv = document.createElement('div');
   tempDiv.innerHTML = html;

   const textContent = tempDiv.textContent || tempDiv.innerText || '';

   return textContent.replace(/\s+/g, ' ').trim().length;
};

export default getTextLength;
