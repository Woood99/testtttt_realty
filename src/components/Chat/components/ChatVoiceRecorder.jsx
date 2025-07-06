import React, { useState, useRef, useContext, useEffect } from 'react';
import styles from '../Chat.module.scss';
import ModalWrapper from '../../../ui/Modal/ModalWrapper';
import Modal from '../../../ui/Modal';
import { IconMicrophone } from '../../../ui/Icons';
import { ChatContext } from '../../../context';
import { formatTimeRecorder } from '../helpers';
import { MICROPHONE_ERRORS } from '../constants';

const ChatVoiceRecorder = () => {
   const { sendVoiceRecorder, isVoiceRecording, setIsVoiceRecording } = useContext(ChatContext);
   const [time, setTime] = useState(0);
   const timerRef = useRef(null);
   const mediaRecorderRef = useRef(null);
   const buttonRef = useRef(null);
   const isPointerInsideRef = useRef(false);
   const isMouseDownRef = useRef(false);
   const [error, setError] = useState('');

   const handleStart = async e => {
      e.preventDefault();
      isPointerInsideRef.current = true;
      isMouseDownRef.current = true;

      try {
         const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
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
      } catch (error) {
         let currentError = 'access';
         setError({ ...MICROPHONE_ERRORS.find(item => item.name === currentError), error });
      }
   };

   const handleStop = () => {
      if (!isMouseDownRef.current) return;

      isMouseDownRef.current = false;

      if (mediaRecorderRef.current?.state === 'recording') {
         mediaRecorderRef.current.stop();
      }
      stopTimer();
      setIsVoiceRecording(false);
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

      const isInside = clientX >= rect.left && clientX <= rect.right && clientY >= rect.top && clientY <= rect.bottom;

      isPointerInsideRef.current = isInside;
   };

   const startTimer = () => {
      setTime(0);
      timerRef.current = setInterval(() => setTime(prev => prev + 100), 100);
   };

   const stopTimer = () => {
      clearInterval(timerRef.current);
   };

   useEffect(() => {
      const handleGlobalMouseUp = () => {
         if (isMouseDownRef.current) handleStop();
      };

      const handleGlobalMouseMove = e => {
         if (isMouseDownRef.current) checkPointerPosition(e);
      };

      const events = [
         ['mouseup', handleGlobalMouseUp],
         ['touchend', handleGlobalMouseUp],
         ['mousemove', handleGlobalMouseMove],
         ['touchmove', handleGlobalMouseMove],
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

   return (
      <>
         {isVoiceRecording && (
            <div className={styles.ChatBottom}>
               <div className="h-9 flex items-center justify-between gap-4 w-full">
                  <div className="flex items-center gap-2 basis-[80px]">
                     <div className={styles.ChatBlinkCircle} />
                     {formatTimeRecorder(time)}
                  </div>
                  <p className="text-primary400">Для отмены отпустите курсор вне поля</p>
                  <div />
               </div>
            </div>
         )}

         <button
            ref={buttonRef}
            className={`${styles.ChatBtnBlue} ${isVoiceRecording ? styles.ChatBtnBlueActive : ''}`}
            onMouseDown={handleStart}
            onTouchStart={handleStart}
            onContextMenu={e => e.preventDefault()}>
            <IconMicrophone width={24} height={24} className="stroke-[#fff]" />
         </button>

         <ModalWrapper condition={error}>
            <Modal
               condition={Boolean(error)}
               set={setError}
               options={{ overlayClassNames: '_center-max-content', modalClassNames: 'mmd1:!w-[400px]', modalContentClassNames: '!pt-[50px]' }}>
               <div className="text-center">
                  <h2 className="title-3">{error.title}</h2>
                  <p className="mt-1">{error.descr}</p>
               </div>
            </Modal>
         </ModalWrapper>
      </>
   );
};

export default ChatVoiceRecorder;
