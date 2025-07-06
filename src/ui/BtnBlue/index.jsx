import React from 'react';
import { IconPlus } from '../Icons';

const BtnBlue = ({ children, onClick = () => {}, className = '' }) => {
   return (
      <button type='button' onClick={onClick} className={`flex items-center gap-2 text-blue h-max leading-none ${className}`}>
         <IconPlus width={14} height={14} className="stroke-blue fill-blue" />
         {children}
      </button>
   );
};

export default BtnBlue;
