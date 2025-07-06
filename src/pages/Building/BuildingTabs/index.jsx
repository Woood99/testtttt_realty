import React, { useContext } from 'react';
import Tabs from '../../../ui/Tabs';
import BuildingTabsApartments from './BuildingTabsApartments';
import BuildingTabsPlanning from './BuildingTabsPlanning';
import { BuildingApartsContext } from '../../../context';
import { ROLE_ADMIN } from '../../../constants/roles';

const BuildingTabs = () => {
   const { userRole } = useContext(BuildingApartsContext);

   const dataTabs = [
      {
         name: 'Планировки',
         body: <BuildingTabsPlanning />,
      },
      {
         name: 'Квартиры',
         body: <BuildingTabsApartments />,
      },
   ];

   if (userRole === ROLE_ADMIN.name) {
      return (
         <div className="mt-6">
            <BuildingTabsApartments />
         </div>
      );
   } else {
      return <Tabs data={dataTabs} navClassName="md1:mx-4" />;
   }
};

export default BuildingTabs;
