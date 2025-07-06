import React from 'react';

const FieldError = ({ errors, field }) => {
   return <>{errors && errors[field] && <FieldErrorSpan>{errors[field].message}</FieldErrorSpan>}</>;
};

export const FieldErrorSpan = ({ children, className = '' }) => {
   if (!children) return;
   return <span className={`text-small text-red mt-1 ml-2 block ${className}`}>{children}</span>;
};

export default FieldError;
