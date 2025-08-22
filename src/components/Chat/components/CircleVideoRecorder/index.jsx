import React, { useRef } from "react";
import Webcam from "react-webcam";

import { Story } from "@/components";

import { Maybe } from "@/ui";

import { Button } from "@/uiForm";

import { useCircleVideoRecorder } from "./useCircleVideoRecorder";

const CircleVideoRecorder = ({ submit }) => {
	const WIDTH = 330;
	const HEIGHT = 330;

	const {
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
	} = useCircleVideoRecorder({ submit, WIDTH, HEIGHT });

	const inputRef = useRef(null);

	return (
		<div className='flex flex-col h-full justify-center'>
			<Maybe condition={!isRecording && !videoUrl}>
				<Button onClick={() => inputRef.current?.click()} size='Small' className='absolute top-4 left-4'>
					Загрузить готовое
				</Button>
			</Maybe>
			<div className='flex flex-col items-center gap-5'>
				<div style={{ width: WIDTH, height: HEIGHT }} className='relative rounded-full overflow-hidden bg-gray shadow-md'>
					{!videoUrl ? (
						<>
							<Webcam
								audio={true}
								ref={webcamRef}
								videoConstraints={videoConstraints}
								audioConstraints={{
									echoCancellation: true,
									noiseSuppression: true,
									autoGainControl: true
								}}
								mirrored
								className='w-full h-full object-cover rounded-full'
								muted
							/>
							{isRecording && (
								<div className='absolute bottom-5 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm'>
									{formatTime(timer)}
								</div>
							)}
						</>
					) : (
						<Story videoUrl={videoUrl} size={WIDTH} />
					)}
				</div>

				<canvas ref={canvasRef} className='hidden' />
				<input
					ref={inputRef}
					className='!hidden'
					type='file'
					accept='video/*'
					onChange={e => {
						const file = e.target?.files?.[0];
						if (!file) return;
						if (submit) {
							submit(file);
						}
					}}
				/>
			</div>
			<div className='flex gap-3 absolute bottom-6 left-1/2 transform -translate-x-1/2'>
				<Maybe condition={!isRecording && !videoUrl}>
					<Button onClick={startRecording} size='Small'>
						Начать запись
					</Button>
					<Button onClick={toggleCamera} size='Small' variant='secondary'>
						Развернуть камеру
					</Button>
				</Maybe>
				<Maybe condition={isRecording}>
					<Button onClick={stopRecording} size='Small' variant='red'>
						Остановить
					</Button>
				</Maybe>
				<Maybe condition={videoUrl && !isRecording}>
					<Button onClick={() => setVideoUrl(null)} size='Small' variant='red'>
						Удалить/перезаписать
					</Button>
					<Button onClick={handleSubmit} size='Small'>
						Загрузить
					</Button>
				</Maybe>
			</div>
		</div>
	);
};

export default CircleVideoRecorder;
