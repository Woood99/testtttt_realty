import React, { useEffect } from 'react';

import styles from './AppConsultationModal.module.scss';
import Modal from '../../ui/Modal';
import { useForm } from 'react-hook-form';
import Button from '../../uiForm/Button';
import { ControllerFieldInput, ControllerFieldInputPhone } from '../../uiForm/ControllerFields/ControllerFieldInput';
import { ControllerFieldSelect } from '../../uiForm/ControllerFields/ControllerFieldSelect';
import recordViewPost from '../../api/recordViewPost';
import { useSelector } from 'react-redux';
import SpecialistsSliderToggle from '../../components/SpecialistsSliderToggle';
import dayjs from 'dayjs';
import BlockMyApp from '../../components/BlockMyApp';
import { timesOptions } from '../../data/selectsField';
import { sendPostRequest } from '../../api/requestsApi';
import { getUserInfo } from '../../redux/helpers/selectors';

const AppConsultationModal = ({
   condition,
   set,
   developName = '',
   specialistsShow = true,
   type,
   id,
   specialists = [],
   myApp = null,
   specialistDefault = null,
   onUpdate = null,
}) => {
   const userInfo = useSelector(getUserInfo);
   const {
      formState: { errors },
      handleSubmit,
      control,
      watch,
      setValue,
      reset,
   } = useForm();

   const isSpecialistValue = watch('isSpecialist');

   const formOptions = {
      errors,
      control,
   };

   const onSubmitHandler = data => {
      const resData = {
         date: dayjs().format('YYYY-MM-DD'),
         time: data.time.value === 'now' ? `${dayjs().format('HH:mm')}` : data.time.value,
         name: data.name,
         phone: data.phone,
         is_consultation: true,
         ...(data.specialist ? { specialist: data.specialist } : {}),
      };
      delete resData['isSpecialist'];
      if (specialistDefault) {
         resData.specialist = specialistDefault;
      }

      recordViewPost(resData, type, id)
         .then(() => {
            reset();
            set(false);

            sendPostRequest('/api/metric', {
               type: 'consultation',
               metricable_type: type === 'building' ? 'App\\Models\\Building' : 'App\\Models\\Apartment',
               metricable_id: id,
            }).then(() => {
               if (onUpdate) {
                  onUpdate();
               } else {
                  window.location.reload();
               }
            });
         })
         .catch(error => {});
   };

   return (
      <Modal
         options={{ overlayClassNames: '_right', modalClassNames: styles.root, modalContentClassNames: styles.AppConsultationModal }}
         set={set}
         condition={condition}>
         {myApp ? (
            <div className={styles.AppConsultationModalWrapper}>
               <BlockMyApp data={myApp} variant="consultation" onUpdate={onUpdate} />
            </div>
         ) : (
            <form onSubmit={handleSubmit(onSubmitHandler)} className="flex flex-col">
               <div className={styles.AppConsultationModalWrapper}>
                  <h2 className="title-2 mb-3">Заказ звонка от застройщика</h2>
                  <p className="text-primary400 mb-6">Вам перезвонит менеджер отдела продаж застройщика {developName}</p>
                  <div className={styles.AppConsultationModalFields}>
                     <ControllerFieldSelect
                        {...formOptions}
                        nameLabel="Выберите удобное время"
                        options={timesOptions
                           .map(item => {
                              const currentHour = new Date().getHours();
                              if (currentHour < item.time || item.time === 'now') {
                                 return item;
                              }
                           })
                           .filter(item => item)}
                        defaultValue={timesOptions[0]}
                        name="time"
                        className="col-span-full"
                     />
                     <ControllerFieldInput
                        {...formOptions}
                        requiredValue="Введите ваше имя"
                        beforeText="Ваше имя"
                        name="name"
                        defaultValue={userInfo?.name || ''}
                        disabled={Boolean(userInfo?.name)}
                     />
                     <ControllerFieldInputPhone {...formOptions} defaultValue={userInfo?.phone || ''} disabled={Boolean(userInfo?.phone)} />
                  </div>
               </div>
               <div className={`${isSpecialistValue ? 'order-1' : ''} px-12 md1:px-6`}>
                  <Button className="w-full mt-8">Оставить заявку</Button>
               </div>
               {specialistsShow && (
                  <SpecialistsSliderToggle
                     specialists={specialists}
                     classNameBtn="px-12"
                     options={{ setValue, control, developName, isSpecialistValue, errors }}
                  />
               )}
            </form>
         )}
      </Modal>
   );
};

export default AppConsultationModal;
