import React from 'react';
import { Link } from 'react-router-dom';
import cn from 'classnames';

export const ExternalLink = ({ to, children, className, ...props }) => {
   return (
      <Link to={to} target="_blank" rel="noopener noreferrer" className={cn(className)} {...props}>
         {children}
      </Link>
   );
};
