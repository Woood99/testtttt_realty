import { useContext } from 'react';
import cn from 'classnames';
import { ChatContext, ChatMessageContext } from '../../../../context';
import { useChatReaction } from '../../hooks';
import Avatar from '../../../../ui/Avatar';

import styles from '../../Chat.module.scss';

const ChatMessageReactionPanel = () => {
   const { cachedDialog, setCachedDialog } = useContext(ChatContext);
   const { data, userInfo, getDialog, currentDialog } = useContext(ChatMessageContext);
   const reactions = data.reactions;
   const MAX_COUNT = 3;

   const { chatReactionCreate, chatReactionDelete, chatReactionCreateFake, chatReactionDeleteFake } = useChatReaction();

   if (!reactions?.length) return;

   const sortedReactions = [...reactions].sort((a, b) => (b.user.id === userInfo.id) - (a.user.id === userInfo.id));

   const groupedReactions = Object.values(
      sortedReactions.reduce((acc, item) => {
         if (!acc[item.value]) {
            acc[item.value] = { value: item.value, items: [] };
         }
         acc[item.value].items.push(item);
         acc[item.value].count = acc[item.value].items.length;
         return acc;
      }, {})
   );

   const onClickGroup = async (group, findMe) => {
      const current = cachedDialog[currentDialog.id];

      if (findMe) {
         if (current) chatReactionDeleteFake(current.result, setCachedDialog, data, userInfo);
         await chatReactionDelete(findMe.id, findMe.dialog_id, findMe.message_id);
         await getDialog(findMe.dialog_id);
      } else {
         const firstItem = group.items?.[0];
         if (!firstItem) return;
         if (current) chatReactionCreateFake(current.result, setCachedDialog, firstItem.value, data, userInfo);
         await chatReactionCreate(firstItem.dialog_id, firstItem.message_id, firstItem.value);
         await getDialog(firstItem.dialog_id);
      }
   };

   return (
      <div className={styles.ChatMessageReactions} data-chat-tooltip>
         {groupedReactions.map((group, index) => {
            const findMe = group.items.find(find => find.user.id === userInfo.id);

            return (
               <div
                  key={index}
                  className={cn('flex items-center gap-1 bg-primary100 py-1 px-2 rounded-full cursor-pointer', findMe && '!bg-lightBlue')}
                  onClick={() => {
                     onClickGroup(group, findMe);
                  }}>
                  <span>{group.value}</span>
                  {group.count > MAX_COUNT ? (
                     <span className={cn(findMe && '!text-white')}>{group.count}</span>
                  ) : (
                     <>
                        {group.items.map((item, index) => {
                           return (
                              <div key={item.id} style={{ marginLeft: index > 0 ? '-10px' : '0' }}>
                                 <Avatar size={18} src={item.user.image} title={item.user.name} />
                              </div>
                           );
                        })}
                     </>
                  )}
               </div>
            );
         })}
      </div>
   );
};

export default ChatMessageReactionPanel;
