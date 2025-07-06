import cn from 'classnames';
import WebSkeleton from '../Skeleton/WebSkeleton';

export const CardPrimarySkeleton = ({ variant = '', className = '' }) => {
   return (
      <div className={cn('p-4 select-none rounded-xl', variant === 'shadow' && 'shadow bg-white', variant === 'default' && '!p-0', className)}>
         <WebSkeleton className="rounded-xl h-[222px] w-full" />
         <div className="mt-4 flex justify-between gap-3">
            <div className="flex flex-col w-full">
               <WebSkeleton className="w-full h-12 rounded-xl" />
               <WebSkeleton className="w-full h-8 rounded-xl mt-4" />
               <WebSkeleton className="w-full h-8 rounded-xl mt-2" />
            </div>
            <div className="w-[32px]">
               <WebSkeleton className="w-8 h-8 rounded-lg" />
               <WebSkeleton className="w-8 h-8 rounded-lg mt-2" />
            </div>
         </div>
         <div className="mt-10 flex items-center gap-3 w-full">
            <WebSkeleton className="w-10 h-10 rounded-full" />
            <WebSkeleton className="w-4/5 h-10 rounded-lg" />
         </div>
      </div>
   );
};
