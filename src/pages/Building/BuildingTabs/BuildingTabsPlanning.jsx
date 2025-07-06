import React, { memo, useContext, useState } from 'react';
import { BuildingApartsContext } from '../../../context';
import Spinner from '../../../ui/Spinner';
import EmptyBlock from '../../../components/EmptyBlock';
import RoomInfoPlannings from '../RoomInfo/RoomInfoPlannings';

const BuildingTabsPlanning = memo(() => {
   const apartContext = useContext(BuildingApartsContext);

   const [activeRoomId, setActiveRoomId] = useState(null);

   const toggleLayout = currentRoom => {
      if (activeRoomId === currentRoom) {
         setActiveRoomId(null);
      } else {
         setActiveRoomId(currentRoom);
      }
   };

   return (
      <div className="flex flex-col gap-3">
         {apartContext.layoutsIsLoading ? (
            <Spinner className="mx-auto mt-8" />
         ) : (
            <>
               {apartContext.layouts ? (
                  <>
                     {apartContext.layouts.items.length > 0 ? (
                        apartContext.layouts.items.map((layout, index) => {
                           return (
                              <RoomInfoPlannings key={index} data={layout} activeRoomId={activeRoomId} onClick={() => toggleLayout(layout.room)} />
                           );
                        })
                     ) : (
                        <div className="mt-8 mb-4">
                           <EmptyBlock block={false} />
                        </div>
                     )}
                  </>
               ) : (
                  'Произошла ошибка, перезагрузите страницу'
               )}
            </>
         )}
      </div>
   );
});

export default BuildingTabsPlanning;
