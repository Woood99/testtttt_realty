import { useContext } from 'react';
import { CardSecondContext } from '..';
import { isAdmin } from '../../../helpers/utils';
import { useSelector } from 'react-redux';
import { getUserInfo } from '../../../redux/helpers/selectors';
import CardSecondaryAdminControls from '../CardSecondaryAdminControls';
import { Tooltip } from '../../Tooltip';
import { BtnAction, BtnActionFavorite } from '../../ActionBtns';
import { IconLocation } from '../../Icons';

const CardSecondControls = () => {
   const userInfo = useSelector(getUserInfo);
   const userIsAdmin = isAdmin(userInfo);

   const { customControls, title, id, geoVisible = true, setIsOpenModalLocation } = useContext(CardSecondContext);

   if (customControls) {
      return customControls;
   }

   if (userIsAdmin) {
      return (
         <CardSecondaryAdminControls options={{ title, id }}>
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
         </CardSecondaryAdminControls>
      );
   }

   return (
      <>
         <BtnActionFavorite id={id} type="apartment" variant="tooltip" placement="bottom" />
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

export default CardSecondControls;
