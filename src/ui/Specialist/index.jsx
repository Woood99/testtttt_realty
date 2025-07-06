import React from 'react';
import cn from 'classnames';

import styles from './Specialist.module.scss';
import { IconChat, IconChecked } from '../Icons';
import { RoutesPath } from '../../constants/RoutesPath';
import getSrcImage from '../../helpers/getSrcImage';
import { AvatarBg } from '../Avatar';

const Specialist = ({
   id,
   avatar,
   image,
   name,
   active,
   error,
   className = '',
   link = false,
   visibleChat = false,
   onClickChat = () => {},
   onClick = () => {},
   size = 64,
}) => {
   return (
      <article
         className={cn(styles.SpecialistRoot, active && styles.SpecialistRootActive, error && styles.SpecialistRootError, className)}
         onClick={onClick}>
         {link ? <a href={`${RoutesPath.specialists.inner}${id}`} className="CardLinkElement z-20" target="_blank" rel="noopener noreferrer" /> : ''}
         <div className={styles.SpecialistCheck} aria-hidden>
            <IconChecked />
         </div>
         <div className="flex items-center gap-4">
            <div style={{ width: size, height: size }} className={styles.SpecialistWrapper}>
               {avatar || image ? (
                  <div className={styles.SpecialistImage}>
                     <img src={getSrcImage(avatar || image)} className="w-full h-full aspect-square" />
                  </div>
               ) : (
                  <AvatarBg title={name} size={80} />
               )}
            </div>
            <div className="min-w-0">
               <h3 className={cn(styles.SpecialistName, 'cut-one')}>{name}</h3>
               {Boolean(visibleChat) && (
                  <button className="blue-link relative z-30 md1:mt-4 flex gap-2 text-small mt-3" size="Small" onClick={onClickChat}>
                     <IconChat width={16} height={16} className="fill-blue" />
                     Перейти в чат
                  </button>
               )}
            </div>
         </div>
      </article>
   );
};

export default Specialist;
