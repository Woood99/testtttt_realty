import { useContext } from 'react';
import cn from 'classnames';
import styles from '../../../Chat.module.scss';
import { ChatMessageContext } from '../../../../../context';
import { IconClock, IconDoubleTick } from '../../../../../ui/Icons';
import dayjs from 'dayjs';

const ChatMessageTimeAndReads = () => {
   const { data, dataText, videoData } = useContext(ChatMessageContext);

   const time = dayjs(data.created_at).format('HH:mm');

   const is_bg = (data.photos?.length || videoData) && !dataText && !data.reactions?.length;

   return (
      <div
         className={cn(
            is_bg ? styles.ChatMessageTimeBg : styles.ChatMessageBottomInfo,
            is_bg && videoData && !dataText && styles.ChatMessageTimeBgVideo
         )}>
         <span className={styles.ChatMessageBottomInfoDate}>
            <span>{time}</span>
         </span>
         {data.loading ? (
            <div className="flex-center-all" title="Сообщение отправляется">
               <IconClock width={14} height={14} className="fill-graySecond" />
            </div>
         ) : (
            <IconDoubleTick width={14} height={14} className={cn('fill-graySecond', data.reads?.length && '!fill-blue')} />
         )}
      </div>
   );
};

export default ChatMessageTimeAndReads;
