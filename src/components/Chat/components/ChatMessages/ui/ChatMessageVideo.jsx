import { useContext } from 'react';
import cn from 'classnames';

import { ChatMessageContext, ChatMessagesContext } from '../../../../../context';
import Spinner from '../../../../../ui/Spinner';
import AdaptiveVideoPlayer from '../../../../../ModalsMain/VideoModal/AdaptiveVideoPlayer';
import { BASE_URL } from '../../../../../constants/api';
import Story from '../../../../Story';
import { useSelector } from 'react-redux';
import { getIsDesktop } from '../../../../../redux/helpers/selectors';

const ChatMessageVideo = () => {
   const { draftOptions } = useContext(ChatMessagesContext);
   const { data, videoData, setGalleryCurrentIndex, dataText } = useContext(ChatMessageContext);

   const isDesktop = useSelector(getIsDesktop);

   if (!videoData) return;

   return (
      <div
         data-chat-tooltip
         className={cn('overflow-hidden relative rounded-xl', videoData.is_story && '!rounded-full')}
         onClick={() => {
            if (!videoData.is_story) {
               setGalleryCurrentIndex(videoData.index);
            }
         }}>
         {videoData.is_story ? (
            <Story videoUrl={videoData.test_url || `${BASE_URL}${videoData.url}`} size={isDesktop ? 280 : 220} />
         ) : (
            <AdaptiveVideoPlayer
               src={videoData.test_url || `${BASE_URL}${videoData.url}`}
               className={cn('pointer-events-none',draftOptions.hasText(dataText) && '!max-w-full vjs-vertical-video-full')}
            />
         )}
         {data.loading && (
            <div className="rounded-xl absolute top-0 left-0 w-full h-full flex-center-all z-[98] bg-[rgba(70,70,70,0.55)]">
               <Spinner className="mx-auto !border-white !border-b-[transparent]" />
            </div>
         )}
      </div>
   );
};

export default ChatMessageVideo;
