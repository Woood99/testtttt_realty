import React, { memo } from 'react';
import styles from './RoomInfo.module.scss';
import numberReplace from '../../../helpers/numberReplace';
import { IconArrowY } from '../../../ui/Icons';
import { useSelector } from 'react-redux';
import presentImg from '../../../assets/img/present.png';
import cashbackImg from '../../../assets/img/dollar-cashback.png';
import Tag from '../../../ui/Tag';
import { getIsDesktop } from '../../../redux/helpers/selectors';
import { getMaxCashback } from '../../../helpers/cashbackUtils';

const LayoutBtn = memo(({ onClick, data, planning = true, active }) => {
   const isDesktop = useSelector(getIsDesktop);

   const max_building_cashback = getMaxCashback(data.buildingCashbacks);

   const max_price = data.max_bd_price || data.max_price;
   const cashbackPrc = (data.cashback || 0) + (max_building_cashback.value || 0);
   const cashbackValue = (max_price / 100) * cashbackPrc;

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
         {isDesktop && (
            <div className="flex gap-6 md1:flex-col md1:gap-4 md1:items-start relative">
               {Boolean(data.cashback) && (
                  <div className="flex items-center gap-2 w-max font-medium leading-none">
                     <img src={cashbackImg} width={22} height={22} alt="Кешбэк" className="mb-0.5" />
                     Кешбэк до {numberReplace(cashbackValue)} ₽
                  </div>
               )}
               {Boolean(data.main_gifts.length || data.haveGift) && (
                  <div className="flex items-center gap-2 w-max font-medium leading-none">
                     <img src={presentImg} width={15} height={15} alt="Подарок" className="mb-0.5" />
                     Есть подарок
                  </div>
               )}
            </div>
         )}

         <Tag size="small" color="blue">
            <div className={styles.RoomInfoAttr}>
               {Boolean(planning && isDesktop) && <span>{data.totalLayout} планировок</span>}
               <span>{data.totalApartment} квартир</span>
            </div>
         </Tag>

         <IconArrowY width={25} height={25} className={`fill-black ${styles.RoomInfoIcon}`} />
      </div>
   );
});

export default LayoutBtn;
