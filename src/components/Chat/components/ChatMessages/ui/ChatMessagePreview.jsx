import cn from "classnames";

import getSrcImage from "../../../../../helpers/getSrcImage";
import { ThumbPhotoDefault } from "../../../../../ui/ThumbPhoto";
import hasText from "../../ChatDraft/hasText";

const ChatMessagePreview = ({ message, className }) => {
	const photos = message.photos || [];
	const video = message.files?.filter(item => item.type === "video")?.[0];
	const audio = message.files?.filter(item => item.type === "audio");

	if (!photos.length && !video && !audio.length) {
		return;
	}

	return (
		<div className={cn(className, "inline-flex gap-1 mr-1")}>
			{Boolean(photos.length) && (
				<div className={cn("flex gap-1")}>
					{photos.map((photo, index) => {
						return (
							<ThumbPhotoDefault key={index} style={{ width: 15, height: 15, borderRadius: 2, flex: "0 0 15px" }}>
								<img src={getSrcImage(photo.url)} />
							</ThumbPhotoDefault>
						);
					})}
				</div>
			)}
			{Boolean(video) && (
				<ThumbPhotoDefault style={{ width: 15, height: 15, borderRadius: 2, flex: "0 0 15px" }}>
					<img src={getSrcImage(video.preview || "")} />
				</ThumbPhotoDefault>
			)}
			{Boolean(audio.length) && <span className='cut cut-1'>Голосовое сообщение</span>}
			{Boolean(photos.length) && !hasText(message.text) && <span className='cut cut-1'>{photos.length} фото</span>}
			{Boolean(video) && !hasText(message.text) && <span className='cut cut-1'>Видео</span>}
		</div>
	);
};

export default ChatMessagePreview;
