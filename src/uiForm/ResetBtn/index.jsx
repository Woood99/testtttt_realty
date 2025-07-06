import React from 'react';

const ResetBtn = ({ text, className = '', onClick = () => {} }) => {
   return <button onClick={onClick} className={`red-link ${className}`}>{text}</button>;
};

export default ResetBtn;
