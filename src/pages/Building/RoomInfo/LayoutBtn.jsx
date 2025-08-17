import React, { memo } from 'react';
import { useSelector } from 'react-redux';

import styles from './RoomInfo.module.scss';
import numberReplace from '../../../helpers/numberReplace';
import { IconArrowY } from '../../../ui/Icons';
import Tag from '../../../ui/Tag';
import { getIsDesktop } from '@/redux';
import { declensionApartments, declensionPlannings } from '../../../helpers/declensionWords';

const LayoutBtn = memo(({ onClick, data, planning = true, active }) => {
   const isDesktop = useSelector(getIsDesktop);

   return (
      <div className={`${styles.RoomInfoRoot} ${active ? styles.RoomInfoActiveRoot : ''}`} data-layout-btn>
         <div className="CardLinkElement z-50" onClick={onClick} />
         <div className="flex items-center gap-4 justify-between md1:flex-col md1:items-start">
            <div className="flex items-center gap-4 md1:flex-col md1:items-start md1:gap-2">
               <div className="md1:flex items-center gap-3 title-3 whitespace-nowrap">
                  <span>{data.room === 0 ? 'Студии' : `${data.room}-${isDesktop ? 'комнатные' : 'комн.'}`}</span>
                  {!isDesktop && <span>от {data.minArea} м²</span>}
               </div>
               {isDesktop && <div>от {data.minArea} м²</div>}
               <div className="title-3">от {numberReplace(data.minBdPrice || data.minPrice)} ₽</div>
            </div>
         </div>

         <Tag size="small" color="blue" className="ml-auto">
            <div className={styles.RoomInfoAttr}>
               {Boolean(planning && isDesktop) && <span>{declensionPlannings(data.totalLayout)}</span>}
               <span>{declensionApartments(data.totalApartment)}</span>
            </div>
         </Tag>

         <IconArrowY width={25} height={25} className={`fill-black ${styles.RoomInfoIcon}`} />
      </div>
   );
});

export default LayoutBtn;
