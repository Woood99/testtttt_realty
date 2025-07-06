import React, { useContext } from 'react';
import { FeedContextLayout } from '../../context';
import { useSelector } from 'react-redux';
import { useQueryParams } from '../../hooks/useQueryParams';

const FeedTitle = ({ title = '' }) => {
     const params = useQueryParams();
   const { buildingData } = useContext(FeedContextLayout);
   const feedSelector = useSelector(state => state.feed);
      
   return (
      <h1 className="title-2 mb-4">
         {title}
         {params.type === 'complex' && buildingData?.title ? ` в ${buildingData?.title}` : ''}
         {params.type === 'developer' && feedSelector.values.developers[0]?.label ? ` застройщика «${feedSelector.values.developers[0]?.label}»` : ''}
         {params.type === 'author' && feedSelector.values.authors[0]?.label ? ` менеджера «${feedSelector.values.authors[0]?.label}»` : ''}
      </h1>
   );
};

export default FeedTitle;
