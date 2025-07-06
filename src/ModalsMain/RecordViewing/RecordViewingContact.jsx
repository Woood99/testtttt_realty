import { suggestionsTypes } from '../../components/Suggestions/suggestions-types';
import SuggestionsCardMini from '../../components/Suggestions/SuggestionsCardMini';
import SuggestionsProvider from '../../components/Suggestions/SuggestionsProvider';
import Modal from '../../ui/Modal';
import ModalWrapper from '../../ui/Modal/ModalWrapper';

const RecordViewingContact = ({ condition, set, customUpdate = null, suggestions = [] }) => {
   return (
      <ModalWrapper condition={condition}>
         <Modal
            condition={condition}
            set={set}
            options={{
               overlayClassNames: '_center-max-content',
               modalClassNames: 'mmd1:!w-[450px]',
               modalContentClassNames: '!px-10 !pt-8 md1:!px-6',
            }}>
            <h3 className="title-2 mb-6">Свяжитесь с продавцом</h3>
            <div className="flex flex-col gap-3">
               <SuggestionsProvider suggestions_type={suggestionsTypes.buyerAll} customUpdate={customUpdate}>
                  {suggestions.map(card => {
                     return (
                        <SuggestionsCardMini
                           key={card.status_id}
                           card={card}
                           suggestions_type={suggestionsTypes.buyerAll}
                           variant="default"
                           className="!bg-pageColor !p-4 !rounded-lg !min-h-0"
                        />
                     );
                  })}
               </SuggestionsProvider>
            </div>
         </Modal>
      </ModalWrapper>
   );
};

export default RecordViewingContact;
