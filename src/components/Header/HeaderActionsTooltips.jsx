import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import { HeaderContext } from '../../context';

import styles from './Header.module.scss';
import { Tooltip } from '../../ui/Tooltip';
import { getDataRequest } from '../../api/requestsApi';
import ModalWrapper from '../../ui/Modal/ModalWrapper';
import NotificationsModal from '../../ModalsMain/NotificationsModal';
import convertFieldsJSON from '../../helpers/convertFieldsJSON';
import { IconChat, IconComparison, IconFavorite, IconNotif } from '../../ui/Icons';
import { RoutesPath } from '../../constants/RoutesPath';
import isEmptyArrObj from '../../helpers/isEmptyArrObj';

const HeaderActionsTooltips = () => {
   const { isDesktop, userInfo } = useContext(HeaderContext);

   const [notifData, setNotifData] = useState([]);
   const [popupNotifOpen, setPopupNotifOpen] = useState(false);

   useEffect(() => {
      if (isEmptyArrObj(userInfo)) return;
      getDataRequest('/api/notifications/new').then(res => {
         const newData = res.data.map(item => ({
            id: item.id,
            updated_at: item.updated_at,
            notificationable_type: item.notificationable_type,
            type:
               item.notificationable_type === 'App\\Models\\Building'
                  ? 'building'
                  : item.notificationable_type === 'App\\Models\\Apartment'
                  ? 'apartment'
                  : '',
            discount: item.discount
               ? {
                    id: item.discount.id,
                    property_type: item.discount.discountable_type === 'App\\Models\\Building' ? 'complex' : 'apartment',
                    type: item.discount.is_absolute ? 'price' : item.discount.is_special_condition ? 'special-condition' : 'prc',
                    object_id: item.discount.discountable_id,
                    valid_till: item.discount.valid_till,
                    discount: item.discount.discount,
                    author: item.discount.author,
                    special_condition: item.notificationable.special_conditions
                       ? Object.values(JSON.parse(res.data[0].notificationable.special_conditions))[0]
                       : null,
                 }
               : null,
            info: convertFieldsJSON(item.notificationable),
            title: item.title,
            description: item.description,
         }));

         setNotifData(newData);
      });
   }, [userInfo]);

   const actionsTooltipsData = [
      isDesktop
         ? {
              textTooltip: 'Чат',
              mobileVisible: true,
              body: (
                 <a href={RoutesPath.chat} className={`${styles.headerAction} relative`}>
                    {Boolean(userInfo.counts?.dialogs) && <div className={styles.notifCount}>{userInfo.counts.dialogs}</div>}
                    <IconChat width={16} height={16} />
                 </a>
              ),
           }
         : {},
      {
         textTooltip: 'Уведомления',
         mobileVisible: true,
         body: (
            <button className={`${styles.headerAction} relative`} onClick={() => setPopupNotifOpen(true)}>
               {Boolean(userInfo.counts?.notifications) && <div className={styles.notifCount}>{userInfo.counts.notifications}</div>}
               <IconNotif width={16} height={16} />
            </button>
         ),
      },
      {
         mobileVisible: true,
         textTooltip: 'Избранное',
         body: (
            <Link to={RoutesPath.favorites} className={`${styles.headerAction}`}>
               <IconFavorite width={16} height={16} />
            </Link>
         ),
      },
      // {
      //    mobileVisible: false,
      //    textTooltip: 'Сравнение',
      //    body: (
      //       <Link to={RoutesPath.comparison} className={`${styles.headerAction}`}>
      //          <IconComparison width={16} height={16} />
      //       </Link>
      //    ),
      // },
      // {
      //    mobileVisible: false,
      //    textTooltip: 'Календарь',
      //    body: (
      //       <a href="#" className={`${styles.headerAction}`}>
      //          <IconCalendar width={14} height={14} />
      //       </a>
      //    ),
      // },
   ];

   return (
      <>
         {actionsTooltipsData.map((item, index) => {
            if (!item.mobileVisible && !isDesktop) return;
            return (
               <Tooltip key={index} color="dark" ElementTarget={() => item.body} classNameTarget="w-full h-full" placement="bottom">
                  {item.textTooltip}
               </Tooltip>
            );
         })}
         <ModalWrapper condition={popupNotifOpen} set={setPopupNotifOpen}>
            <NotificationsModal condition={popupNotifOpen} set={setPopupNotifOpen} data={notifData} />
         </ModalWrapper>
      </>
   );
};

export default HeaderActionsTooltips;
