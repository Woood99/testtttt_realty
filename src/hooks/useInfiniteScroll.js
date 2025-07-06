import debounce from 'lodash.debounce';
import { useCallback, useEffect, useState } from 'react';

export const useInfiniteScroll = options => {
   const { fetchCallback, scrollableRef, totalPages = 1, page = 1, setPage, gap = 150 } = options;

   const [isLoadingMore, setIsLoadingMore] = useState(false);

   const [fetching, setFetching] = useState(false);

   useEffect(() => {
      if (!fetching) return;
      if (isLoadingMore) return;

      if (page + 1 > totalPages) {
         setFetching(false);
         return;
      }
      setIsLoadingMore(true);
      fetchCallback(page + 1).then(() => {
         setPage(page + 1);
         setFetching(false);
         setIsLoadingMore(false);
      });
   }, [fetching]);

   const handleScroll = useCallback(
      debounce(() => {
         const scrollContainer = scrollableRef?.current || window;
         const isBottom = scrollContainer.scrollTop + scrollContainer.clientHeight >= scrollContainer.scrollHeight - gap;

         if (isBottom) {
            setFetching(true);
         }
      }, 100),
      [scrollableRef?.current]
   );

   useEffect(() => {
      const scrollableElement = scrollableRef?.current;
      if (!scrollableElement) return;

      if (scrollableElement) {
         scrollableElement.addEventListener('scroll', handleScroll);
      }

      return () => {
         if (scrollableElement) {
            scrollableElement.removeEventListener('scroll', handleScroll);
         }
      };
   }, [scrollableRef?.current]);

   return { isLoadingMore };
};
