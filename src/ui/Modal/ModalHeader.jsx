import React from 'react';
import { IconClose } from '../Icons';

const ModalHeader = ({ set, children, className = '' }) => {
   return (
      <div className={`ModalHeader ${className}`}>
         {children}
         <button onClick={() => set(false)} className="modal-close-default">
            <IconClose width={25} height={25} className="fill-blue" />
            <div>
               <span></span>
            </div>
         </button>
      </div>
   );
};

export default ModalHeader;
