import { useContext, useState } from 'react';
import Button from '../../../uiForm/Button';
import ModalWrapper from '../../../ui/Modal/ModalWrapper';
import Modal from '../../../ui/Modal';
import { SuggestionsCardActionsContext, SuggestionsContext } from '../../../context';
import { ROLE_BUYER, ROLE_SELLER } from '../../../constants/roles';
import SuggestionsCardActionChangeDate from './SuggestionsCardActionChangeDate';
import SuggestionsCardActionCancel from './SuggestionsCardActionCancel';
import SuggestionsCardActionConfirmed from './SuggestionsCardActionConfirmed';
import { suggestionsTypes } from '../suggestions-types';
import SuggestionsCardActionPurchased from './SuggestionsCardActionPurchased';

const SuggestionsCardActionModal = () => {
   const { suggestions_type, actionsModalOpen, setActionsModalOpen } = useContext(SuggestionsContext);
   const { user, buyer_confirmed, seller_confirmed, status_id, status, is_active, id, specialist, author_is_user } =
      useContext(SuggestionsCardActionsContext);

   const isBuyerSuggestionType = suggestions_type.id === suggestionsTypes.buyerOnly.id || suggestions_type.id === suggestionsTypes.buyerAll.id;
   const isSellerSuggestionType = suggestions_type.id === suggestionsTypes.sellerAll.id;

   const authorRoleBuyer = (author_is_user ? user.role : specialist.role) === ROLE_BUYER.id;
   const authorRoleSeller = (author_is_user ? user.role : specialist.role) === ROLE_SELLER.id;

   return (
      <>
         <Button
            size="34"
            variant="secondary"
            className="max-w-[200px]"
            onClick={() => {
               if (!is_active) return;
               setActionsModalOpen(status_id);
            }}>
            Изменить
         </Button>

         <ModalWrapper condition={actionsModalOpen === status_id}>
            <Modal
               options={{ overlayClassNames: '_center-max-content', modalClassNames: '!w-[300px]', modalContentClassNames: '!px-8' }}
               condition={actionsModalOpen === status_id}
               set={setActionsModalOpen}>
               <div className="flex flex-col gap-2">
                  {Boolean(status === 'created' && isBuyerSuggestionType && authorRoleBuyer && !seller_confirmed) && (
                     <>
                        <SuggestionsCardActionCancel />
                        <SuggestionsCardActionChangeDate />
                     </>
                  )}
                  {Boolean(status === 'created' && isBuyerSuggestionType && authorRoleSeller && !buyer_confirmed) && (
                     <>
                        <SuggestionsCardActionCancel />
                        <SuggestionsCardActionConfirmed />
                     </>
                  )}
                  {Boolean(status === 'created' && isSellerSuggestionType && authorRoleBuyer && !seller_confirmed) && (
                     <>
                        <SuggestionsCardActionChangeDate />
                        <SuggestionsCardActionConfirmed />
                     </>
                  )}
                  {Boolean(status === 'created' && isSellerSuggestionType && authorRoleSeller && !buyer_confirmed) && (
                     <>
                        <SuggestionsCardActionChangeDate />
                     </>
                  )}

                  {Boolean(status === 'confirmed' && isBuyerSuggestionType && (authorRoleBuyer || authorRoleSeller)) && (
                     <>
                        <SuggestionsCardActionCancel />
                        <SuggestionsCardActionChangeDate />
                        <SuggestionsCardActionPurchased />
                     </>
                  )}
               </div>
            </Modal>
         </ModalWrapper>
      </>
   );
};

export default SuggestionsCardActionModal;
