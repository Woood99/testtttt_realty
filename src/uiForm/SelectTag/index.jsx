import React, { useEffect, useState } from 'react';
import Tag from '../../ui/Tag';

const SelectTag = ({ options, type = 'single', onChange = () => {}, value = [] }) => {
   const [activeTags, setActiveTags] = useState(value);
   const onClickHandler = (value, option) => {
      if (type === 'multiple') {
         if (value) {
            setActiveTags([...activeTags, option]);
         } else {
            setActiveTags([...activeTags].filter(item => item.value !== option.value));
         }
      }

      if (type === 'single') {
         if (value) {
            setActiveTags([option]);
         } else {
            setActiveTags([]);
         }
      }
   };

   useEffect(() => {
      onChange(activeTags);
   }, [activeTags]);

   useEffect(() => {
      setActiveTags(value);
   }, [value]);

   return (
      <div className="flex flex-wrap gap-2">
         {options.map((option, index) => {
            return (
               <Tag
                  color="select"
                  onClick={value => onClickHandler(value, option)}
                  value={activeTags.find(item => item.value === option.value)}
                  key={index}>
                  {option.label}
               </Tag>
            );
         })}
      </div>
   );
};

export default SelectTag;
