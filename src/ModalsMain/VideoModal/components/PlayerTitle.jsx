import React from 'react';
import { Link } from 'react-router-dom';
import cn from 'classnames';

import { RoutesPath } from '../../../constants/RoutesPath';
import { BlockDescrMore } from '../../../components/BlockDescr/BlockDescr';

const PlayerTitle = ({ title = '', className = '', classNameTitle = '', building_id, building_name, type = 'video' }) => {
   return (
      <div className={`absolute w-[78%] z-30 ${className}`}>
         {Boolean(building_id && building_name) && (
            <Link
               className={cn('blue-link-hover mb-1.5 font-medium text-defaultMax', type === 'short' && 'text-white')}
               to={`${RoutesPath.building}${building_id}`}>
               ЖК {building_name}
            </Link>
         )}
         <BlockDescrMore
            className={cn('text-default overflow-hidden cut cut-1 font-medium', type === 'short' && '!text-white', classNameTitle)}
            descr={title || 'Без названия'}
            lines={1}
            btnText="Ещё"
            classNameBtn={cn('!text-defaultMax !text-dark', type === 'short' && '!text-white')}
            btnIcon={false}
         />
      </div>
   );
};

export default PlayerTitle;
