import { useContext } from 'react';
import cn from 'classnames';
import { ChatContext } from '../../../../context';
import { getLastElementArray } from '../../../../helpers/arrayMethods';
import { IconClip2 } from '../../../../ui/Icons';
import { GetDescrHTML } from '../../../BlockDescr/BlockDescr';

const ChatPinTop = () => {
   const { chatPinMessages } = useContext(ChatContext);
   const { hasPinMessage, pinMessagePanelOpen, pinMessagesList, pinMessagesLength } = chatPinMessages;

   if (!hasPinMessage) return;
   const heightPin = pinMessagesLength === 1 ? 'min-h-full' : pinMessagesLength === 2 ? 'h-[19px]' : 'min-h-[13px]';
   const pinLast = getLastElementArray(pinMessagesList);

   return (
      <div className="min-h-16 h-16 px-4 py-3 border-b border-b-primary800 bg-white overflow-hidden">
         <div className="flex gap-2 h-full">
            <div className="flex flex-col gap-[1px] overflow-y-auto scrollbarPrimary scrollbarPrimaryNoVisible flex-shrink-0">
               {pinMessagesList.map(item => {
                  return <div key={item.id} className={cn('bg-blue w-0.5 h-full opacity-60', pinLast.id === item.id && 'opacity-100', heightPin)} />;
               })}
            </div>
            <div className="flex flex-col justify-between flex-grow">
               <h3 className="font-medium text-dark text-defaultMax md1:text-default">Закреплённые сообщения</h3>
               <div className="cut cut-1 max-w-[90%] text-dark">
                  <GetDescrHTML data={pinLast.text} />
               </div>
            </div>
            <button type="button" className="self-center ml-auto" onClick={pinMessagePanelOpen}>
               <IconClip2 width={24} height={24} className="fill-dark" />
            </button>
         </div>
      </div>
   );
};

export default ChatPinTop;
