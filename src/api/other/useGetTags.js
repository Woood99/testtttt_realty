import { useEffect, useState } from 'react';
import { getDataRequest } from '../requestsApi';

export const useGetTags = (params = { type: 'tags' }, condition = true) => {
   const [data, setData] = useState([]);

   const fetchData = async () => {
      try {
         const response = await getDataRequest('/api/tags', params);
         setData(response.data);
      } catch (err) {}
   };

   useEffect(() => {
      if (!condition) return;
      fetchData();
   }, [condition]);

   return { tags: data, refetch: fetchData };
};

export const useGetTagsAllTypes = (hasTags = true, hasStickers = true, hasAdvantages = true) => {
   const [data, setData] = useState({
      tags: [],
      stickers: [],
      advantages: [],
   });
   const [isLoading, setIsLoading] = useState(true);

   const fetchData = async (hasRefetchTags = false, hasRefetchStickers = false, hasRefetchAdvantages = false) => {
      setIsLoading(true);
      try {
         const tags = hasTags || hasRefetchTags ? await getDataRequest('/api/tags', { type: 'tags' }) : [];
         const stickers = hasStickers || hasRefetchStickers ? await getDataRequest('/api/tags', { type: 'stickers' }) : [];
         const advantages = hasAdvantages || hasRefetchAdvantages ? await getDataRequest('/api/tags', { type: 'advantages' }) : [];
         setData({
            tags: tags.data || [],
            stickers: stickers.data || [],
            advantages: advantages.data || [],
         });
      } catch (err) {
      } finally {
         setIsLoading(false);
      }
   };

   useEffect(() => {
      fetchData();
   }, []);

   return { data, refetch: fetchData, isLoading };
};
