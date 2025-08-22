import cn from "classnames";
import React, { useEffect, useRef, useState } from "react";
import { AudioVisualizer } from "react-audio-visualize";

import { Avatar, Maybe } from "@/ui";

import { sendPostRequest } from "../../api/requestsApi";
import { IconMicrophone, IconPause, IconPlay } from "../../ui/Icons";

import styles from "./VoicePlayer.module.scss";

const VoicePlayer = ({ audioUrl, defaultBlob = null, onPlay = () => {}, onStop = () => {}, downloadParams = null, className, data, reverse }) => {
	const [isPlaying, setIsPlaying] = useState(false);

	const audioRef = useRef(null);
	const visualizerRef = useRef(null);
	const progressBarRef = useRef(null);

	const [audioBlob, setAudioBlob] = useState(null);

	const [progress, setProgress] = useState(0);

	useEffect(() => {
		const fetchData = async () => {
			if (!audioUrl) return;
			try {
				if (defaultBlob) {
					setAudioBlob(defaultBlob);
				} else {
					sendPostRequest("/api/messages/message/get-message-file", downloadParams, { responseType: "blob", Accept: "audio/ogg" }).then(
						response => {
							const blob = new Blob([response.data], { type: "audio/ogg" });
							setAudioBlob(blob);
						}
					);
				}
			} catch (error) {}
		};
		fetchData();
	}, []);

	const handlePlay = () => {
		if (!audioRef.current || !audioUrl) return;

		audioRef.current.play();
		setIsPlaying(true);
		onPlay(audioRef.current, () => setIsPlaying(false));
	};

	const handleStop = () => {
		if (!audioRef.current) return;

		audioRef.current.pause();
		setIsPlaying(false);
		onStop();
	};

	const handleProgressBarClick = event => {
		if (!audioRef.current || !progressBarRef.current) return;

		const progressBarWidth = progressBarRef.current.offsetWidth;
		const clickPosition = event.nativeEvent.offsetX;
		const clickPercentage = (clickPosition / progressBarWidth) * 100;

		handlePlay();

		setTimeout(() => {
			const duration = audioRef.current.duration;
			if (duration !== Infinity) {
				audioRef.current.currentTime = (clickPercentage / 100) * duration;
				setProgress(clickPercentage);
			}
		}, 10);
	};

	useEffect(() => {
		if (!audioRef.current) return;

		const updateProgress = () => {
			const currentTime = audioRef.current.currentTime;
			const duration = audioRef.current.duration;
			const progressPercentage = (currentTime / duration) * 100;
			setProgress(progressPercentage);
		};

		const handleEnded = () => {
			setIsPlaying(false);
			setProgress(0);
			onStop();
		};

		audioRef.current.addEventListener("timeupdate", updateProgress);
		audioRef.current.addEventListener("ended", handleEnded);

		return () => {
			if (audioRef.current) {
				audioRef.current.removeEventListener("timeupdate", updateProgress);
				audioRef.current.removeEventListener("ended", handleEnded);
			}
		};
	}, []);

	return (
		<div className={cn(styles.VoicePlayerRoot, className)}>
			<audio ref={audioRef} controls src={audioUrl} type='audio/ogg' style={{ display: "none" }}>
				Your browser does not support the audio element.
			</audio>
			<Maybe condition={!reverse}>
				<Avatar size={44} src={data.image} title={data.name}>
					<IconMicrophone className='absolute bottom-0 -right-1.5 stroke-dark fill-white' />
				</Avatar>
			</Maybe>
			<Maybe
				condition={!isPlaying || audioRef.current?.paused}
				fallback={
					<button onClick={handleStop} className={styles.VoicePlayerBtn}>
						<IconPause width={26} height={26} className='fill-blue' />
					</button>
				}>
				<button onClick={handlePlay} className={styles.VoicePlayerBtn}>
					<IconPlay width={26} height={26} className='fill-blue' />
				</button>
			</Maybe>
			<Maybe condition={(defaultBlob || audioBlob) && audioUrl}>
				<div className='relative h-8'>
					<AudioVisualizer
						audioContext={visualizerRef}
						blob={null}
						style={{ width: "100%", position: "relative", zIndex: "99", display: "block", height: "100%" }}
						width={366}
						height={44}
						barWidth={4}
						gap={1}
						barColor='#3390ec'
					/>

					{/* Готовый визуал-аудио
               <AudioVisualizer
                  audioContext={visualizerRef}
                  blob={defaultBlob || audioBlob}
                  style={{ width: '100%', position: 'relative', zIndex: '99', display: 'block', height: '100%',padding: '4px' }}
                  width={366}
                  height={44}
                  barWidth={4}
                  gap={1}
                  barColor="#3390ec"
               /> */}
					<div className={styles.VoicePlayerProgress} onClick={handleProgressBarClick} ref={progressBarRef}>
						<div
							className={styles.VoicePlayerProgressInner}
							style={{
								width: `${progress}%`
							}}
						/>
					</div>
				</div>
			</Maybe>
			<Maybe condition={reverse}>
				<Avatar size={44} src={data.image} title={data.name}>
					<IconMicrophone className='absolute bottom-0 -left-1.5 stroke-dark fill-white' />
				</Avatar>
			</Maybe>
		</div>
	);
};

export default VoicePlayer;
