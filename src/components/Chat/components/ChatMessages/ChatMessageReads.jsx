import { ChatContext, ChatMessageContext } from '../../../../context';
import { useContext, useState } from 'react';
import dayjs from 'dayjs';
import cn from 'classnames';

import { CHAT_TYPES } from '../../constants';
import { declensionView } from '../../../../helpers/declensionWords';
import Avatar from '../../../../ui/Avatar';
import { Tooltip } from '../../../../ui/Tooltip';
import { getLastSeenOnline, isToday } from '../../../../helpers/changeDate';
import { IconDoubleTick } from '../../../../ui/Icons';

const ChatMessageReads = () => {
   const { userInfo, currentDialog } = useContext(ChatContext);
   const {
      myMessage,
      data: { reads },
   } = useContext(ChatMessageContext);

   const [isVisible, setIsVisible] = useState(false);

   const length = reads?.length;
   const dialog_type = currentDialog.dialog_type;

   if (dialog_type === CHAT_TYPES.CHANNEL || !length) return;

   if (dialog_type === CHAT_TYPES.CHAT) {
      if (!myMessage) return;
      const read = reads[0];
      if (!read) return;

      return (
         <div className="flex items-center gap-2 p-3 border-b border-b-primary700 w-full">
            <IconDoubleTick width={16} height={16} className="!fill-blue" />
            <span className="text-dark text-small">{getLastSeenOnline(read.updated_at)}</span>
         </div>
      );
   }

   return (
      <div className="mb-2 border-b border-b-primary700 w-full">
         <Tooltip
            mobile
            color="white"
            onChange={setIsVisible}
            value={isVisible}
            ElementTarget={() => (
               <div className={cn('flex gap-3 items-center p-3 cursor-pointer', isVisible && 'bg-hoverPrimary')}>
                  <IconDoubleTick width={16} height={16} className="!fill-blue" />

                  <span className="text-defaultMax">{declensionView(length)}</span>
                  <div className="flex ml-auto">
                     {reads.slice(0, 3).map((item, index) => {
                        return (
                           <div key={index} style={{ marginLeft: index > 0 ? '-8px' : '0' }}>
                              <Avatar size={25} src={item.user.image} title={item.user.name} />
                           </div>
                        );
                     })}
                  </div>
               </div>
            )}
            classNameContent="!shadow-none !p-0"
            placement="right-start"
            offset={[0, 0]}>
            <div className="bg-white shadow-primary px-3 py-3 rounded-xl flex flex-col gap-4">
               {reads.map(item => {
                  return (
                     <div key={item.id} className="flex gap-3 items-center">
                        <Avatar size={32} src={item.user.image} title={item.user.name} />
                        <div className="text-verySmall flex flex-col gap-0.5">
                           <span className="font-medium">{userInfo.id === item.user.id ? 'Вы' : item.user.name}</span>
                           <span className="min-w-max text-primary400">
                              <IconDoubleTick width={12} height={12} className={cn('translate-y-[2px] mr-1 !fill-blue')} />
                              {isToday(item.updated_at) ? dayjs(item.updated_at).format('HH:mm') : dayjs(item.updated_at).format('D MMM в HH:mm')}
                           </span>
                        </div>
                     </div>
                  );
               })}
            </div>
         </Tooltip>
      </div>
   );
};

export default ChatMessageReads;
