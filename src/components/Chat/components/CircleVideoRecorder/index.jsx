import React from 'react';
import Webcam from 'react-webcam';
import Button from '../../../../uiForm/Button';
import { useCircleVideoRecorder } from './useCircleVideoRecorder';

const CircleVideoRecorder = ({ submit }) => {
   const WIDTH = 350;
   const HEIGHT = 350;

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
   } = useCircleVideoRecorder({ submit, WIDTH, HEIGHT });

   return (
      <div className="flex flex-col items-center gap-5">
         <div style={{ width: WIDTH, height: HEIGHT }} className="relative rounded-full overflow-hidden bg-gray shadow-md">
            {!videoUrl ? (
               <>
                  <Webcam
                     audio={true}
                     ref={webcamRef}
                     videoConstraints={videoConstraints}
                     audioConstraints={{
                        echoCancellation: true,
                        noiseSuppression: true,
                        autoGainControl: true,
                     }}
                     mirrored
                     className="w-full h-full object-cover rounded-full"
                     muted
                  />
                  {isRecording && (
                     <div className="absolute bottom-5 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm">
                        {formatTime(timer)}
                     </div>
                  )}
               </>
            ) : (
               <video src={videoUrl} controls className="w-full h-full object-cover rounded-full" />
            )}
         </div>

         <canvas ref={canvasRef} className="hidden" />

         <div className="flex gap-3">
            {!isRecording && !videoUrl && (
               <Button onClick={startRecording} size="Small">
                  Начать запись
               </Button>
            )}

            {isRecording && (
               <Button onClick={stopRecording} size="Small" variant="red">
                  Остановить
               </Button>
            )}

            {videoUrl && !isRecording && (
               <>
                  <Button onClick={() => setVideoUrl(null)} size="Small" variant="secondary">
                     Перезаписать
                  </Button>
                  <Button onClick={handleSubmit} size="Small">
                     Отправить
                  </Button>
               </>
            )}
         </div>
      </div>
   );
};

export default CircleVideoRecorder;
