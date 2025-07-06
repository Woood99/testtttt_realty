import { useContext } from 'react';
import cn from 'classnames';
import { SuggestionsContext } from '../../context';
import RepeatContent from '../RepeatContent';
import PaginationPage from '../Pagination';
import { EmptyTextBlock } from '../EmptyBlock';
import SuggestionsCard from './SuggestionsCard';
import WebSkeleton from '../../ui/Skeleton/WebSkeleton';

const SuggestionsObjectsBody = ({ className }) => {
   const { data, isLoading, filterFields, setFilterFields, currentStatusInfo, suggestions_type } = useContext(SuggestionsContext);

   return (
      <div className={cn(className)}>
         <div className="grid grid-cols-3 gap-2.5 md1:grid-cols-2 md3:grid-cols-1">
            {isLoading ? (
               <RepeatContent count={9}>
                  <div className="p-5 rounded-[20px] select-none shadow-primary bg-white">
                     <WebSkeleton className="rounded-xl h-8 w-3/4 mb-4" />
                     <div className="flex gap-3 relative">
                        <WebSkeleton className="w-[70px] h-[70px] rounded-xl" />
                        <div className="flex flex-col gap-1 w-full">
                           <WebSkeleton className="w-full h-full rounded-xl" />
                        </div>
                     </div>
                     <div className="mt-4">
                        <WebSkeleton className="w-full h-[40px] rounded-xl" />
                     </div>
                  </div>
               </RepeatContent>
            ) : (
               <>
                  {data.items.length === 0 ? (
                     <div className="col-span-full">
                        <EmptyTextBlock>
                           <h4 className="title-3 mt-4">{currentStatusInfo.emptyText}</h4>
                        </EmptyTextBlock>
                     </div>
                  ) : (
                     data.items.map((card, index) => {
                        return <SuggestionsCard card={card} suggestions_type={suggestions_type} key={index} />;
                     })
                  )}
               </>
            )}
         </div>
         {Boolean(!isLoading) && (
            <PaginationPage
               className="mt-8"
               currentPage={filterFields.page}
               setCurrentPage={value => {
                  setFilterFields(prev => ({
                     ...prev,
                     page: value,
                  }));
               }}
               total={data.pages}
            />
         )}
      </div>
   );
};

export default SuggestionsObjectsBody;
