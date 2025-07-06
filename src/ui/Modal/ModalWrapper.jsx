import React, { useEffect } from 'react';

import disableScroll from '../../helpers/disableScroll';
import enableScroll from '../../helpers/enableScroll';

const ModalWrapper = ({ condition, children }) => {
   useEffect(() => {
      if (Boolean(condition)) {
         disableScroll();
      } else {
         const modals = document.querySelectorAll('.modal-overlay');
         const modalsDisplayNoActive = Array.from(modals).filter(item => item.hasAttribute('data-modal-display') && !item.dataset.modalDisplay);
         const modalsNoDisplay = Array.from(modals).filter(item => !item.hasAttribute('data-modal-display'));
         if ([...modalsDisplayNoActive, ...modalsNoDisplay].length === 0) {
            enableScroll();
         }
         // enableScroll();
      }
   }, [condition]);

   return <>{Boolean(condition) ? children : ''}</>;
};

export default ModalWrapper;
