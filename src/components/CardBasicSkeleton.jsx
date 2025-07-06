import React from 'react';
import WebSkeleton from '../ui/Skeleton/WebSkeleton';

const CardBasicSkeleton = ({ bg = true }) => {
   return (
      <div className={`select-none rounded-xl ${bg ? 'bg-white shadow p-4' : ''}`}>
         <WebSkeleton className="rounded-xl h-[226px] w-full" />
         <div className="mt-4 flex justify-between gap-3">
            <WebSkeleton className="w-full h-12 rounded-xl" />
         </div>
         <div className="mt-6 flex items-center gap-3 w-full">
            <WebSkeleton className="w-10 h-10 rounded-full" />
            <WebSkeleton className="w-4/5 h-10 rounded-lg" />
         </div>
      </div>
   );
};

export default CardBasicSkeleton;
