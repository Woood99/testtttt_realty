import React from 'react';
import SellerLayout from '../../layouts/SellerLayout';
import SuggestionsProvider from '../../components/Suggestions/SuggestionsProvider';
import { suggestionsTypes } from '../../components/Suggestions/suggestions-types';
import SuggestionsObjects from '../../components/Suggestions/SuggestionsObjects';

const MyViewSeller = () => {
   return (
      <SellerLayout pageTitle="Запрос на просмотр" classNameContent="!p-0 bg-transparent-imp !shadow-none min-w-0">
         <SuggestionsProvider suggestions_type={suggestionsTypes.sellerAll}>
            <SuggestionsObjects />
         </SuggestionsProvider>
      </SellerLayout>
   );
};

export default MyViewSeller;
