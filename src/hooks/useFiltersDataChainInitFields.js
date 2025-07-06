import { useState } from 'react';

export const useFiltersDataChainInitFields = () => {
   return useState({
      developers: false,
      complexes: false,
   });
};
