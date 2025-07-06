import { useContext, useState } from 'react';
import { SuggestionsCardActionsContext, SuggestionsContext } from '../../../context';
import Button from '../../../uiForm/Button';

const SuggestionsCardActionConfirmed = ({ title = 'Принять' }) => {
   const { onHandlerConfirmed } = useContext(SuggestionsContext);
   const { status_id, date, time, is_active } = useContext(SuggestionsCardActionsContext);

   const [isLoading, setIsLoading] = useState(false);

   return (
      <Button
         isLoading={isLoading}
         onClick={async () => {
            if (!is_active) return;

            setIsLoading(true);
            await onHandlerConfirmed({ status_id, date, time });
            setIsLoading(false);
         }}>
         {title}
      </Button>
   );
};

export default SuggestionsCardActionConfirmed;
