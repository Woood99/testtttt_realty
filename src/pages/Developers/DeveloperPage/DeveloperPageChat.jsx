import { useContext } from 'react';

import Button from '../../../uiForm/Button';
import { DeveloperPageContext } from '../../../context';
import { useNavigateToChat } from '../../../hooks/useNavigateToChat';

const DeveloperPageChat = ({ className, size = '34' }) => {
   const { data } = useContext(DeveloperPageContext);

   const navigateToChat = useNavigateToChat();

   const goToChat = async () => {
      await navigateToChat({ organization_id: data.id });
   };

   return (
      <Button size={size} className={className} onClick={goToChat}>
         Написать сообщение
      </Button>
   );
};

export default DeveloperPageChat;
