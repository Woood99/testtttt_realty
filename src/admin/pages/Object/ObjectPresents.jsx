import React, { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import stylesDragDropItems from '../../../components/DragDrop/DragDropItems.module.scss';
import Button from '../../../uiForm/Button';
import { useSelector } from 'react-redux';
import { deleteRequest } from '../../../api/requestsApi';
import { ElementTitleSubtitleSecond } from '../../../ui/Elements';
import CreatePresentGroup from './CreatePresentGroup';
import numberReplace from '../../../helpers/numberReplace';
import { IconEdit, IconTrash } from '../../../ui/Icons';
import PresentsGroup from './PresentsGroup';
import ModalWrapper from '../../../ui/Modal/ModalWrapper';
import Tabs from '../../../ui/Tabs';

const ObjectPresents = ({ data, frames, fetchData, groupsData = [], specialists = [] }) => {
   const [isOpenModalCreate, setIsOpenModalCreate] = useState(false);
   const [isOpenModalCreateSecond, setIsOpenModalCreateSecond] = useState(false);
   
   const [isOpenModalEdit, setIsOpenModalEdit] = useState(false);
   const [isOpenModalShow, setIsOpenModalShow] = useState(false);

   const deleteGroup = id => {
      deleteRequest(`/admin-api/gift_group/${id}`).then(() => {
         fetchData();
      });
   };

   const LayoutItemsMain = ({ currentData }) => {
      if (!currentData) return;
      return (
         <div className="mb-8">
            {currentData.length > 0 ? (
               <Swiper
                  modules={[Navigation]}
                  slidesPerView={3.5}
                  navigation={{
                     prevEl: '.slider-btn-prev',
                     nextEl: '.slider-btn-next',
                  }}
                  spaceBetween={16}
                  className="md1:px-4 md1:-mx-4">
                  {currentData.map((item, index) => {
                     return (
                        <SwiperSlide key={index}>
                           <article className="rounded-lg bg-primary700 h-[150px] p-6 group">
                              <div className="CardLinkElement" onClick={() => setIsOpenModalShow(item)} />
                              <h4 className="title-4 mb-2">{item.count ? 'По Количеству' : 'По сумме'}</h4>
                              <p>Максимальная сумма: {numberReplace(item.sum || item.max_sum || 0)} ₽</p>
                              {item.count ? <p className="mt-1">Максимальное кол-во: {numberReplace(item.count || 0)} шт.</p> : ''}
                              <p className="mt-1">Количество подарков: {numberReplace(item.gift_count || 0)}</p>
                              <button
                                 type="button"
                                 className={`${stylesDragDropItems.DragDropImageIcon} top-4 right-14 group-hover:opacity-100 group-hover:visible`}
                                 onClick={() => setIsOpenModalEdit(item)}>
                                 <IconEdit width={15} height={15} className="stroke-blue" />
                              </button>
                              <button
                                 type="button"
                                 className={`${stylesDragDropItems.DragDropImageIcon} top-4 right-4 group-hover:opacity-100 group-hover:visible`}
                                 onClick={() => deleteGroup(item.id)}>
                                 <IconTrash width={15} height={15} className="stroke-red" />
                              </button>
                           </article>
                        </SwiperSlide>
                     );
                  })}
               </Swiper>
            ) : (
               <span className="text-primary400">Вы пока не добавили ни одной группы</span>
            )}
            <ModalWrapper condition={isOpenModalEdit}>
               <CreatePresentGroup
                  conditionModal={isOpenModalEdit !== false}
                  setModal={setIsOpenModalEdit}
                  mainData={data}
                  frames={frames}
                  fetchData={fetchData}
                  edit
                  defaultValues={isOpenModalEdit}
                  title="Редактировать группу подарков по типу"
               />
            </ModalWrapper>
            <ModalWrapper condition={isOpenModalShow}>
               <PresentsGroup
                  conditionModal={isOpenModalShow !== false}
                  setModal={setIsOpenModalShow}
                  mainData={data}
                  defaultValues={isOpenModalShow}
                  specialists={specialists}
                  developer={data.developer}
               />
            </ModalWrapper>
         </div>
      );
   };

   const LayoutItemsSecond = ({ currentData }) => {
      if (!currentData) return;
      return (
         <div className="mb-8">
            {currentData.length > 0 ? (
               <Swiper
                  modules={[Navigation]}
                  slidesPerView={3.5}
                  navigation={{
                     prevEl: '.slider-btn-prev',
                     nextEl: '.slider-btn-next',
                  }}
                  spaceBetween={16}
                  className="md1:px-4 md1:-mx-4">
                  {currentData.map((item, index) => {
                     return (
                        <SwiperSlide key={index}>
                           <article className="rounded-lg bg-primary700 h-[150px] p-6 group">
                              <div className="CardLinkElement" onClick={() => setIsOpenModalShow(item)} />
                              <p className="mt-1">Количество подарков: {numberReplace(item.gift_count || 0)}</p>
                              <button
                                 type="button"
                                 className={`${stylesDragDropItems.DragDropImageIcon} top-4 right-14 group-hover:opacity-100 group-hover:visible`}
                                 onClick={() => setIsOpenModalEdit(item)}>
                                 <IconEdit width={15} height={15} className="stroke-blue" />
                              </button>
                              <button
                                 type="button"
                                 className={`${stylesDragDropItems.DragDropImageIcon} top-4 right-4 group-hover:opacity-100 group-hover:visible`}
                                 onClick={() => deleteGroup(item.id)}>
                                 <IconTrash width={15} height={15} className="stroke-red" />
                              </button>
                           </article>
                        </SwiperSlide>
                     );
                  })}
               </Swiper>
            ) : (
               <span className="text-primary400">Вы пока не добавили ни одной группы</span>
            )}
            <ModalWrapper condition={isOpenModalEdit}>
               <CreatePresentGroup
                  conditionModal={isOpenModalEdit !== false}
                  setModal={setIsOpenModalEdit}
                  mainData={data}
                  frames={frames}
                  fetchData={fetchData}
                  edit
                  defaultValues={isOpenModalEdit}
                  title="Редактировать группу подарков"
                  type="second"
               />
            </ModalWrapper>
            <ModalWrapper condition={isOpenModalShow}>
               <PresentsGroup
                  conditionModal={isOpenModalShow !== false}
                  setModal={setIsOpenModalShow}
                  mainData={data}
                  defaultValues={isOpenModalShow}
                  specialists={specialists}
                  developer={data.developer}
               />
            </ModalWrapper>
         </div>
      );
   };

   return (
      <div className="white-block mt-4">
         <ElementTitleSubtitleSecond className="mb-6">
            <h2 className="title-2">Подарки</h2>
            <span>(группы подарков)</span>
         </ElementTitleSubtitleSecond>
         <Tabs
            data={[
               {
                  name: 'Основные группы подарков',
                  body: (
                     <>
                        <LayoutItemsSecond currentData={groupsData.filter(item => item.is_main_group)} />
                        <Button type="button" className="w-full mt-8" onClick={() => setIsOpenModalCreateSecond(true)}>
                           Создать группу подарков
                        </Button>
                        <CreatePresentGroup
                           conditionModal={isOpenModalCreateSecond}
                           setModal={setIsOpenModalCreateSecond}
                           mainData={data}
                           frames={frames}
                           fetchData={fetchData}
                           title="Создать группу подарков"
                           type="second"
                        />
                     </>
                  ),
                  count: groupsData.filter(item => item.is_main_group).length,
               },
               {
                  name: 'Дополнительные группы подарков по типу',
                  body: (
                     <>
                        <LayoutItemsMain currentData={groupsData.filter(item => !item.is_main_group)} />
                        <Button type="button" className="w-full mt-8" onClick={() => setIsOpenModalCreate(true)}>
                           Создать группу подарков по типу
                        </Button>
                        <CreatePresentGroup
                           conditionModal={isOpenModalCreate}
                           setModal={setIsOpenModalCreate}
                           mainData={data}
                           frames={frames}
                           fetchData={fetchData}
                           title="Создать группу подарков по типу"
                        />
                     </>
                  ),
                  count: groupsData.filter(item => !item.is_main_group).length,
               },
            ]}
         />
      </div>
   );
};

export default ObjectPresents;
