import React from 'react';
import cn from 'classnames';

import styles from './ChatVideoCall.module.scss';

const VideoCallBtn = ({ children, childrenText, onChange = () => {}, className = '', isLoading = false }) => {
   return (
      <button type="button" onClick={onChange} className={cn('flex flex-col gap-2 items-center', isLoading && 'pointer-events-none opacity-50')}>
         <div className={cn(styles.actionBtn, className)}>{children}</div>
         <span className="text-white text-small leading-none font-medium">{childrenText}</span>
      </button>
   );
};

export default VideoCallBtn;
