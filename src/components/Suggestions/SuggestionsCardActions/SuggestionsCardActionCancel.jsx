import { useContext } from 'react';
import { SuggestionsCardActionsContext, SuggestionsContext } from '../../../context';
import Button from '../../../uiForm/Button';

const SuggestionsCardActionCancel = ({ title = 'Отменить запись' }) => {
   const { setCancelModalOpen } = useContext(SuggestionsContext);
   const { status_id, is_active } = useContext(SuggestionsCardActionsContext);

   return (
      <Button
         onClick={() => {
            if (!is_active) return;

            setCancelModalOpen(status_id);
         }}>
         {title}
      </Button>
   );
};

export default SuggestionsCardActionCancel;
