import React, { useContext } from 'react';
import { useSelector } from 'react-redux';
import cn from 'classnames';

import styles from '../Chat.module.scss';
import ModalWrapper from '../../../ui/Modal/ModalWrapper';
import Modal from '../../../ui/Modal';
import { IconMicrophone } from '../../../ui/Icons';
import { ChatContext, ChatVoiceRecorderContext } from '../../../context';
import { formatTimeRecorder } from '../helpers';
import { getIsDesktop } from '@/redux';

export const ChatVoiceRecorderButton = () => {
   const { isVoiceRecording } = useContext(ChatContext);
   const { buttonRef, handleStart } = useContext(ChatVoiceRecorderContext);

   const isDesktop = useSelector(getIsDesktop);

   return (
      <button
         ref={buttonRef}
         className={cn(
            isDesktop && styles.ChatBtnBlue,
            isVoiceRecording && styles.ChatBtnBlueActive,
            !isDesktop && 'ml-4 transition-all',
            isVoiceRecording && !isDesktop && `scale-[1.45]`
         )}
         onMouseDown={handleStart}
         onTouchStart={handleStart}
         onContextMenu={e => e.preventDefault()}>
         <IconMicrophone
            width={24}
            height={24}
            className={cn('stroke-[#fff] md1:stroke-primary400', isVoiceRecording && !isDesktop && `!stroke-blue`)}
         />
      </button>
   );
};

export const ChatVoiceRecorderContent = () => {
   const { isVoiceRecording } = useContext(ChatContext);
   const { time } = useContext(ChatVoiceRecorderContext);

   if (!isVoiceRecording) return;

   return (
      <div className="h-9 md1:h-[28px] flex items-center justify-between w-full">
         <div className="flex items-center gap-2 basis-[80px] flex-shrink-0">
            <div className={styles.ChatBlinkCircle} />
            {formatTimeRecorder(time)}
         </div>
         <p className="text-primary400 text-center">Для отмены отпустите курсор вне поля</p>
         <div />
      </div>
   );
};

const ChatVoiceRecorder = () => {
   const { error, setError } = useContext(ChatVoiceRecorderContext);

   return (
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
   );
};

export default ChatVoiceRecorder;
