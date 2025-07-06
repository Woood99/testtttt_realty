import React from 'react';

import styles from './Avatar.module.scss';
import getSrcImage from '../../helpers/getSrcImage';
import cn from 'classnames';

export const getColorForLetter = letter => {
   if (!letter) return;
   letter = letter.toUpperCase();

   const hash = letter.charCodeAt(0);

   const r = (hash * 13) % 256;
   const g = (hash * 17) % 256;
   const b = (hash * 19) % 256;
   const alpha = 0.8;

   return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

const Avatar = props => {
   const { className = '', size = 40, src = '', title = '', textAvatar = '', online = false } = props;
   const gapOnlineBadge = size / 4 / 2 - 2;

   return (
      <div
         style={{ width: `${size}px`, height: `${size}px`, flex: `0 0 ${size}px` }}
         className={cn(styles.Avatar, src && 'border border-[#aecbda]', className)}>
         {online && <span className={styles.AvatarOnlineStatus} style={{ bottom: gapOnlineBadge, right: gapOnlineBadge }} />}
         {src ? <img loading="lazy" src={getSrcImage(src)} alt={title} /> : <AvatarBg {...props} />}
         {props.children}
      </div>
   );
};

export const AvatarBg = props => {
   const { title = '', textAvatar = '', size = 40 } = props;

   const firstLetterTitle = textAvatar ? textAvatar[0] : title[0];

   return (
      <div
         className={styles.AvatarBg}
         style={{ backgroundColor: getColorForLetter(firstLetterTitle), color: 'white', fontSize: `${size * (size < 80 ? 0.45 : 0.4)}px` }}>
         {firstLetterTitle}
      </div>
   );
};

export default Avatar;
