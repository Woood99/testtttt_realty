import React, { useState } from 'react';
import Modal from '../../ui/Modal';
import dayjs from 'dayjs';
import { Link } from 'react-router-dom';
import { PrivateRoutesPath, RoutesPath } from '../../constants/RoutesPath';
import { sendPostRequest } from '../../api/requestsApi';
import BlockPersonalDiscount from '../../components/BlockPersonalDiscount';
import { ExternalLink } from '../../ui/ExternalLink';

const NotificationsModal = ({ condition, set, data = [] }) => {
   const [reads, setReads] = useState([]);

   const notificationRead = id => {
      if (!reads.includes(id)) {
         setReads(prev => [...prev, id]);
         sendPostRequest(`/api/notification/read/${id}`);
      }
   };

   return (
      <Modal options={{ overlayClassNames: '_right', modalClassNames: '!max-w-[650px]' }} set={set} condition={condition}>
         <h2 className="title-2 modal-title-gap">Уведомления</h2>
         {data.length === 0 ? (
            <p className="text-primary400">Новых уведомлений нет</p>
         ) : (
            <div className="flex flex-col">
               {data.map(item => {
                  const info = item.info;
                  const is_building_discount = item.notificationable_type === 'App\\Models\\BuildingDiscount';
                  const is_building_cashback = item.notificationable_type === 'App\\Models\\BuildingCashback';
                  const is_other = !is_building_discount && !is_building_cashback;

                  const is_building = item.notificationable_type === 'App\\Models\\Building' || is_building_discount || is_building_cashback;

                  return (
                     <article
                        // onMouseEnter={() => notificationRead(item.id)}
                        key={item.id}
                        className="relative mb-6 pb-6 border-bottom-primary100 [&:last-child]:!mb-0 [&:last-child]:!pb-0 [&:last-child]:!border-none">
                        <Link
                           to={is_building ? `${RoutesPath.building}${item.info.id}` : `${RoutesPath.apartment}${item.info.id}`}
                           className="CardLinkElement"
                        />
                        <p className="text-verySmall mb-1 font-medium">{dayjs(item.updated_at).format('DD.MM.YYYY')}</p>
                        {is_building_discount && (
                           <>
                              <h3 className="title-4 mb-3">{item.title}</h3>
                              <p className="mb-1">Дата начала: {dayjs(info.start_date).format('DD.MM.YYYY')}</p>
                              <p>Дата окончания: {dayjs(info.end_date).format('DD.MM.YYYY')}</p>
                              <ExternalLink to={`${PrivateRoutesPath.objects.edit}${info.building_id}`} className="mt-3 blue-link">
                                 Перейти в ЖК
                              </ExternalLink>
                           </>
                        )}
                        {is_building_cashback && (
                           <>
                              <h3 className="title-4 mb-3">{item.title}</h3>
                              <p className="mb-1">Дата начала: {dayjs(info.start_date).format('DD.MM.YYYY')}</p>
                              <p>Дата окончания: {dayjs(info.end_date).format('DD.MM.YYYY')}</p>
                              <ExternalLink to={`${PrivateRoutesPath.objects.edit}${info.building_id}`} className="mt-3 blue-link">
                                 Перейти в ЖК
                              </ExternalLink>
                           </>
                        )}
                        {is_other && (
                           <>
                              <h3 className="title-4 mb-2">{item.title}</h3>
                              <p>{item.description}</p>
                           </>
                        )}
                     </article>
                  );
               })}
            </div>
         )}
      </Modal>
   );
};

export default NotificationsModal;
