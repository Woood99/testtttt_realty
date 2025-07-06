const UnreadMessagesCount = ({ data, currentDialog }) => {
   if (!data.un_read_messages_count) return;

   return <div className={`bg-count-circle ${currentDialog.id !== data.id ? '_blue' : '_white'} `}>{data.un_read_messages_count}</div>;
};

export default UnreadMessagesCount;
