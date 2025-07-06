import React, { useContext } from 'react';
import { DeveloperPageContext } from '../../../context';
import Avatar from '../../../ui/Avatar';
import { Link } from 'react-router-dom';
import { RoutesPath } from '../../../constants/RoutesPath';
import { getShortNameSurname } from '../../../helpers/changeString';

const DeveloperPageSidebar = () => {
   const { specialistsData } = useContext(DeveloperPageContext);

   return (
      <div className="white-block-small !p-5">
         <h3 className="title-4">
            Менеджеры отдела продаж
            <span className="ml-2 text-primary400 font-medium">{specialistsData.length}</span>
         </h3>
         {Boolean(specialistsData.length) &&    <div className="mt-4 grid grid-cols-4 gap-x-2 gap-y-4">
            {specialistsData.map(item => {
               return (
                  <Link to={`${RoutesPath.specialists.inner}${item.id}`} className="flex flex-col items-stretch" key={item.id}>
                     <Avatar src={item.image} className="mx-auto" size={64} />
                     <p className="mt-1 cut-one text-small">{getShortNameSurname(item.name, item.surname)}</p>
                  </Link>
               );
            })}
         </div>}
      
      </div>
   );
};

export default DeveloperPageSidebar;