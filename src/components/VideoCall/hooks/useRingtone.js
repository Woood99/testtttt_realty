import { BroadcastChannel as PolyBroadcastChannel } from "broadcast-channel";
import { useEffect, useRef } from "react";

const BroadcastChannel = typeof window !== "undefined" && "BroadcastChannel" in window ? window.BroadcastChannel : PolyBroadcastChannel;

export const useRingtone = (isCalling, ringtone = "/ringtone.mp3") => {
	const audioRef = useRef(null);
	const channelRef = useRef(null);
	const tabIdRef = useRef(Date.now().toString());

	useEffect(() => {
		try {
			channelRef.current = new BroadcastChannel("rington_channel");
		} catch (e) {
			console.warn("BroadcastChannel не доступен:", e);
			return;
		}

		const handleMessage = event => {
			if (event.data.type === "claim_leadership" && event.data.tabId !== tabIdRef.current) {
				audioRef.current?.pause();
				if (audioRef.current) audioRef.current.currentTime = 0;
			}
		};

		channelRef.current.addEventListener("message", handleMessage);

		if (!audioRef.current) {
			audioRef.current = new Audio(ringtone);
			audioRef.current.loop = true;
		}
		const audio = audioRef.current;

		if (isCalling) {
			channelRef.current.postMessage({
				type: "claim_leadership",
				tabId: tabIdRef.current
			});
			audio.volume = 0.25;
			audio
				.play()
				.catch(console.error)
				.finally(() => {
					audio.volume = 0.25;
				});
		} else {
			audio.pause();
			audio.currentTime = 0;
		}

		return () => {
			audio.pause();
			audio.currentTime = 0;
			channelRef.current?.removeEventListener("message", handleMessage);
			channelRef.current?.close();
		};
	}, [isCalling, ringtone]);

	useEffect(() => {
		const handleBeforeUnload = () => {
			if (isCalling && !audioRef.current?.paused) {
				channelRef.current?.postMessage({ type: "leader_left" });
			}
		};

		window.addEventListener("beforeunload", handleBeforeUnload);
		return () => window.removeEventListener("beforeunload", handleBeforeUnload);
	}, [isCalling]);
};
