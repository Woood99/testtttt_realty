import React from 'react';

import styles from './ChatVideoCall.module.scss';

const VideoCallBtn = ({ children, childrenText, onChange = () => {}, className = '' }) => {
   return (
      <button type="button" onClick={onChange} className="flex flex-col gap-2 items-center">
         <div className={`${styles.actionBtn} ${className}`}>{children}</div>
         <span className="text-white text-small leading-none">{childrenText}</span>
      </button>
   );
};

export default VideoCallBtn;