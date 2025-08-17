import React from 'react';

import Avatar from '../Avatar';

import styles from './UserInfo.module.scss';
import { Link } from 'react-router-dom';
import cn from 'classnames';

const UserInfo = ({
   avatar = '',
   textAvatar = '',
   name,
   pos,
   posChildren,
   beforeChildren,
   posBeforeChildren,
   children,
   className = '',
   classNameContent = '',
   classNameWrapper = '',
   sizeAvatar = 40,
   centered,
   classListName = '',
   nameHref = '',
   classListUser = '',
   online = false,
   onClick,
}) => {
   return (
      <div className={cn(styles.userInfo, className)} onClick={onClick}>
         <Avatar src={avatar} title={name} textAvatar={textAvatar} size={sizeAvatar} online={online} />
         <div className={`flex flex-col overflow-hidden ${classNameContent}`}>
            <div
               className={cn('h-full flex flex-col overflow-hidden', !pos && 'justify-center', centered && 'justify-center', classNameWrapper)}
               style={{ minHeight: sizeAvatar }}>
               {Boolean(beforeChildren) && beforeChildren}
               {nameHref ? (
                  <Link to={nameHref} className={`${styles.userInfoName} ${classListName} blue-link-hover`}>
                     {name}
                  </Link>
               ) : (
                  <span className={`${styles.userInfoName} ${classListName}`}>{name}</span>
               )}
               {Boolean(posBeforeChildren) && posBeforeChildren}
               {pos && <span className={`${styles.userInfoPos} ${classListUser}`}>{pos}</span>}
               {Boolean(posChildren) && posChildren}
            </div>
            {children}
         </div>
      </div>
   );
};

export default UserInfo;
