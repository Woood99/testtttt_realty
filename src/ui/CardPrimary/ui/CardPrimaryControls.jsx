import { useContext } from 'react';
import { useSelector } from 'react-redux';

import { CardPrimaryContext } from '..';
import CardPrimaryAdminControls from '../CardPrimaryAdminControls';
import { Tooltip } from '../../Tooltip';
import { BtnAction, BtnActionFavorite } from '../../ActionBtns';
import { IconLocation } from '../../Icons';
import { isAdmin } from '../../../helpers/utils';
import { getUserInfo } from '@/redux';

const CardPrimaryControls = () => {
   const { customControls, title, id, geoVisible = true, setIsOpenModalLocation } = useContext(CardPrimaryContext);

   const userInfo = useSelector(getUserInfo);
   const userIsAdmin = isAdmin(userInfo);

   if (customControls) {
      return customControls;
   }

   if (userIsAdmin) {
      return (
         <CardPrimaryAdminControls options={{ title, id }}>
            {geoVisible && (
               <Tooltip
                  placement="bottom"
                  offset={[10, 5]}
                  ElementTarget={() => (
                     <BtnAction className="relative z-50" onClick={() => setIsOpenModalLocation(true)}>
                        <IconLocation width={14} height={14} className="pointer-events-none" />
                     </BtnAction>
                  )}>
                  Показать на карте
               </Tooltip>
            )}
         </CardPrimaryAdminControls>
      );
   }

   return (
      <>
         <BtnActionFavorite id={id} type="complex" variant="tooltip" placement="bottom" />
         {geoVisible && (
            <Tooltip
               placement="bottom"
               offset={[10, 5]}
               ElementTarget={() => (
                  <BtnAction className="relative z-50" onClick={() => setIsOpenModalLocation(true)}>
                     <IconLocation width={14} height={14} className="pointer-events-none" />
                  </BtnAction>
               )}>
               Показать на карте
            </Tooltip>
         )}
      </>
   );
};

export default CardPrimaryControls;
