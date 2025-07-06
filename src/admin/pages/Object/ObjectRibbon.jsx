import React, { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';

import Tabs from '../../../ui/Tabs';
import Button from '../../../uiForm/Button';
import CreatePromo from './CreatePromo';
import { CardStock } from '../../../ui/CardStock';
import { NavBtnNext, NavBtnPrev } from '../../../ui/NavBtns';
import { sendPostRequest } from '../../../api/requestsApi';
import { useParams } from 'react-router-dom';
import { refactPhotoStageAppend, refactPhotoStageOne, refactPhotoStageTwo } from '../../../helpers/photosRefact';
import ModalWrapper from '../../../ui/Modal/ModalWrapper';

const ObjectRibbon = ({ dataObject, fetchData, specialists = [], frames = [], authorDefault }) => {
   const params = useParams();

   const [editModalPromo, setEditModalPromo] = useState(false);
   const [editModalCalc, setEditModalCalc] = useState(false);
   const [editModalNews, setEditModalNews] = useState(false);

   const [modalPromo, setModalPromo] = useState(false);
   const [modalCalc, setModalCalc] = useState(false);
   const [modalNews, setModalNews] = useState(false);

   const onSubmitForm = (data, reset, type, currentPromoId) => {
      const resData = { ...data, building_id: params.id };
      const formData = new FormData();

      resData.image = refactPhotoStageOne(resData.image);
      refactPhotoStageAppend(resData.image, formData);
      resData.image = refactPhotoStageTwo(resData.image);
      resData.image = resData.image[0];

      if (resData.is_banner) {
         resData.banner_image = refactPhotoStageOne(resData.banner_image);
         refactPhotoStageAppend(resData.banner_image, formData);
         resData.banner_image = refactPhotoStageTwo(resData.banner_image);
         resData.banner_image = resData.banner_image[0];
      }

      formData.append('data', JSON.stringify(resData));

      console.log(resData);

      sendPostRequest(`/admin-api/${type === 'create' ? `building/${params.id}/promo/create` : `promo/${currentPromoId}/update`}`, formData, {
         'Content-Type': 'multipart/form-data',
      })
         .then(res => {
            sendPostRequest(`/admin-api/assign/promo/${res.data.id}/apartments`, { apartments_ids: resData.apartments_ids }).then(res => {
               reset();
               fetchData();

               setModalPromo(false);
               setModalCalc(false);
               setModalNews(false);

               setEditModalPromo(false);
               setEditModalCalc(false);
               setEditModalNews(false);
            });
         })
         .catch(err => {});
   };

   const onSubmitPromoCreate = (data, reset, type, currentPromoId) => {
      onSubmitForm(data, reset, type, currentPromoId);
   };

   const onSubmitCalcCreate = (data, reset, type, currentPromoId) => {
      onSubmitForm({ ...data, is_calculation: true }, reset, type, currentPromoId);
   };
   const onSubmitNewsCreate = (data, reset, type, currentPromoId) => {
      onSubmitForm({ ...data, is_news: true }, reset, type, currentPromoId);
   };

   const PromoTabBody = ({ data, editItem }) => {
      if (!data || data.length === 0) return;
      return (
         <Swiper
            modules={[Navigation]}
            slidesPerView={data.length > 1 ? 1.05 : 1}
            navigation={{
               prevEl: '.slider-btn-prev',
               nextEl: '.slider-btn-next',
            }}
            spaceBetween={16}
            breakpoints={{
               799: {
                  slidesPerView: 2,
                  spaceBetween: 24,
               },
               1222: {
                  slidesPerView: 3,
                  spaceBetween: 24,
               },
            }}
            className="md1:px-4 md1:-mx-4">
            {data.map((item, index) => {
               return (
                  <SwiperSlide key={index}>
                     <CardStock {...item} developer={dataObject.developer} deleteCard={fetchData} editCard={() => editItem(item)} controlsAdmin />
                  </SwiperSlide>
               );
            })}
            <NavBtnPrev disabled className="slider-btn-prev !absolute top-[95px] right-4" />
            <NavBtnNext className="slider-btn-next !absolute top-[95px] right-4" />
         </Swiper>
      );
   };

   const dataTabs = [
      {
         name: 'Скидки, акции',
         body: (
            <div>
               <PromoTabBody data={dataObject.stock} editItem={setEditModalPromo} />
               <Button type="button" className="w-full mt-8" onClick={() => setModalPromo(true)}>
                  Создать скидку
               </Button>
            </div>
         ),
         count: dataObject.stock.length,
      },
      {
         name: 'Расчёты',
         body: (
            <div>
               <PromoTabBody data={dataObject.calculations} editItem={setEditModalCalc} />
               <Button type="button" className="w-full mt-8" onClick={() => setModalCalc(true)}>
                  Создать расчёт
               </Button>
            </div>
         ),
         count: dataObject.calculations.length,
      },
      {
         name: 'Подарки',
         body: (
            <div>
               <PromoTabBody data={dataObject.news} editItem={setEditModalNews} />
               <Button type="button" className="w-full mt-8" onClick={() => setModalNews(true)}>
                  Создать новость о подарке
               </Button>
            </div>
         ),
         count: dataObject.news.length,
      },
   ];

   return (
      <div className="white-block mt-4">
         <h2 className="title-2 mb-6">Скидки, подарки, расчёты</h2>
         <Tabs data={dataTabs} />
         <ModalWrapper condition={modalPromo}>
            <CreatePromo
               conditionModal={modalPromo}
               setModal={setModalPromo}
               specialists={specialists}
               dataObject={dataObject}
               frames={frames}
               options={{ title: 'Создать скидку', onSubmitForm: onSubmitPromoCreate }}
               authorDefault={authorDefault}
            />
         </ModalWrapper>
         <ModalWrapper condition={modalCalc}>
            <CreatePromo
               conditionModal={modalCalc}
               setModal={setModalCalc}
               specialists={specialists}
               dataObject={dataObject}
               frames={frames}
               options={{ title: 'Создать расчёт', onSubmitForm: onSubmitCalcCreate }}
               authorDefault={authorDefault}
            />
         </ModalWrapper>
         <ModalWrapper condition={modalNews}>
            <CreatePromo
               conditionModal={modalNews}
               setModal={setModalNews}
               specialists={specialists}
               dataObject={dataObject}
               frames={frames}
               options={{ title: 'Создать новость о подарке', onSubmitForm: onSubmitNewsCreate }}
               authorDefault={authorDefault}
            />
         </ModalWrapper>

         <ModalWrapper condition={editModalPromo}>
            <CreatePromo
               conditionModal={editModalPromo !== false}
               setModal={setEditModalPromo}
               specialists={specialists}
               dataObject={dataObject}
               values={editModalPromo}
               frames={frames}
               type="edit"
               options={{ title: 'Редактировать скидку', onSubmitForm: onSubmitPromoCreate }}
               authorDefault={authorDefault}
            />
         </ModalWrapper>
         <ModalWrapper condition={editModalCalc}>
            <CreatePromo
               conditionModal={editModalCalc !== false}
               setModal={setEditModalCalc}
               specialists={specialists}
               dataObject={dataObject}
               values={editModalCalc}
               type="edit"
               frames={frames}
               options={{ title: 'Редактировать расчёт', onSubmitForm: onSubmitCalcCreate }}
               authorDefault={authorDefault}
            />
         </ModalWrapper>
         <ModalWrapper condition={editModalNews}>
            <CreatePromo
               conditionModal={editModalNews !== false}
               setModal={setEditModalNews}
               specialists={specialists}
               dataObject={dataObject}
               values={editModalNews}
               type="edit"
               frames={frames}
               options={{ title: 'Редактировать новость о подарке', onSubmitForm: onSubmitNewsCreate }}
               authorDefault={authorDefault}
            />
         </ModalWrapper>
      </div>
   );
};

export default ObjectRibbon;
