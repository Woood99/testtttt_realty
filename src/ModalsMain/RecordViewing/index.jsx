import React, { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import dayjs from 'dayjs';

import Modal from '../../ui/Modal';
import Button from '../../uiForm/Button';
import { ControllerFieldInput } from '../../uiForm/ControllerFields/ControllerFieldInput';
import SpecialistsSliderToggle from '../../components/SpecialistsSliderToggle';
import { timesOptions } from '../../data/selectsField';
import { sendPostRequest } from '../../api/requestsApi';
import CardSmall from '../../ui/CardSmall';
import { CardRowPurchaseSelect } from '../../ui/CardsRow';
import convertToDate from '../../helpers/convertToDate';
import isEmptyArrObj from '../../helpers/isEmptyArrObj';
import { getCitiesSelector } from '../../redux/helpers/selectors';
import CheckboxToggle from '../../uiForm/CheckboxToggle';
import { ControllerFieldCheckbox } from '../../uiForm/ControllerFields/ControllerFieldCheckbox';

function filterTimesRelativeToDate(timeList, dateStr) {
   if (!dateStr) {
      return [];
   }

   const [day, month, year] = dateStr.split('.');
   const inputDate = new Date(year, month - 1, day);

   const now = new Date();

   if (now.getFullYear() !== inputDate.getFullYear() || now.getMonth() !== inputDate.getMonth() || now.getDate() !== inputDate.getDate()) {
      return timeList;
   }

   const currentTime = now.toTimeString().slice(0, 5);
   return timeList.filter(time => time >= currentTime);
}

const RecordViewing = ({
   condition,
   set,
   type,
   id,
   specialistsShow = true,
   specialists = [],
   developName,
   customSubmit = null,
   title = 'Записаться на просмотр',
   subtitle = '',
   onUpdate = null,
   objectData = {},
   editData = null,
   orderId = null,
}) => {
   const cities = useSelector(getCitiesSelector);
   const currentCityId = cities.find(el => el.name === objectData.city)?.id || 1;
   const [videoCommunication, setVideoCommunication] = useState(false);

   const [orders, setOrders] = useState([]);

   useEffect(() => {
      if (!currentCityId) return;
      if (editData || orderId) return;
      sendPostRequest('/buyer-api/purchase-orders/get-by-data', { city_id: currentCityId }).then(res => {
         setOrders(res.data.orders);
      });
   }, []);

   const {
      formState: { errors },
      handleSubmit,
      control,
      watch,
      setValue,
   } = useForm();

   const isSpecialistValue = watch('isSpecialist');
   const dateWatch = watch('date');

   const onSubmitHandler = data => {
      const params = {
         city_id: currentCityId,
         property_type: type,
         property_id: id,

         date: dayjs(convertToDate(data.date, 'DD-MM-YYYY'), 'DD.MM.YYYY').format('YYYY-MM-DD'),
         time: data.time,
         specialist: data.specialist,
         order_id: orderId || data.order_id,
         video_communication: videoCommunication,
      };

      if (customSubmit) {
         customSubmit(params);
         return;
      }

      sendPostRequest('/buyer-api/suggestions/create', params).then(() => {
         sendPostRequest('/api/metric', {
            type: 'application',
            metricable_type: type === 'building' ? 'App\\Models\\Building' : 'App\\Models\\Apartment',
            metricable_id: id,
         }).then(() => {
            if (onUpdate) {
               onUpdate();
            } else {
               window.location.reload();
            }
         });
      });
   };

   return (
      <Modal options={{ overlayClassNames: '_center-max-content', modalClassNames: 'mmd1:!w-[800px]' }} set={set} condition={condition}>
         <form onSubmit={handleSubmit(onSubmitHandler)} className="flex flex-col">
            <h2 className="title-2 mb-6">
               {title}
               {Boolean(subtitle) && <span className="ml-2 title-4 !text-primary400">{subtitle}</span>}
            </h2>
            {objectData && !isEmptyArrObj(objectData) && <CardSmall className="mb-6 w-max" data={{ ...objectData, type }} />}
            <div
               className="bg-pageColor rounded-xl mb-4 flex justify-between items-center p-3 cursor-pointer"
               onClick={() => setVideoCommunication(prev => !prev)}>
               <div className="flex items-center gap-3">
                  <img
                     src="https://40.img.avito.st/image/1/1.XVBE57a1KyHzRnO5ckZzbUn8XbnyRPe_9EY7ug.-Qg4y8r0GbBP11mk7PdD85zlSk6uB03-Qb7FtNF2cVo"
                     width={48}
                     height={48}
                  />
                  <div>
                     <h3 className="title-3">Онлайн-показ</h3>
                     <p>Посмотрите по видеосвязи</p>
                  </div>
               </div>
               <CheckboxToggle checked={videoCommunication} className="pointer-events-none" />
            </div>
            <p className="bg-primary700 p-4 rounded-xl">Выберите удобное время и дождитесь подтверждения от застройщика {developName}</p>
            <div className="grid grid-cols-2 gap-2 mt-4 md3:grid-cols-1">
               <ControllerFieldInput
                  control={control}
                  datePicker
                  minDate={new Date()}
                  maxDate={new Date(new Date().getTime() + 12 * 24 * 60 * 60 * 1000)}
                  beforeText="Дата"
                  name="date"
                  requiredValue
                  errors={errors}
                  defaultValue={editData ? editData.date : ''}
               />

               <ControllerFieldInput
                  control={control}
                  mask="hhmmMask"
                  selectionButtons={{
                     options: filterTimesRelativeToDate(
                        timesOptions.map(item => item.value),
                        dateWatch
                     ),
                     className: 'grid grid-cols-4 gap-2',
                     required: true,
                     emptyText: dateWatch ? 'Нету доступного времени, выберите другой день' : 'Выберите день',
                  }}
                  beforeText="Время"
                  name="time"
                  requiredValue
                  errors={errors}
                  defaultValue={editData ? editData.time : ''}
                  disabled={
                     !filterTimesRelativeToDate(
                        timesOptions.map(item => item.value),
                        dateWatch
                     ).length
                  }
               />
            </div>
            {!isSpecialistValue && <Button className="w-full mt-8">Отправить</Button>}
            {specialistsShow && (
               <SpecialistsSliderToggle specialists={specialists} options={{ setValue, control, developName, isSpecialistValue, errors }} />
            )}

            {isSpecialistValue && <Button className="w-full mt-8">Отправить</Button>}

            {Boolean(orders.length) && (
               <div className="mt-6">
                  <h3 className="title-3 mb-3">Выберите подходящую заявку</h3>
                  <div className="flex flex-col gap-4">
                     {orders.map(item => {
                        return (
                           <Controller
                              name="order_id"
                              control={control}
                              key={item.id}
                              defaultValue={orders[0].id}
                              render={({ field }) => {
                                 return (
                                    <div onClick={() => field.onChange(item.id)} className="cursor-pointer h-full" key={item.id}>
                                       <CardRowPurchaseSelect
                                          value={field.value === item.id}
                                          bg={false}
                                          data={{ ...item, current_type: 'Новостройка' }}
                                          key={item.id}
                                          userVisible={false}
                                          className="bg-primary600 !h-12 !min-h-12 px-4 rounded-lg"
                                          href={false}
                                       />
                                    </div>
                                 );
                              }}
                           />
                        );
                     })}
                  </div>
               </div>
            )}
         </form>
      </Modal>
   );
};

export default RecordViewing;
