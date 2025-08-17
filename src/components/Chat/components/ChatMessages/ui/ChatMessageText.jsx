import { useContext } from 'react';
import { ChatMessageContext, ChatMessagesContext } from '../../../../../context';
import isLink from '../../../../../helpers/isLink';
import normalizeLink from '../../../../../helpers/normalizeLink';

import styles from '../../../Chat.module.scss';
import { GetDescrHTML } from '../../../../BlockDescr/BlockDescr';
import hasText from '../../ChatDraft/hasText';

const ChatMessageText = () => {
   const { data, dataText } = useContext(ChatMessageContext);

   if (data.is_json || !(dataText && hasText(dataText))) return;

   const is_link = isLink(dataText);

   if (is_link) {
      return (
         <a href={normalizeLink(dataText)} target="_blank" className={styles.ChatMessageTextLink}>
            {dataText}
         </a>
      );
   }

   return (
      <GetDescrHTML
         className={styles.ChatMessageText}
         data={dataText}
         onClick={e => {
            const spoiler = e.target.closest('.draft-spoiler');
            if (spoiler) {
               spoiler.classList.add('draft-spoiler--active');
            }
         }}
      />
   );
};

export default ChatMessageText;
