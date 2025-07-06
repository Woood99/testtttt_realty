import { useContext } from 'react';
import styles from '../../../Chat.module.scss';

import { ChatMessageContext } from '../../../../../context';
import { declensionComments } from '../../../../../helpers/declensionWords';
import { IconArrow } from '../../../../../ui/Icons';
import Avatar from '../../../../../ui/Avatar';

const ChatMessageCommentsButton = () => {
   const { data, messageCommentsOptions } = useContext(ChatMessageContext);
   const { messageCommentPanelOpen } = messageCommentsOptions;

   const uniqueUsers = (data.comments || [])
      .reduce((acc, current) => {
         const exists = acc.find(item => item.id === current.user.id);

         if (!exists) {
            acc.push(current.user);
         }
         return acc;
      }, [])
      .slice(0, 3);

   return (
      <button
         type="button"
         className={styles.ChatMessageCommentsButton}
         onClick={() => {
            messageCommentPanelOpen(data.dialog_id, data.id);
         }}>
         {Boolean(uniqueUsers.length) && (
            <div className="flex items-center gap-1">
               {uniqueUsers.map((item, index) => {
                  return (
                     <div key={item.id} style={{ marginLeft: index > 0 ? '-12px' : '0' }}>
                        <Avatar size={22} src={item.image} title={item.name} />
                     </div>
                  );
               })}
            </div>
         )}

         {declensionComments(data.comment_count || 0)}
         <IconArrow className="ml-auto fill-primary400" />
      </button>
   );
};

export default ChatMessageCommentsButton;
