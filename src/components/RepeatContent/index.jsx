import React from 'react';

const RepeatContent = ({ count = 0, children }) => {
   return [...new Array(count)].map((_, index) => {
      return <React.Fragment key={index}>{children}</React.Fragment>;
   });
};

export default RepeatContent;
