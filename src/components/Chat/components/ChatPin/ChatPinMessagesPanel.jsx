import { useContext, useEffect, useState } from 'react';
import cn from 'classnames';

import { ChatContext } from '../../../../context';
import { IconArrow } from '../../../../ui/Icons';
import { ChatMessages } from '..';
import { declensionPinMessages } from '../../../../helpers/declensionWords';
import { CHAT_TYPES } from '../../constants';
import CHAT_BG from '../../../../assets/img/chat-bg.jpg';

const ChatPinMessagesPanel = () => {
   const { chatPinMessages, currentDialog, deleteMessages } = useContext(ChatContext);
   const { isPinMessagePanelOpen, pinMessagePanelClose, pinMessages, pinMessagesLength } = chatPinMessages;

   const [isActive, setIsActive] = useState(false);
   const [showPopperMessage, setShowPopperMessage] = useState(false);

   useEffect(() => {
      const timer = setTimeout(() => {
         setIsActive(isPinMessagePanelOpen);
      }, 20);

      return () => clearTimeout(timer);
   }, [isPinMessagePanelOpen]);

   return (
      <div
         className={cn(
            'bg-white absolute w-full h-full z-[999] top-0 left-0 transition-all duration-300 flex flex-col',
            !isPinMessagePanelOpen && 'hidden',
            !isActive && 'left-full invisible'
         )}>
         <div className="min-h-16 h-16 px-4 flex items-center border-b border-b-primary800 bg-white">
            <button type="button" className="flex-center-all" onClick={pinMessagePanelClose}>
               <IconArrow className="rotate-180 fill-primary400" width={32} height={32} />
            </button>
            <h3 className="title-3-5 ml-4">{declensionPinMessages(pinMessagesLength)}</h3>
         </div>
         <div className="bg-[#e3efff] flex-grow flex flex-col overflow-hidden bg-no-repeat bg-cover" style={{ backgroundImage: `url(${CHAT_BG})` }}>
            {isActive && (
               <ChatMessages
                  messages={pinMessages}
                  variant="pin"
                  comments={currentDialog.dialog_type === CHAT_TYPES.CHANNEL}
                  showPopperMessage={showPopperMessage}
                  setShowPopperMessage={setShowPopperMessage}
                  deleteMessage={data => {
                     if (!data) return;
                     deleteMessages(data.ids, data.dialog_id, data.myMessage);
                  }}
                  editMessage={false}
               />
            )}
         </div>
      </div>
   );
};

export default ChatPinMessagesPanel;
