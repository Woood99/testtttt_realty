import { useContext, useState } from 'react';
import { SuggestionsCardActionsContext, SuggestionsContext } from '../../../context';
import Button from '../../../uiForm/Button';

const SuggestionsCardActionPurchased = ({ title = 'Забронировать', size }) => {
   const { onHandlerPurchase } = useContext(SuggestionsContext);
   const { status_id, is_active } = useContext(SuggestionsCardActionsContext);

   const [isLoading, setIsLoading] = useState(false);

   return (
      <Button
         size={size}
         isLoading={isLoading}
         onClick={async () => {
            if (!is_active) return;

            setIsLoading(true);
            await onHandlerPurchase(status_id);
            setIsLoading(false);
         }}>
         {title}
      </Button>
   );
};

export default SuggestionsCardActionPurchased;
