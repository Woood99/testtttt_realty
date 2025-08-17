import React, { useContext } from 'react';
import { useDispatch } from 'react-redux';
import cn from 'classnames';

import { setTagsFeed } from '../../redux/slices/feedSlice';
import Tag from '../../ui/Tag';
import HorizontalScrollMouse from '../../ui/HorizontalScrollMouse';
import { FeedContext } from '../../context';

const FeedTagsMore = ({ className }) => {
   const { values, tags } = useContext(FeedContext);
   const dispatch = useDispatch();

   if (!tags.length) return;

   return (
      <HorizontalScrollMouse widthScreen={9999} className={cn('mb-4', className)}>
         <div className="flex gap-1.5 mmd1:flex-wrap items-center">
            {tags.map((item, index) => {
               return (
                  <Tag
                     key={index}
                     size="medium"
                     className="!rounded-xl"
                     onClick={value => {
                        dispatch(setTagsFeed({ value, option: item }));
                     }}
                     value={values.tags.find(currentItem => currentItem === item.value)}>
                     {item.label}
                  </Tag>
               );
            })}
         </div>
      </HorizontalScrollMouse>
   );
};

export default FeedTagsMore;
