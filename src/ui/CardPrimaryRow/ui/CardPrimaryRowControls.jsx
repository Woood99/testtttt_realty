import { useContext } from 'react';
import { useSelector } from 'react-redux';

import { isAdmin } from '../../../helpers/utils';
import { getUserInfo } from '@/redux';
import CardPrimaryAdminControls from '../../CardPrimary/CardPrimaryAdminControls';
import { CardPrimaryRowContext } from '..';
import { BtnAction, BtnActionComparison, BtnActionFavorite } from '../../ActionBtns';
import { IconLocation } from '../../Icons';
import { Tooltip } from '../../Tooltip';

const CardPrimaryRowControls = () => {
   const { isBlockCard, setIsBlockCard, title, id, setIsOpenModalLocation } = useContext(CardPrimaryRowContext);

   const userInfo = useSelector(getUserInfo);
   const userIsAdmin = isAdmin(userInfo);

   return (
      <div className="ml-auto flex flex-col gap-2">
         {userIsAdmin ? (
            <CardPrimaryAdminControls options={{ isBlockCard, setIsBlockCard, title, id }}>
               <Tooltip
                  placement="left"
                  offset={[10, 5]}
                  ElementTarget={() => (
                     <BtnAction className="relative z-50" onClick={() => setIsOpenModalLocation(true)}>
                        <IconLocation width={15} height={15} className="pointer-events-none" />
                     </BtnAction>
                  )}>
                  Показать на карте
               </Tooltip>
            </CardPrimaryAdminControls>
         ) : (
            <>
               <BtnActionFavorite id={id} type="complex" variant="tooltip" placement="left" />
               <Tooltip
                  placement="left"
                  offset={[10, 5]}
                  ElementTarget={() => (
                     <BtnAction className="relative z-50" onClick={() => setIsOpenModalLocation(true)}>
                        <IconLocation width={15} height={15} className="pointer-events-none" />
                     </BtnAction>
                  )}>
                  Показать на карте
               </Tooltip>
            </>
         )}
      </div>
   );
};

export default CardPrimaryRowControls;
