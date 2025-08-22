import { useContext } from "react";

import { BASE_URL } from "@/constants";

import { ChatContext, ChatMessageContext, ChatMessagesContext } from "@/context";

import { VoicePlayer } from "@/components";

const ChatMessageAudio = () => {
	const { currentDialogUserInfo, currentDialog } = useContext(ChatContext);
	const { handlePlayAudio, handleStopAudio } = useContext(ChatMessagesContext);
	const { data, audioData, myMessage } = useContext(ChatMessageContext);

	if (!audioData) return;

	return (
		<div className='voice-player' data-chat-tooltip>
			<VoicePlayer
				defaultBlob={audioData.blob}
				audioUrl={audioData.test_url || `${BASE_URL}${audioData.url}`}
				onPlay={handlePlayAudio}
				onStop={handleStopAudio}
				data={{
					user_avatar: currentDialogUserInfo.type_channel
						? currentDialogUserInfo.image
						: myMessage
							? data.user.image
							: currentDialogUserInfo.image,
					name: currentDialogUserInfo.type_channel ? currentDialogUserInfo.name : myMessage ? data.user.name : currentDialogUserInfo.name
				}}
				reverse={!myMessage}
				downloadParams={{
					dialog_id: currentDialog.id,
					message_id: data.id
				}}
			/>
		</div>
	);
};

export default ChatMessageAudio;
