import React, { forwardRef } from 'react';
import SimpleBar from 'simplebar-react';
import 'simplebar-react/dist/simplebar.min.css';

const SimpleScrollbar = forwardRef(({ children, maxHeight = 300, className = '', variant = 'default' }, ref) => {
   if (variant === 'default') {
      return (
         <SimpleBar style={{ maxHeight }} className={`simple-scrollbar ${className}`} ref={ref}>
            {children}
         </SimpleBar>
      );
   }
   if (variant === 'custom') {
      return (
         <div className={`scrollbarPrimary ${className}`} ref={ref}>
            {children}
         </div>
      );
   }
});

export default SimpleScrollbar;
