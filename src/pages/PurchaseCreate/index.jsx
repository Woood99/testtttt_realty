import React, { useRef, useState } from 'react';
import { Helmet } from 'react-helmet';
import { FormProvider } from 'react-hook-form';
import { useSelector } from 'react-redux';

import BodyAndSidebar from '../../components/BodyAndSidebar';
import { PurchaseCreateContext } from '../../context';
import Button from '../../uiForm/Button';
import FixedBlock from '../../components/FixedBlock';
import MainLayout from '../../layouts/MainLayout';
import Header from '../../components/Header';
import PurchaseCreateSidebar from './PurchaseCreateSidebar';
import { getCitiesSelector, getIsDesktop } from '@/redux';
import PurchaseCreateMain from './PurchaseCreateMain';
import PurchaseCreateStart from './PurchaseCreateStart';
import PurchaseCreateContacts from './PurchaseCreateContacts';
import PurchaseCreateStartView from './PurchaseCreateStartView';
import PurchaseCreateDescr from './PurchaseCreateDescr';
import PurchaseCreateParameters from './PurchaseCreateParameters';
import PurchaseCreatePrice from './PurchaseCreatePrice';
import PurchaseCreateLocation from './PurchaseCreateLocation';
import { FiltersFromDataController } from '../../unifComponents/FiltersFromData';
import { usePurchaseCreate } from './usePurchaseCreate';
import { PURCHASE_CREATE_TYPES } from './purchaseCreateConstants';
import { isArray } from '../../helpers/isEmptyArrObj';
import { getLastElementArray } from '../../helpers/arrayMethods';
import { stringToNumber } from '../../helpers/changeString';
import { sendPostRequest } from '../../api/requestsApi';
import { BuyerRoutesPath, RoutesPath } from '../../constants/RoutesPath';
import ModalWrapper from '../../ui/Modal/ModalWrapper';
import Modal from '../../ui/Modal';
import { calcPropsOptions, calcPropsOptionsValues } from '../../data/selectsField';
import PurchaseCreateTags from './PurchaseCreateTags';
import PurchaseCreateAdvantages from './PurchaseCreateAdvantages';

const PurchaseCreate = ({ isEdit = false, isAdmin = false }) => {
   const purchaseCreateSettings = usePurchaseCreate(isEdit);

   const buttonSubmitRef = useRef(null);
   const locationRef = useRef(null);
   const citiesItems = useSelector(getCitiesSelector);
   const isDesktop = useSelector(getIsDesktop);
   const [modalConfirm, setModalConfirm] = useState(false);
   const [confirmLoading, setConfirmLoading] = useState(false);

   const stages = [
      {
         body: <PurchaseCreateLocation />,
      },
      {
         body: <PurchaseCreatePrice />,
      },
      {
         body: <PurchaseCreateTags />,
      },
      {
         body: <PurchaseCreateParameters />,
      },
      ...purchaseCreateSettings.attributes.map((item, index) => {
         return {
            notMain: true,
            body: (
               <div key={index}>
                  <h2 className="title-2 mb-8 md1:mb-6">{item.name}</h2>
                  <div className="flex flex-col gap-8 mt-4">
                     {item.items.map((item, index) => {
                        return (
                           <FiltersFromDataController
                              className={item.type !== 'flag' ? 'col-span-full' : ''}
                              key={index}
                              nameOptions="available-values"
                              defaultValues={purchaseCreateSettings.defaultData?.attributes || []}
                              {...{ data: item, control: purchaseCreateSettings.control }}
                           />
                        );
                     })}
                  </div>
               </div>
            ),
         };
      }),
      {
         body: <PurchaseCreateAdvantages />,
      },
      {
         body: <PurchaseCreateDescr />,
      },
      {
         body: <PurchaseCreateStartView />,
      },
      {
         body: <PurchaseCreateContacts />,
      },
   ].map((item, index) => ({
      ...item,
      id: index,
   }));

   const onSubmitHandler = data => {
      const lastStage = getLastElementArray(stages);
      if (purchaseCreateSettings.modalOpen) {
         purchaseCreateSettings.setCurrentStage(prev => prev + 1);

         if (purchaseCreateSettings.currentStage !== lastStage.id) {
            return;
         }
      }

      if (!purchaseCreateSettings.typeActiveId) return;
      const attrData = {};
      purchaseCreateSettings.attributes.forEach(attr => {
         attr.items.forEach(item => {
            if (typeof data[item.name] === 'string') {
               attrData[item.name] = data[item.name] ? [data[item.name].trim()] : [];
            } else {
               if (isArray(data[item.name])) {
                  if (data[item.name][0]?.value) {
                     attrData[item.name] = data[item.name].map(item => item.value);
                  } else {
                     attrData[item.name] = data[item.name].filter(item => item !== 'all');
                  }
               } else {
                  attrData[item.name] = data[item.name]?.value ? [data[item?.name]?.value] : [];
               }
            }
            delete data[item.name];
         });
      });

      const resData = {
         type: PURCHASE_CREATE_TYPES.find(item => item.id === purchaseCreateSettings.typeActiveId).value,
         object_type_id: 1,
         'metro-selected-stations': '',

         any_region: data.any_region,
         city_id: data.city.value,
         coordinates: purchaseCreateSettings.coordinates,
         neighboring_areas: data.neighboring_areas,

         filters: attrData,

         type_house: data.type_house,
         developers: data.developers,
         complexes: data.complexes,
         rooms: data.rooms,

         area_total_from: data.area_total_from,
         area_total_to: data.area_total_to,

         area_kitchen_from: data.area_kitchen_from,
         area_kitchen_to: data.area_kitchen_to,

         floor_from: data.floor_from,
         floor_to: data.floor_to,

         floor_options: data.floor_options,

         tags: data.tags || [],
         advantages: data.advantages || [],

         description: data.description,
         details: data.details,

         view_start: data.view_start,

         calc_props: calcPropsOptions.filter(item => data.calc_props.includes(item.value)),
         ...(data.calc_props.find(i => i === calcPropsOptionsValues.cash) ? { price_type: 'object_price_from', price: data.object_price } : {}),
         ...(data.calc_props.find(
            i =>
               i === calcPropsOptionsValues.mortgage_approval_bank ||
               i === calcPropsOptionsValues.mortgage_no_approval_bank ||
               i === calcPropsOptionsValues.installment_plan
         )
            ? { price_type: 'month_payment', price: data.month_payment }
            : {}),

         month_payment: data.calc_props.find(
            i =>
               i === calcPropsOptionsValues.mortgage_approval_bank ||
               i === calcPropsOptionsValues.mortgage_no_approval_bank ||
               i === calcPropsOptionsValues.installment_plan
         )
            ? stringToNumber(data.month_payment)
            : 0,
         approved_amount: data.calc_props.find(i => i === calcPropsOptionsValues.mortgage_approval_bank) ? stringToNumber(data.approved_amount) : 0,
         certificate_amount: data.calc_props.find(i => i === calcPropsOptionsValues.certificate) ? stringToNumber(data.certificate_amount) : 0,
         initial_payment: data.calc_props.find(
            i =>
               (i === calcPropsOptionsValues.mortgage_approval_bank ||
                  i === calcPropsOptionsValues.mortgage_no_approval_bank ||
                  i === calcPropsOptionsValues.installment_plan) &&
               i !== calcPropsOptionsValues.no_down_payment
         )
            ? stringToNumber(data.initial_payment || '') || 0
            : 0,

         user_phone: data.phone.replace('+', ''),
         user_name: data.name,

         is_one_time_payment: Boolean(data.calc_props.find(i => i === calcPropsOptionsValues.cash)),
         is_not_one_time_payment: Boolean(
            data.calc_props.find(i => i === calcPropsOptionsValues.mortgage_approval_bank || i === calcPropsOptionsValues.mortgage_no_approval_bank)
         ),
      };

      const url = isAdmin
         ? isEdit
            ? `/admin-api/purchase-orders/${purchaseCreateSettings.params.id}/update`
            : '/admin-api/purchase-orders/create'
         : `${isEdit ? `/buyer-api/purchase-orders/${purchaseCreateSettings.params.id}/update` : '/buyer-api/purchase-orders/create'}`;

      if (isAdmin && !isEdit) {
         setModalConfirm({ url, resData });
      } else {
         sendPostRequest(url, resData).then(res => {
            window.location.href = `${isAdmin ? RoutesPath.purchase.inner : BuyerRoutesPath.purchase.inner}${res.data.id}`;
         });
      }
   };

   if (isEdit && !purchaseCreateSettings.defaultData) {
      return;
   }

   return (
      <MainLayout
         helmet={
            <Helmet>
               <title>{isEdit ? 'Редактировать заявку на покупку' : 'Разместить заявку на покупку'}</title>
               <meta name="description" content="Добро пожаловать на сайт inrut.ru" />;
               <meta name="description" content="На inrut.ru вы можете решить любой вопрос с недвижимостью" />;
            </Helmet>
         }>
         <PurchaseCreateContext.Provider
            value={{
               typeActiveId: purchaseCreateSettings.typeActiveId,
               setTypeActiveId: purchaseCreateSettings.setTypeActiveId,
               control: purchaseCreateSettings.control,
               watch: purchaseCreateSettings.watch,
               setValue: purchaseCreateSettings.setValue,
               errors: purchaseCreateSettings.errors,
               coordinates: purchaseCreateSettings.coordinates,
               setCoordinates: purchaseCreateSettings.setCoordinates,
               attributes: purchaseCreateSettings.attributes,
               formValues: purchaseCreateSettings.formValues,
               defaultData: purchaseCreateSettings.defaultData,
               cityWatch: purchaseCreateSettings.cityWatch,
               anyRegionWatch: purchaseCreateSettings.anyRegionWatch,
               init: purchaseCreateSettings.init,
               trigger: purchaseCreateSettings.trigger,
               modalOpen: purchaseCreateSettings.modalOpen,
               setModalOpen: purchaseCreateSettings.setModalOpen,
               currentStage: purchaseCreateSettings.currentStage,
               setCurrentStage: purchaseCreateSettings.setCurrentStage,
               calcPropsWatch: purchaseCreateSettings.calcPropsWatch,
               developers: purchaseCreateSettings.developers,
               complexes: purchaseCreateSettings.complexes,
               tags: purchaseCreateSettings.tags,
               tagsAll: purchaseCreateSettings.tagsAll,
               advantages: purchaseCreateSettings.advantages,
               advantagesAll: purchaseCreateSettings.advantagesAll,
               stages,
               locationRef,
               isEdit,
               cities: citiesItems,
               isAdmin,
               isInitEdit: isEdit ? purchaseCreateSettings.isInitEdit : true,
            }}>
            <Header />
            <main className="main">
               <FormProvider
                  {...{
                     control: purchaseCreateSettings.control,
                     formState: { errors: purchaseCreateSettings.errors },
                     setValue: purchaseCreateSettings.setValue,
                  }}>
                  <form
                     onSubmit={purchaseCreateSettings.handleSubmit(onSubmitHandler, purchaseCreateSettings.onInvalidSubmit)}
                     className="main-wrapper md1:!pb-[86px]">
                     <div className="container-desktop">
                        <BodyAndSidebar className="mmd1:!grid-cols-[1fr_280px]">
                           <PurchaseCreateMain />
                           {isDesktop && <PurchaseCreateSidebar />}
                        </BodyAndSidebar>
                        {purchaseCreateSettings.typeActiveId && isDesktop && (
                           <div ref={buttonSubmitRef}>
                              <Button className="mt-8 w-full">{isEdit ? 'Сохранить' : 'Разместить'}</Button>
                           </div>
                        )}
                     </div>
                     {purchaseCreateSettings.typeActiveId && (
                        <FixedBlock activeDefault={!isDesktop} condition={isDesktop ? { top: 50, el: buttonSubmitRef } : null}>
                           <div className="container py-2.5">
                              <Button className="w-full">{isEdit ? 'Сохранить' : 'Разместить'}</Button>
                           </div>
                        </FixedBlock>
                     )}
                  </form>
               </FormProvider>
            </main>
            <ModalWrapper condition={modalConfirm}>
               <Modal
                  condition={modalConfirm}
                  set={setModalConfirm}
                  options={{ overlayClassNames: '_center-max-content', modalClassNames: 'mmd1:!w-[550px]', modalContentClassNames: '!px-6' }}>
                  <h2 className="title-2-5 mb-4">Вы уверены что хотите создать заявку на данные:</h2>
                  <p className="mb-1 text-defaultMax">
                     <strong>Телефон:</strong> {modalConfirm.resData?.user_phone}
                  </p>
                  <p className="text-defaultMax">
                     <strong>Имя, фамилия:</strong> {modalConfirm.resData?.user_name}
                  </p>
                  <div className="mt-6 grid grid-cols-2 gap-4">
                     <Button isLoading={confirmLoading} size="Small" variant="secondary" onClick={() => setModalConfirm(false)}>
                        Отменить
                     </Button>
                     <Button
                        size="Small"
                        isLoading={confirmLoading}
                        onClick={() => {
                           setConfirmLoading(true);
                           sendPostRequest(modalConfirm.url, modalConfirm.resData).then(res => {
                              window.location.href = `${RoutesPath.purchase.inner}${res.data.id}`;
                           });
                        }}>
                        Создать
                     </Button>
                  </div>
               </Modal>
            </ModalWrapper>
         </PurchaseCreateContext.Provider>
      </MainLayout>
   );
};

export default PurchaseCreate;
