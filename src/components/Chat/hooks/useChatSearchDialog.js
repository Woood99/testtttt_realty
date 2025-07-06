import { useDebounceEffect } from 'ahooks';
import { useState } from 'react';

export const useChatSearchDialog = () => {
   const [isSearchPanelOpen, setIsSearchPanelOpen] = useState(false);
   const [searchValue, setSearchValue] = useState('');
   const [isLoading, setIsLoading] = useState(false);
   const [data, setData] = useState([]);

   useDebounceEffect(
      () => {
         handleSearchFetchData(searchValue);
      },
      [searchValue],
      { wait: 400 }
   );

   const closeSearchPanel = () => {
      setIsSearchPanelOpen(false);
      setSearchValue('');
   };

   const openSearchPanel = () => {
      setIsSearchPanelOpen(true);
   };

   const handleSearchFetchData = async searchValue => {
      // console.log(searchValue);
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 500));
      setIsLoading(false);
      // console.log(data);
   };

   return {
      isSearchPanelOpen,
      setIsSearchPanelOpen,
      searchValue,
      setSearchValue,
      closeSearchPanel,
      openSearchPanel,
      isLoading,
      data,
   };
};
