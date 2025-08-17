import React, { useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import dayjs from 'dayjs';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';

import '../../styles/components/calendar-block.scss';
import ModalWrapper from '../../ui/Modal/ModalWrapper';
import Modal from '../../ui/Modal';
import CardSmall from '../../ui/CardSmall';
import UserInfo from '../../ui/UserInfo';
import { getIsDesktop, getUserInfo } from '@/redux';

const CalendarBlock = ({ data }) => {
   const calendarRef = useRef(null);
   const [currentData, setCurrentData] = useState(false);
   const userInfo = useSelector(getUserInfo);
   const isDesktop = useSelector(getIsDesktop);

   const handlePrev = () => {
      const calendarApi = calendarRef.current.getApi();
      calendarApi.prev();
   };

   const handleNext = () => {
      const calendarApi = calendarRef.current.getApi();
      calendarApi.next();
   };

   const renderEventContent = eventInfo => {
      if (isDesktop) {
         return (
            <div className="max-w-[135px] pointer-events-none cursor-default">
               <p className="text-verySmall font-medium">{eventInfo.timeText}</p>
               <p className="text-verySmall mt-1 whitespace-nowrap text-ellipsis overflow-hidden">{eventInfo.event.extendedProps.name}</p>
            </div>
         );
      } else {
         return <></>;
      }
   };

   const handleEventClick = info => {
      const data = {
         ...info.event.extendedProps,
         title: info.event.title,
         date: info.event.startStr,
         name: info.event.extendedProps.name,
         id: info.event.extendedProps.current_id,
      };
      setCurrentData(data);
   };

   const renderFields = currentData => {
      if (!currentData) return;
      const data = [
         {
            label: 'Название',
            value: currentData.title,
         },
         {
            label: 'Время и дата',
            value: dayjs(currentData.date).format('DD.MM.YYYY, HH:mm'),
         },
         {
            label: 'Объект и адрес',
            value: (
               <CardSmall
                  data={{
                     ...currentData,
                     title: currentData.name,
                  }}
               />
            ),
         },
         {
            label: 'Участники',
            value: (
               <div className="flex items-center gap-x-8 gap-y-4 flex-wrap">
                  {Boolean(userInfo) && <UserInfo avatar={userInfo.avatar_url} name="Вы" textAvatar={userInfo.name} sizeAvatar={34} centered />}
                  {Boolean(currentData.user) && (
                     <UserInfo avatar={currentData.user.avatar_url} name={currentData.user.name} sizeAvatar={34} centered />
                  )}
               </div>
            ),
         },
      ];

      return (
         <ul className="flex flex-col gap-6">
            {data.map((item, index) => (
               <li className="flex gap-4 md3:flex-col md3:gap-2" key={index}>
                  <p className="font-medium w-[150px]">{item.label}</p>
                  <div>{item.value}</div>
               </li>
            ))}
         </ul>
      );
   };

   return (
      <div className="calendar-block">
         <FullCalendar
            ref={calendarRef}
            plugins={[dayGridPlugin]}
            initialView="dayGridMonth"
            events={data}
            locale="ru"
            dayMaxEvents={1}
            firstDay={1}
            fixedWeekCount={false}
            eventContent={renderEventContent}
            eventClick={handleEventClick}
            selectable={false}
            editable={false}
            moreLinkContent={obj => <div>+ ещё {obj.num}</div>}
            headerToolbar={{
               center: 'title',
               right: 'customNext',
               left: 'customPrev',
            }}
            customButtons={{
               customPrev: {
                  text: 'Предыдущий месяц',
                  icon: 'chevron-left',
                  click: handlePrev,
               },
               customNext: {
                  text: 'Следующий месяц',
                  icon: 'chevron-right',
                  click: handleNext,
               },
            }}
            eventTimeFormat={{
               hour: '2-digit',
               minute: '2-digit',
               omitZeroMinute: false,
            }}
         />
         <ModalWrapper condition={currentData}>
            <Modal
               condition={currentData}
               set={setCurrentData}
               options={{
                  overlayClassNames: '_right',
                  modalClassNames: 'mmd1:!max-w-[700px]',
                  modalContentClassNames: 'bg-pageColor !px-8 md1:!px-4',
               }}>
               <div className="white-block">{renderFields(currentData)}</div>
            </Modal>
         </ModalWrapper>
      </div>
   );
};

export default CalendarBlock;
