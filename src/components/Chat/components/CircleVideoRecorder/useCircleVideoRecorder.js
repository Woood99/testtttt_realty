import { useEffect, useRef, useState } from "react";

export const useCircleVideoRecorder = options => {
	const { submit, WIDTH, HEIGHT } = options;
	const [isRecording, setIsRecording] = useState(false);
	const [recordedChunks, setRecordedChunks] = useState([]);
	const [videoUrl, setVideoUrl] = useState(null);
	const [timer, setTimer] = useState(0);
	const [facingMode, setFacingMode] = useState("user");

	const webcamRef = useRef(null);
	const mediaRecorderRef = useRef(null);
	const canvasRef = useRef(null);
	const timerRef = useRef(null);

	const videoConstraints = {
		width: WIDTH,
		height: HEIGHT,
		facingMode
	};

	const startRecording = async () => {
		try {
			const stream = webcamRef.current.video.srcObject;
			if (!stream) {
				console.error("No media stream available");
				return;
			}

			setRecordedChunks([]);
			setIsRecording(true);
			setTimer(0);

			const processedStream = await processVideoStream(stream);

			mediaRecorderRef.current = new MediaRecorder(processedStream, {
				mimeType: "video/webm"
			});

			mediaRecorderRef.current.ondataavailable = event => {
				if (event.data.size > 0) {
					setRecordedChunks(prev => [...prev, event.data]);
				}
			};

			mediaRecorderRef.current.start();
			timerRef.current = setInterval(() => setTimer(prev => prev + 1), 1000);
		} catch (error) {
			console.error("Error starting recording:", error);
			setIsRecording(false);
		}
	};

	const processVideoStream = async originalStream => {
		const canvas = canvasRef.current;
		const ctx = canvas.getContext("2d");
		canvas.width = WIDTH;
		canvas.height = HEIGHT;

		const videoTrack = originalStream.getVideoTracks()[0];
		const processor = new MediaStreamTrackProcessor({ track: videoTrack });
		const generator = new MediaStreamTrackGenerator({ kind: "video" });

		const transform = new TransformStream({
			transform: (videoFrame, controller) => {
				ctx.clearRect(0, 0, canvas.width, canvas.height);

				// Рисуем круглую маску
				ctx.beginPath();
				ctx.arc(canvas.width / 2, canvas.height / 2, canvas.width / 2, 0, Math.PI * 2);
				ctx.closePath();
				ctx.clip();

				// Рисуем видео
				ctx.drawImage(videoFrame, 0, 0, canvas.width, canvas.height);
				videoFrame.close();

				// Создаем новый кадр из canvas
				const newFrame = new VideoFrame(canvas, { timestamp: videoFrame.timestamp });
				controller.enqueue(newFrame);
			}
		});

		processor.readable.pipeThrough(transform).pipeTo(generator.writable);

		const audioTrack = originalStream.getAudioTracks()[0];
		const finalStream = new MediaStream();
		finalStream.addTrack(generator);
		if (audioTrack) finalStream.addTrack(audioTrack);

		return finalStream;
	};

	const stopRecording = () => {
		if (mediaRecorderRef.current) mediaRecorderRef.current.stop();
		if (timerRef.current) clearInterval(timerRef.current);
		setIsRecording(false);
	};

	const toggleCamera = () => {
		setFacingMode(prev => (prev === "user" ? "environment" : "user"));
	};

	useEffect(() => {
		if (recordedChunks.length > 0 && !isRecording) {
			const blob = new Blob(recordedChunks, { type: "video/webm" });
			setVideoUrl(URL.createObjectURL(blob));
		}
	}, [recordedChunks, isRecording]);

	const handleSubmit = async () => {
		if (recordedChunks.length === 0) return;

		const blob = new Blob(recordedChunks, { type: "video/webm" });

		if (submit) {
			submit(blob);
		}
	};

	const formatTime = seconds => {
		const mins = Math.floor(seconds / 60);
		const secs = seconds % 60;
		return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
	};

	return {
		videoUrl,
		isRecording,
		startRecording,
		stopRecording,
		handleSubmit,
		formatTime,
		timer,
		webcamRef,
		videoConstraints,
		canvasRef,
		setVideoUrl,
		toggleCamera
	};
};
