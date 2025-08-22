import cn from "classnames";
import { useContext, useEffect, useRef } from "react";
import { useSelector } from "react-redux";

import { BASE_URL } from "@/constants";

import { ChatMessageContext } from "@/context";

import { getIsDesktop } from "@/redux";

import { Spinner } from "@/ui";

import VideoDefault from "../../../../../ModalsMain/VideoModal/VideoDefault";
import Story from "../../../../Story";
import hasText from "../../ChatDraft/hasText";

const ChatMessageVideo = () => {
	const { data, videoData, setGalleryCurrentIndex, dataText, photosLength } = useContext(ChatMessageContext);

	const isDesktop = useSelector(getIsDesktop);
	const refElement = useRef(null);

	useEffect(() => {
		if (!refElement.current) return;

		const observer = new IntersectionObserver(
			entries => {
				entries.forEach(entry => {
					const video = entry.target;
					if (entry.isIntersecting) {
						if (video.paused) {
							video.play().catch(e => console.log("Autoplay prevented:", e));
							video.muted = true;
							video.classList.add("playingVideo222");
						}
					} else {
						video.pause();
						video.classList.remove("playingVideo222");
					}
				});
			},
			{ threshold: 0.5, root: document.querySelector(".chat-container") }
		);

		observer.observe(refElement.current);

		return () => observer.disconnect();
	}, []);

	if (!videoData) return;

	return (
		<div
			data-chat-tooltip
			className={cn(
				"overflow-hidden relative rounded-xl",
				videoData.is_story && "!rounded-full",
				hasText(dataText) && "!rounded-none chat-video-player-no-rounded"
			)}
			onClick={() => {
				if (!videoData.is_story) {
					setGalleryCurrentIndex(videoData.index);
				}
			}}>
			{videoData.is_story ? (
				<Story refElement={refElement} videoUrl={videoData.test_url || `${BASE_URL}${videoData.url}`} size={isDesktop ? 280 : 220} />
			) : (
				<>{!photosLength && <VideoDefault refElement={refElement} src={videoData.test_url || `${BASE_URL}${videoData.url}`} />}</>
			)}
			{data.loading && (
				<div className='rounded-xl absolute top-0 left-0 w-full h-full flex-center-all z-[98] bg-[rgba(70,70,70,0.55)]'>
					<Spinner className='mx-auto !border-white !border-b-[transparent]' />
				</div>
			)}
		</div>
	);
};

export default ChatMessageVideo;
