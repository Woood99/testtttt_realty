import { useState, useEffect } from 'react';

export const useHistoryState = (initialState = false) => {
   const [isOpen, setIsOpen] = useState(initialState);

   useEffect(() => {
      if (isOpen) {
         window.history.pushState({ popup: true }, '');
      } else {
         window.history.replaceState({ popup: false }, '');
      }

      const handlePopState = () => {
         setIsOpen(false);
      };

      window.addEventListener('popstate', handlePopState);

      return () => {
         window.removeEventListener('popstate', handlePopState);
      };
   }, [isOpen]);

   return [
      isOpen,
      value => {
         setIsOpen(value);
         if (!value && isOpen) {
            window.history.back();
         }
      },
   ];
};
