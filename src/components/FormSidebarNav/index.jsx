import React, { useEffect, useState } from 'react';

const FormSidebarNav = ({ init, items, errors, watched }) => {
   const [errorsIds, setErrorsIds] = useState([]);

   useEffect(() => {
      if (!init) return;

      const storage = [];
      for (const key in errors) {
         const errorsElement = document.querySelector(`[data-error="${key}"]`);
         if (!errorsElement) break;
         const currentBlock = errorsElement.closest('[data-block]');
         if (!currentBlock) break;
         const currentItem = items.find(item => item.name === currentBlock.dataset.block);
         for (const item of items) {
            if (currentItem.id === item.id) {
               storage.push(item.id);
            }
         }
      }
      setErrorsIds(Array.from(new Set(storage)));
   }, [watched]);

   return (
      <nav className="flex flex-col gap-4 items-start">
         {items.map(item => {
            return (
               <button type="button" className={`text-left flex items-center gap-2.5 text-primary400`} key={item.id}>
                  {init && errorsIds.includes(item.id) ? (
                     <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="currentColor"
                        viewBox="0 0 16 16"
                        width={17}
                        height={17}
                        className="flex-shrink-0 fill-red">
                        <path
                           fillRule="evenodd"
                           d="M15 8A7 7 0 1 1 1 8a7 7 0 0 1 14 0zM7 5a1 1 0 0 1 2 0v3a1 1 0 0 1-2 0V5zm1 5a1 1 0 1 0 0 2 1 1 0 0 0 0-2z"></path>
                     </svg>
                  ) : (
                     <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="currentColor"
                        viewBox="0 0 16 16"
                        width={17}
                        height={17}
                        className={`flex-shrink-0 ${init && !errorsIds.includes(item.id) ? 'fill-green' : ''}`}>
                        <path
                           fillRule="evenodd"
                           d="M8 15A7 7 0 1 0 8 1a7 7 0 0 0 0 14zm3.8-8.3a1 1 0 0 0-1.42-1.4L7.2 8.46a.28.28 0 0 1-.4 0l-1.1-1.1A1 1 0 0 0 4.3 8.8l2.08 2.09c.34.34.9.34 1.24 0L11.8 6.7z"></path>
                     </svg>
                  )}
                  <span className={`${init && !errorsIds.includes(item.id) ? 'text-dark' : 'text-primary400'}`}>{item.title}</span>
               </button>
            );
         })}
      </nav>
   );
};

export default FormSidebarNav;
