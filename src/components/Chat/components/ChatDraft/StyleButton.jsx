import { useCallback } from 'react';
import cn from 'classnames';

const StyleButton = ({ active, label, style, onToggle, icon, disabled }) => {
   const handleClick = useCallback(
      e => {
         e.preventDefault();
         e.stopPropagation();
         onToggle(style);
      },
      [onToggle, style]
   );

   return (
      <button
         className={cn('p-1 py-1 rounded flex-center-all', active && 'bg-blue', disabled && 'pointer-events-none opacity-50')}
         title={label}
         onClick={handleClick}
         disabled={disabled}>
         {icon}
      </button>
   );
};

export default StyleButton;
