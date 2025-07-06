import React, { useContext } from 'react';
import plural from 'plural-ru';
import { ElementTitleSubtitleSecond } from '../../ui/Elements';
import { BlockCardsPrimaryContext } from '../../context';
import PaginationPage from '../Pagination';
import { EmptyTextBlock } from '../EmptyBlock';
import CardPrimary from '../../ui/CardPrimary';
import RepeatContent from '../RepeatContent';
import { CardPrimarySkeleton } from '../../ui/CardPrimary/CardPrimarySkeleton';

const BlockCardsPrimary = () => {
   const { data, options, setOptions, title = '', EmptyBlockContent, skeletonCount = 3 } = useContext(BlockCardsPrimaryContext);
   return (
      <>
         {title && (
            <ElementTitleSubtitleSecond className="mb-6 md3:flex-col md3:!items-start justify-between">
               <h2 className="title-2">{title}</h2>
               <span>
                  {data.objectsCount} {plural(data.objectsCount, 'объект', 'объекта', 'объектов')}
               </span>
            </ElementTitleSubtitleSecond>
         )}

         {data.objectsCount !== 0 ? (
            <>
               <div className="grid grid-cols-[repeat(auto-fill,minmax(276px,1fr))] gap-4">
                  {options.loading || options.init ? (
                     <RepeatContent count={skeletonCount}>
                        <CardPrimarySkeleton className="p-0" />
                     </RepeatContent>
                  ) : (
                     options.items.map((card, index) => {
                        return <CardPrimary {...card} key={index} />;
                     })
                  )}
               </div>
               <PaginationPage
                  className="mt-8"
                  currentPage={options.page}
                  setCurrentPage={value => {
                     setOptions({ ...options, page: value });
                  }}
                  total={Math.ceil(data.objectsCount / options.per_page)}
               />
            </>
         ) : (
            <EmptyTextBlock block={false}>{EmptyBlockContent}</EmptyTextBlock>
         )}
      </>
   );
};

export default BlockCardsPrimary;
