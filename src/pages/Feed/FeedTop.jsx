import React, { useContext } from 'react';
import { FeedContext } from '../../context';
import { useQueryParams } from '../../hooks/useQueryParams';
import FeedFilters from './FeedFilters';

const FeedTop = () => {
   const params = useQueryParams();
   const { buildingData, values, title, feedSelector } = useContext(FeedContext);

   return (
      <div className="flex items-center justify-between mb-4 h-10">
         <h1 className="title-2">
            {title}
            {params.type === 'complex' && buildingData?.title ? ` в ${buildingData?.title}` : ''}
            {params.type === 'developer' && values.developers[0]?.label ? ` застройщика «${values.developers[0]?.label}»` : ''}
            {params.type === 'author' && values.authors[0]?.label ? ` менеджера «${values.authors[0]?.label}»` : ''}
         </h1>
         {(feedSelector.type !== 'main' && params.type !== 'home') && <FeedFilters />}
      </div>
   );
};

export default FeedTop;
