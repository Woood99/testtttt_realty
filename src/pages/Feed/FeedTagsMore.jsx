import React from 'react';
import { setTagsFeed } from '../../redux/slices/feedSlice';
import { TagsMoreWidthDynamic } from '../../ui/TagsMore';
import { useDispatch } from 'react-redux';

const FeedTagsMore = ({ tags = [], feedSelector }) => {
   const dispatch = useDispatch();

   return (
      Boolean(tags.length) && (
         <TagsMoreWidthDynamic
            className="flex gap-1.5 mb-5"
            data={tags.map((item, index) => {
               return {
                  id: index,
                  value: feedSelector.values.tags.find(currentItem => currentItem === item.value),
                  label: item.label,
                  onClick: value => {
                     dispatch(setTagsFeed({ value, option: item }));
                  },
               };
            })}
         />
      )
   );
};

export default FeedTagsMore;
