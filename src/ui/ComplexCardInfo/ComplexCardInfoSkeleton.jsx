import WebSkeleton from '../Skeleton/WebSkeleton';

const ComplexCardInfoSkeleton = () => {
   return (
      <div className="white-block-small grid grid-cols-[1fr_500px] gap-8 md1:gap-4 relative md1:flex md1:flex-col-reverse">
         <div className="flex flex-col">
            <WebSkeleton className="w-2/5 h-6 rounded-lg" />
            <WebSkeleton className="w-4/5 h-10 rounded-lg mt-4" />
            <WebSkeleton className="w-3/5 h-4 rounded-lg mt-2" />
            <WebSkeleton className="w-3/5 h-4 rounded-lg mt-2" />
            <WebSkeleton className="w-full h-10 rounded-lg mt-4" />
            <div className="mt-6 flex items-center gap-3 w-full">
               <WebSkeleton className="w-10 h-10 rounded-full" />
               <WebSkeleton className="w-4/5 h-10 rounded-lg" />
            </div>
            <div className="mt-6 flex gap-2 items-center">
               <WebSkeleton className="w-6/12 h-10 rounded-lg" />
               <WebSkeleton className="w-10 h-10 rounded-lg" />
               <WebSkeleton className="w-10 h-10 rounded-lg" />
               <WebSkeleton className="w-10 h-10 rounded-lg" />
            </div>
         </div>
         <WebSkeleton className="w-full h-full rounded-xl min-h-[240px]" />
      </div>
   );
};

export default ComplexCardInfoSkeleton;
