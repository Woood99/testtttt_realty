import { useContext } from 'react';
import { SuggestionsCardActionsContext, SuggestionsContext } from '../../../context';
import { suggestionsTypes } from '../suggestions-types';
import SuggestionsCardActionLayout from './SuggestionsCardActionLayout';
import SuggestionsCardActionChat from './SuggestionsCardActionChat';
import SuggestionsCardActionModal from './SuggestionsCardActionModal';
import SuggestionsCardActionAgainDate from './SuggestionsCardActionAgainDate';
import SuggestionsCardActionPurchased from './SuggestionsCardActionPurchased';

const SuggestionsCardActions = () => {
   const { status } = useContext(SuggestionsCardActionsContext);
   const { suggestions_type } = useContext(SuggestionsContext);

   const isBuyerSuggestionType = suggestions_type.id === suggestionsTypes.buyerOnly.id || suggestions_type.id === suggestionsTypes.buyerAll.id;
   const isSellerSuggestionType = suggestions_type.id === suggestionsTypes.sellerAll.id;

   if (suggestions_type.id === suggestionsTypes.sellerHistory.id) return;

   if (status === 'created' || (status === 'confirmed' && isBuyerSuggestionType)) {
      return (
         <SuggestionsCardActionLayout>
            <SuggestionsCardActionChat />
            <SuggestionsCardActionModal status={status} />
         </SuggestionsCardActionLayout>
      );
   }

   if (status === 'confirmed' && isSellerSuggestionType) {
      return (
         <SuggestionsCardActionLayout>
            <SuggestionsCardActionChat />
            <SuggestionsCardActionPurchased size={34} />
         </SuggestionsCardActionLayout>
      );
   }

   if (status === 'declined' && isBuyerSuggestionType) {
      return (
         <SuggestionsCardActionLayout>
            <SuggestionsCardActionChat />
            <SuggestionsCardActionAgainDate />
         </SuggestionsCardActionLayout>
      );
   }

   return (
      <SuggestionsCardActionLayout className="!grid-cols-1">
         <SuggestionsCardActionChat />
      </SuggestionsCardActionLayout>
   );
};

export default SuggestionsCardActions;
