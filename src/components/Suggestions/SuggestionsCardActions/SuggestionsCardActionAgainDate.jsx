import { useContext } from 'react';
import { SuggestionsCardActionsContext, SuggestionsContext } from '../../../context';
import Button from '../../../uiForm/Button';
import dayjs from 'dayjs';

const SuggestionsCardActionAgainDate = ({ title = 'Записаться заново' }) => {
   const { setAgainSuggestionsModalOpen } = useContext(SuggestionsContext);
   const card = useContext(SuggestionsCardActionsContext);

   return (
      <Button
         size="34"
         variant="secondary"
         onClick={() => {
            if (!card.is_active) return;

            setAgainSuggestionsModalOpen({
               ...card,
               date: dayjs(card.date).format('DD.MM.YYYY'),
            });
         }}>
         {title}
      </Button>
   );
};

export default SuggestionsCardActionAgainDate;
