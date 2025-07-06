const scrollToFirstErrorElement = (errors, gap = 100) => {
   setTimeout(() => {
      if (Object.keys(errors).length > 0) {
         const firstErrorElement = document.querySelector(`[data-error="${Object.keys(errors)[0]}"]`);
         if (firstErrorElement) {
            window.scrollTo({
               top: firstErrorElement.offsetTop - gap,
               behavior: 'smooth',
            });
         }
      }
   }, 5);
};

export default scrollToFirstErrorElement;
