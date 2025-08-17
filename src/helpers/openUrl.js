export const openUrl = url => {
   const newWindow = window.open(url, '_blank');
   if (!newWindow) {
      const link = document.createElement('a');
      link.href = url;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      link.click();
   }
};
