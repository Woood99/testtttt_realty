import React, { useEffect, useRef, useState } from 'react';
import Tag, { TagTop } from '../Tag';
import { Tooltip } from '../Tooltip';
import { useSelector } from 'react-redux';
import { getWindowSize } from '../../redux/helpers/selectors';
import cn from 'classnames';

export const TagsMoreWidthDynamic = ({ data, gap = 8, className = '' }) => {
   const [visibleTags, setVisibleTags] = useState(data);
   const [hiddenTags, setHiddenTags] = useState([]);

   const tagRefs = useRef([]);

   const [isLoading, setIsLoading] = useState(true);
   const [moreTags, setMoreTags] = useState(false);

   const containerRef = useRef(null);

   const handleDrag = () => {
      const container = containerRef.current;
      let totalWidth = 0;

      const visibleTagsArr = [];
      const hiddenTagsArr = [];

      tagRefs.current.forEach((ref, index) => {
         if (ref) {
            totalWidth += ref.offsetWidth + gap;
            if (totalWidth > container.offsetWidth - 100 || ref.offsetWidth === 0) {
               hiddenTagsArr.push(data[index]);
            } else {
               visibleTagsArr.push(data[index]);
            }
         }
      });

      setVisibleTags(visibleTagsArr);
      if (hiddenTagsArr.length) {
         setHiddenTags(hiddenTagsArr);
         setMoreTags(true);
      } else {
         setHiddenTags([]);
      }
   };

   useEffect(() => {
      handleDrag();

      setTimeout(() => {
         setIsLoading(false);
      }, 50);
   }, []);

   const addButtonRef = index => el => {
      if (el) {
         tagRefs.current[index] = el;
      }
   };

   return (
      <div ref={containerRef} className={cn(isLoading ? 'opacity-0' : 'flex-wrap', className)}>
         {visibleTags.map((item, index) => {
            const find = data.find(findItem => item.id === findItem.id);
            if (!find) return;

            return (
               <div ref={addButtonRef(index)} key={index}>
                  <Tag size="medium" className="!rounded-xl" onClick={value => find.onClick(value)} value={find.value}>
                     {find.label}
                  </Tag>
               </div>
            );
         })}
         {moreTags && (
            <>
               {Boolean(hiddenTags.length) ? (
                  <button
                     className="ml-2 blue-link self-center"
                     onClick={() => {
                        setVisibleTags(data);
                        setHiddenTags([]);
                     }}>
                     ещё {hiddenTags.length}
                  </button>
               ) : (
                  <button
                     className="ml-2 blue-link self-center"
                     onClick={() => {
                        setVisibleTags(data);
                        setHiddenTags([]);
                        handleDrag();
                     }}>
                     Свернуть
                  </button>
               )}
            </>
         )}
      </div>
   );
};

export const TagsMoreHeight = ({ data, maxHeightDefault = 25, gap = 8, increaseHeight = false, className = '' }) => {
   const [visibleTags, setVisibleTags] = useState(data);
   const [hiddenTags, setHiddenTags] = useState([]);

   const [maxHeight, setMaxHeight] = useState(maxHeightDefault);

   const [isLoading, setIsLoading] = useState(true);

   const { width } = useSelector(getWindowSize);

   const containerRef = useRef(null);

   let visibleTagsArr = [];

   const handleDrag = () => {
      const container = containerRef.current;

      for (let k = visibleTags.length - 1; k >= 0; k--) {
         const element = visibleTags[k];
         if (container.offsetHeight >= maxHeight) {
            setVisibleTags(prev => {
               visibleTagsArr = prev.filter(item => item !== element);
               return prev.filter(item => item !== element);
            });
            setHiddenTags(prev => {
               return [...prev, element];
            });

            break;
         }
      }
      if (data.length > 0 && visibleTagsArr.length === 0 && increaseHeight) {
         setMaxHeight(maxHeightDefault * 2 + gap);
      }
   };

   useEffect(() => {
      handleDrag();
   }, [visibleTags]);

   useEffect(() => {
      if (maxHeight !== maxHeightDefault) {
         setVisibleTags(data);
         setHiddenTags([]);
         visibleTagsArr = [];
      }
   }, [maxHeight]);

   useEffect(() => {
      setVisibleTags(data);
      setHiddenTags([]);
      handleDrag();
   }, [width]);

   useEffect(() => {
      setTimeout(() => {
         setIsLoading(false);
         setHiddenTags(prev => prev.reverse());
      }, 50);
   }, [width]);

   return (
      <div ref={containerRef} className={cn('flex gap-2 flex-wrap w-full', isLoading && 'opacity-0', className)}>
         {visibleTags.map((tag, index) => {
            if (tag.type === 'sticker') {
               return <TagTop top={tag.name} key={index} />;
            } else {
               return (
                  <Tag size="small" color="default" key={index} tagObj={tag}>
                     {tag.name}
                  </Tag>
               );
            }
         })}
         {Boolean(hiddenTags.length) && (
            <Tooltip
               mobile
               color="white"
               ElementTarget={() => (
                  <Tag size="small" color="default" className="relative" hoverEnable>
                     ещё {hiddenTags.length}
                  </Tag>
               )}>
               <div className="pr-8 flex flex-col items-start gap-2">
                  {hiddenTags.map((tag, index) => {
                     if (tag.type === 'sticker') {
                        return <TagTop top={tag.name} key={index} />;
                     } else {
                        return (
                           <Tag size="small" color="default" key={index} tagObj={tag}>
                              {tag.name}
                           </Tag>
                        );
                     }
                  })}
               </div>
            </Tooltip>
         )}
      </div>
   );
};
