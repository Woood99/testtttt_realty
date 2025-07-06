import React from 'react';
import cn from 'classnames';

const CardBasicRowSkeleton = ({ className, children }) => {
   return <div className={cn('px-6 select-none rounded-xl bg-white shadow grid items-center gap-5 justify-start', className)}>{children}</div>;
};

export default CardBasicRowSkeleton;
