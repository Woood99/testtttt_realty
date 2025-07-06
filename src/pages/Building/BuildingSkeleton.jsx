import { useSelector } from 'react-redux';
import { getIsDesktop } from '../../redux/helpers/selectors';
import WebSkeleton from '../../ui/Skeleton/WebSkeleton';
import BodyAndSidebar from '../../components/BodyAndSidebar';

const BuildingSkeleton = () => {
   const isDesktop = useSelector(getIsDesktop);
   return (
      <main className={`main ${!isDesktop ? '!pb-[110px]' : ''}`}>
         <div className="main-wrapper md1:pt-0">
            <div className="container-desktop">
               <div className="bg-white shadow-primary rounded-[20px] p-[10px] h-[440px] mb-3">
                  <WebSkeleton className="mr-2 w-[calc(60%-8px)] h-full rounded-[20px]" />
                  <WebSkeleton className="w-[40%] h-full rounded-[20px]" />
               </div>
               <BodyAndSidebar>
                  <div className="flex flex-col gap-3 white-block-small">
                     <WebSkeleton className="w-full rounded-xl h-[150px]" />
                     <WebSkeleton className="w-full rounded-xl h-[150px]" />
                     <WebSkeleton className="w-full rounded-xl h-[150px]" />
                  </div>
                  <div className="white-block-small">
                     <WebSkeleton className="w-full min-h-[250px] h-full rounded-xl" />
                  </div>
               </BodyAndSidebar>
               <div className="mt-3 white-block-small">
                  <WebSkeleton className="w-2/5 rounded-xl h-[40px] mb-3" />
                  <WebSkeleton className="w-full rounded-xl h-[40px] mb-6" />
                  <WebSkeleton className="w-full rounded-xl h-[80px] mb-2" />
                  <WebSkeleton className="w-full rounded-xl h-[80px] mb-2" />
                  <WebSkeleton className="w-full rounded-xl h-[80px] mb-2" />
               </div>
            </div>
         </div>
      </main>
   );
};

export default BuildingSkeleton;
