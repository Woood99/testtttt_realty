import React, { useEffect, useState } from 'react';
import Button from '../../uiForm/Button';
import { Link } from 'react-router-dom';
import dayjs from 'dayjs';
import { capitalizedWord, capitalizeWords } from '../../helpers/changeString';
import { IconClock } from '../../ui/Icons';

import STICKER_CALENDAR_IMAGE from '../../assets/img/stickerCalendar.png';
import { sendPostRequest } from '../../api/requestsApi';
import UserInfo from '../../ui/UserInfo';
import CardSmall from '../../ui/CardSmall';
import ModalWrapper from '../../ui/Modal/ModalWrapper';
import RecordViewing from '../../ModalsMain/RecordViewing';

const BlockMyApp = ({ data, variant, onUpdate = null }) => {
   const [statusData, setStatusData] = useState({
      title: '',
      descr: '',
      icon: <span />,
   });
   const [isBeforeDate, setIsBeforeDate] = useState(false);
   const [isChangeModalRecord, setIsChangeModalRecord] = useState(false);

   const onHandlerDecline = () => {
      sendPostRequest(`/buyer-api/suggestion/${data.status_id}/decline`, {
         cause: 'Отменено покупателем',
         description: '',
      }).then(res => {
         if (onUpdate) {
            onUpdate();
         } else {
            window.location.reload();
         }
      });
   };

   const onHandlerChange = () => {
      setIsChangeModalRecord(true);
   };

   useEffect(() => {
      const [hours, minutes] = data.time.split(':');
      const currentDate = dayjs(data.date).hour(hours).minute(minutes);
      const isBefore = currentDate.isBefore(dayjs());
      if (variant === 'recordView') {
         setIsBeforeDate(isBefore);
         if (isBefore) {
            setStatusData({
               title: variant === 'recordView' ? 'Запись на просмотр' : 'Заказ звонка',
               descr: 'Прошедшая запись',
               icon: <IconClock width={14} height={14} className="fill-primary400" />,
            });
            return;
         }
      }

      if (!data.seller_confirmed) {
         setStatusData({
            title: variant === 'recordView' ? 'Запись на просмотр' : 'Заказ звонка',
            descr: 'Ждём подтверждения от продавца',
            icon: <IconClock width={14} height={14} className="fill-primary400" />,
         });
      } else {
         setStatusData({
            title: variant === 'recordView' ? 'Запись на просмотр' : 'Заказ звонка',
            descr: 'Подтверждено продавцом',
            icon: (
               <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 16" width={17} height={17} className="fill-green">
                  <path
                     fillRule="evenodd"
                     d="M8 15A7 7 0 1 0 8 1a7 7 0 0 0 0 14zm3.8-8.3a1 1 0 0 0-1.42-1.4L7.2 8.46a.28.28 0 0 1-.4 0l-1.1-1.1A1 1 0 0 0 4.3 8.8l2.08 2.09c.34.34.9.34 1.24 0L11.8 6.7z"></path>
               </svg>
            ),
         });
      }
   }, [data]);

   return (
      <>
         <div className="flex justify-between gap-4">
            <div>
               <h2 className="title-2 mb-2">{statusData.title}</h2>
               <p className="mb-3 title-4">{capitalizedWord(dayjs(`${data.date} ${data.time}`).format('dddd, D MMMM YYYY, HH:mm') || '')}</p>
               <p className="flex items-center gap-2 text-primary400">
                  {statusData.icon}
                  <span>{statusData.descr}</span>
               </p>
               <CardSmall data={data} className={`mt-6 ${isBeforeDate ? 'opacity-40' : ''}`} />
               {data.user && (
                  <UserInfo
                     avatar={data.user.avatar_url || data.user.image}
                     name={capitalizeWords(data.user.name, data.user.surname)}
                     pos={
                        <>
                           Отдел продаж &nbsp; <span className="text-dark font-medium">"{data.organization.name}"</span>
                        </>
                     }
                     centered
                     className="mt-6"
                  />
               )}
            </div>
            <div>
               <img src={STICKER_CALENDAR_IMAGE} width={100} height={100} />
            </div>
         </div>
         <div className="mt-6 flex items-center gap-4">
            {isBeforeDate ? (
               <Button variant="secondary" onClick={onHandlerChange}>
                  Записаться повторно
               </Button>
            ) : (
               <>
                  <Button variant="secondary" onClick={onHandlerDecline}>
                     Отменить запись
                  </Button>
                  <Link to="#" className="blue-link">
                     Смотреть все записи
                  </Link>
               </>
            )}
         </div>
         <ModalWrapper condition={isChangeModalRecord}>
            <RecordViewing
               condition={isChangeModalRecord}
               set={setIsChangeModalRecord}
               type={data.type}
               developName={data.organization.name}
               specialistsShow={false}
               title="Изменить дату просмотра"
               subtitle={`(${capitalizedWord(dayjs(`${data.date} ${data.time}`).format('dddd, D MMMM YYYY, HH:mm') || '')})`}
               customSubmit={newDate => {
                  sendPostRequest(`/buyer-api/suggestion/${data.status_id}/confirm`, newDate).then(res => {
                     setIsChangeModalRecord(false);
                     if (onUpdate) {
                        onUpdate();
                     } else {
                        window.location.reload();
                     }
                  });
               }}
            />
         </ModalWrapper>
      </>
   );
};

export default BlockMyApp;
