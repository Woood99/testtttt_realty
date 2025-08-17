import { ChatIconDialogs } from './ChatIconDialogs';

const ChatEmptyDialogs = () => {
   return (
      <div className="text-center flex flex-col items-center justify-center flex-grow h-full">
         <ChatIconDialogs />
         <h3 className="title-3 mt-12">Общаться с застройщиком — легко</h3>
         <p className="mt-1.5 text-primary400">Пока диалогов нет.</p>
      </div>
   );
};

export default ChatEmptyDialogs;
