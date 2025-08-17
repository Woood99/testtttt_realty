import React from 'react';
import UserInfo from '../../../ui/UserInfo';
import { capitalizeWords } from '../../../helpers/changeString';
import { RoutesPath } from '../../../constants/RoutesPath';
import { ROLE_ADMIN } from '../../../constants/roles';
import cn from 'classnames';

const PlayerAuthor = ({ player, data, className = '', type = 'video' }) => {
   if (!player) return;
   const currentUser = data.author?.role === ROLE_ADMIN.id ? data.developer : data.author;
   if (!currentUser) return;

   return (
      <div className={cn('absolute flex items-center gap-4', className)}>
         <UserInfo
            avatar={currentUser.avatar_url || currentUser.image}
            name={capitalizeWords(currentUser.name, currentUser.surname)}
            pos={`${data.author && data.author.role !== ROLE_ADMIN.id ? `Менеджер отдела продаж ${data.developer.name}` : 'Застройщик'}`}
            classListUser={cn(type === 'short' && '!text-white')}
            className={cn('text-default', type === 'short' && '!text-white w-full')}
            classListName={cn(type === 'short' && '!text-white')}
            centered
            nameHref={`${data.author && data.author.role !== ROLE_ADMIN.id ? `${RoutesPath.specialists.inner}` : `${RoutesPath.developers.inner}`}${
               currentUser.id
            }`}
         />
      </div>
   );
};

export default PlayerAuthor;
