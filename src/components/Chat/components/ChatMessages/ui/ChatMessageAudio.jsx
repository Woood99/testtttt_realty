import { useContext } from 'react';
import VoicePlayer from '../../../../VoicePlayer';
import { ChatMessageContext, ChatMessagesContext } from '../../../../../context';
import { BASE_URL } from '../../../../../constants/api';

const ChatMessageAudio = () => {
   const { handlePlayAudio, handleStopAudio } = useContext(ChatMessagesContext);
   const { data, audioData, currentDialog } = useContext(ChatMessageContext);

   if (!audioData) return;

   return (
      <div className="voice-player" data-chat-tooltip>
         <VoicePlayer
            defaultBlob={audioData.blob}
            audioUrl={audioData.test_url || `${BASE_URL}${audioData.url}`}
            onPlay={handlePlayAudio}
            onStop={handleStopAudio}
            downloadParams={{
               dialog_id: currentDialog.id,
               message_id: data.id,
            }}
         />
      </div>
   );
};

export default ChatMessageAudio;
