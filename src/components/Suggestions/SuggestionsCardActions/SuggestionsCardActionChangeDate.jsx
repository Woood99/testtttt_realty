import { useContext } from 'react';
import { SuggestionsCardActionsContext, SuggestionsContext } from '../../../context';
import Button from '../../../uiForm/Button';
import dayjs from 'dayjs';

const SuggestionsCardActionChangeDate = ({ title = 'Изменить дату и время' }) => {
   const { setChangeDateModalOpen } = useContext(SuggestionsContext);
   const card = useContext(SuggestionsCardActionsContext);

   return (
      <Button
         onClick={() => {
            if (!card.is_active) return;

            setChangeDateModalOpen({
               ...card,
               date: dayjs(card.date).format('DD.MM.YYYY'),
            });
         }}>
         {title}
      </Button>
   );
};

export default SuggestionsCardActionChangeDate;
