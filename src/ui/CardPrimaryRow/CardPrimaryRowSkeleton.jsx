import WebSkeleton from "../Skeleton/WebSkeleton";

export const CardPrimaryRowSkeleton = () => {
   return (
      <div className="min-h-[355px] p-4 select-none rounded-xl bg-white shadow grid grid-cols-[350px_1fr] gap-4">
         <WebSkeleton className="rounded-xl" />
         <div className="flex flex-col">
            <div className="flex gap-10">
               <div className="flex-grow flex flex-col">
                  <WebSkeleton className="w-full h-6 rounded-xl" />
                  <WebSkeleton className="w-3/5 h-5 rounded-xl mt-5" />
                  <WebSkeleton className="w-4/5 h-5 rounded-xl mt-2" />
                  <WebSkeleton className="w-3/5 h-5 rounded-xl mt-2" />
                  <div className="grid grid-cols-2 gap-3 mt-6 w-full">
                     <WebSkeleton className="h-12 rounded-xl" />
                     <WebSkeleton className="h-12 rounded-xl" />
                  </div>
               </div>
               <div className="w-[235px]">
                  <WebSkeleton className="w-full h-6 rounded-xl" />
                  <WebSkeleton className="w-4/5 h-5 rounded-xl mt-4" />
                  <WebSkeleton className="w-4/5 h-5 rounded-xl mt-1.5" />
               </div>
               <div className="w-[32px]">
                  <WebSkeleton className="w-8 h-8 rounded-lg" />
                  <WebSkeleton className="w-8 h-8 rounded-lg mt-2" />
               </div>
            </div>
            <div className="mt-auto flex items-center gap-3 w-full">
               <WebSkeleton className="w-10 h-10 rounded-full" />
               <WebSkeleton className="w-2/5 h-10 rounded-lg" />
            </div>
         </div>
      </div>
   );
};
