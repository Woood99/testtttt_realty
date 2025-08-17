import { useState, useRef, useEffect } from 'react';
import { MICROPHONE_ERRORS } from '../constants';

export const useChatVoiceRecorder = ({ sendVoiceRecorder, setIsVoiceRecording }) => {
   const [time, setTime] = useState(0);
   const [error, setError] = useState('');

   const startDelayRef = useRef(null);
   const timerRef = useRef(null);
   const mediaRecorderRef = useRef(null);

   const buttonRef = useRef(null);
   const isPointerInsideRef = useRef(false);
   const isMouseDownRef = useRef(false);

   const handleStart = e => {
      e.preventDefault();
      isPointerInsideRef.current = true;
      isMouseDownRef.current = true;

      startDelayRef.current = setTimeout(async () => {
         if (!isMouseDownRef.current) return;

         try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

            if (!isMouseDownRef.current) {
               stream.getTracks().forEach(track => track.stop());
               return;
            }

            startRecording(stream);
         } catch (err) {
            const currentError = 'access';
            setError({ ...MICROPHONE_ERRORS.find(item => item.name === currentError), err });
         }
      }, 200);
   };

   const handleStop = () => {
      clearTimeout(startDelayRef.current);
      if (!isMouseDownRef.current) return;

      isMouseDownRef.current = false;

      if (mediaRecorderRef.current?.state === 'recording') {
         mediaRecorderRef.current.stop();
      }
      stopTimer();
      setIsVoiceRecording(false);
   };

   const startRecording = stream => {
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      let chunks = [];
      mediaRecorder.ondataavailable = e => chunks.push(e.data);
      mediaRecorder.onstop = () => {
         if (isPointerInsideRef.current) {
            const blob = new Blob(chunks, { type: 'audio/ogg' });
            sendVoiceRecorder(blob);
         }
         stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsVoiceRecording(true);
      startTimer();
   };

   const checkPointerPosition = e => {
      if (!buttonRef.current || !isMouseDownRef.current) return;

      const rect = buttonRef.current.getBoundingClientRect();
      let clientX, clientY;

      if (e.type.includes('touch')) {
         const touch = e.touches[0];
         clientX = touch.clientX;
         clientY = touch.clientY;
      } else {
         clientX = e.clientX;
         clientY = e.clientY;
      }

      isPointerInsideRef.current = clientX >= rect.left && clientX <= rect.right && clientY >= rect.top && clientY <= rect.bottom;
   };

   const startTimer = () => {
      setTime(0);
      timerRef.current = setInterval(() => setTime(prev => prev + 100), 100);
   };

   const stopTimer = () => {
      clearInterval(timerRef.current);
   };

   useEffect(() => {
      const handleGlobalPointerUp = () => {
         if (isMouseDownRef.current) handleStop();
      };

      const handleGlobalPointerMove = e => {
         if (isMouseDownRef.current) checkPointerPosition(e);
      };

      const events = [
         ['mouseup', handleGlobalPointerUp],
         ['touchend', handleGlobalPointerUp],
         ['mousemove', handleGlobalPointerMove],
         ['touchmove', handleGlobalPointerMove],
      ];

      events.forEach(([event, handler]) => {
         document.addEventListener(event, handler);
      });

      return () => {
         events.forEach(([event, handler]) => {
            document.removeEventListener(event, handler);
         });
      };
   }, []);

   return { time, buttonRef, error, setError, handleStart };
};
