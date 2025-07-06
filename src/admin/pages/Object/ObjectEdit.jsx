import React, { useState } from 'react';
import { Link, redirect, useParams } from 'react-router-dom';

import { ControllerFieldInput } from '../../../uiForm/ControllerFields/ControllerFieldInput';
import Button from '../../../uiForm/Button';
import { ControllerFieldSelect } from '../../../uiForm/ControllerFields/ControllerFieldSelect';
import { ControllerFieldTextarea } from '../../../uiForm/ControllerFields/ControllerFieldTextarea';
import { FiltersFromDataController } from '../../../unifComponents/FiltersFromData';

import ObjectPhoto from './ObjectPhoto';
import ObjectApartRenov from './ObjectApartRenov';
import ObjectEcologyParks from './ObjectEcologyParks';
import ObjectConstructProgress from './ObjectConstructProgress';
import { ControllerFieldMultiSelect } from '../../../uiForm/ControllerFields/ControllerFieldMultiSelect';
import { ControllerFieldCheckbox } from '../../../uiForm/ControllerFields/ControllerFieldCheckbox';
import ObjectRibbon from './ObjectRibbon';
import ObjectPresents from './ObjectPresents';
import { PrivateRoutesPath, RoutesPath } from '../../../constants/RoutesPath';
import BuildingApartments from '../../../pages/Building/BuildingApartments';
import ObjectVideo from './ObjectVideo';
import ObjectSpecialCondition from './ObjectSpecialCondition';
import FixedBlock from '../../../components/FixedBlock';
import { BuildingContext } from '../../../context';
import MapAddressInput from '../../../unifComponents/ymap/AddressInput';
import ObjectAdvantages from './ObjectAdvantages';
import isEmptyArrObj from '../../../helpers/isEmptyArrObj';
import { useObject } from './useObject';
import { BtnActionText } from '../../../ui/ActionBtns';
import { IconTrash } from '../../../ui/Icons';
import DeleteBuildingModal from '../../../ModalsMain/DeleteBuildingModal';
import { ROLE_ADMIN } from '../../../constants/roles';

const ObjectEdit = () => {
   const params = useParams();
   const {
      data,
      isLoading,
      isLoadingSend,
      sendingForm,
      constructItems,
      groupsPresent,
      specialCondition,
      tags,
      attributes,
      typeBuild,
      stickers,
      advantages,
      advantagesComplex,
      developers,
      frames,
      specialists,
      onSubmitHandler,
      dataGeo,
      setDataGeo,
      citiesItems,
      addressInputWrapperRef,
      addressInputRef,
      watchCity,
      watchAddress,
      buttonSubmitRef,
      handleSubmit,
      control,
      setValue,
      errors,
      fetchDataGroupsPresents,
      fetchDataBuilding,
      fetchSpecialCondition,
      fetchHistory,
      setData,
      dataPhotos,
      setDataPhotos,
      dataRenov,
      setDataRenov,
      dataEcologyParks,
      setDataEcologyParks,
   } = useObject(params, 'edit');

   const [confirmDeleteModal, setConfirmDeleteModal] = useState(false);

   if (isLoading) return;

   return (
      <BuildingContext.Provider value={data}>
         <main className="main">
            <div className="main-wrapper--title">
               <div className="container flex justify-between">
                  <h2 className="title-2">Редактирование комплекса {data.title}</h2>
                  <BtnActionText className="!px-0" onClick={() => setConfirmDeleteModal(params.id)}>
                     <IconTrash width={16} height={16} className="!fill-red" />
                     <span className="text-dark font-medium">Удалить комплекс</span>
                  </BtnActionText>
               </div>
               <div className="mt-6">
                  <form onSubmit={handleSubmit(data => onSubmitHandler(data))} className={isLoadingSend ? 'pointer-events-none' : ''}>
                     <div className="container">
                        <div className="white-block">
                           <h2 className="title-2 mb-6">Адрес</h2>
                           <div className="text-primary400">
                              <p>Укажите кликом нужное место на карте или переместите маркер чтобы изменить местоположение объекта.</p>
                              <p>Или добавьте адрес в ручную.</p>
                           </div>
                           <div className="grid grid-cols-3 gap-2 mt-6 mb-2">
                              <ControllerFieldInput control={control} beforeText="Комплекс" name="complex" defaultValue={data?.title} />
                           </div>
                           <div className="grid grid-cols-3 gap-2 mb-4">
                              <ControllerFieldSelect
                                 control={control}
                                 nameLabel="Город"
                                 options={citiesItems.map(item => {
                                    return {
                                       geo: [item.latitude, item.longitude],
                                       label: item.name,
                                       value: item.id,
                                    };
                                 })}
                                 defaultValue={citiesItems
                                    .map(item => {
                                       return {
                                          geo: [item.latitude, item.longitude],
                                          label: item.name,
                                          value: item.id,
                                       };
                                    })
                                    .find(item => item.label === data.city)}
                                 name="city"
                                 requiredValue
                                 errors={errors}
                              />
                              <div ref={addressInputWrapperRef} className="col-span-2">
                                 <ControllerFieldInput
                                    control={control}
                                    beforeText="Улица, дом, корпус"
                                    name="address"
                                    requiredValue
                                    errors={errors}
                                    defaultValue={data?.address}
                                    refInput={addressInputRef}
                                 />
                              </div>
                           </div>
                           <MapAddressInput
                              value={watchAddress}
                              setValue={value => setValue('address', value)}
                              target={addressInputWrapperRef.current}
                              refInput={addressInputRef}
                              geoValue={dataGeo}
                              setGeoValue={setDataGeo}
                              currentCity={watchCity}
                           />
                        </div>
                        <div className="white-block mt-4">
                           <h2 className="title-2 mb-6">Параметры</h2>
                           <div className="mb-4 grid grid-cols-3 gap-2">
                              <ControllerFieldInput
                                 control={control}
                                 requiredValue
                                 errors={errors}
                                 beforeText="Срок сдачи"
                                 name="deadline"
                                 defaultValue={data?.deadline || ''}
                              />
                           </div>
                           <div>
                              {Boolean(attributes) &&
                                 attributes?.map((item, index) => {
                                    return (
                                       <div key={index} className="[&:not(:last-child)]:mb-6">
                                          <h3 className="title-3">{item.name}</h3>
                                          <div className="grid grid-cols-3 gap-6 mt-4">
                                             {item.items.map((item, index) => {
                                                return (
                                                   <FiltersFromDataController
                                                      className={item.type !== 'flag' ? 'col-span-full' : ''}
                                                      key={index}
                                                      nameOptions="available-values"
                                                      defaultValues={data.attributes.map(item => item.items)?.flat(1)}
                                                      {...{ data: item, control }}
                                                   />
                                                );
                                             })}
                                          </div>
                                       </div>
                                    );
                                 })}
                           </div>
                           {Boolean(watchCity && !isEmptyArrObj(watchCity)) && (
                              <div className="mt-8">
                                 <h3 className="title-3 mb-4">Теги/стикеры</h3>
                                 <div className="grid grid-cols-3 gap-2">
                                    <ControllerFieldMultiSelect
                                       name="tags"
                                       control={control}
                                       nameLabel="Теги"
                                       options={tags
                                          .filter(item => item.city === watchCity.label)
                                          .map(item => {
                                             return {
                                                value: item.id,
                                                label: item.name,
                                             };
                                          })}
                                       defaultValue={data.tags.map(item => {
                                          return {
                                             value: item.id,
                                             label: item.name,
                                          };
                                       })}
                                       btnsActions
                                       search
                                       onClose={() => {
                                          sendingForm();
                                       }}
                                    />
                                    <ControllerFieldMultiSelect
                                       name="stickers"
                                       control={control}
                                       nameLabel="Стикеры"
                                       options={stickers
                                          .filter(item => item.city === watchCity.label)
                                          .map(item => {
                                             return {
                                                value: item.id,
                                                label: item.name,
                                             };
                                          })}
                                       defaultValue={data.stickers.map(item => {
                                          return {
                                             value: item.id,
                                             label: item.name,
                                          };
                                       })}
                                       btnsActions
                                       search
                                       onClose={() => {
                                          sendingForm();
                                       }}
                                    />
                                    <ControllerFieldMultiSelect
                                       name="advantages"
                                       control={control}
                                       nameLabel="Уникальные преимущества объекта"
                                       options={advantages
                                          .filter(item => item.city === watchCity.label)
                                          .map(item => {
                                             return {
                                                value: item.id,
                                                label: item.name,
                                             };
                                          })}
                                       defaultValue={data.advantages?.map(item => {
                                          return {
                                             value: item.id,
                                             label: item.name,
                                          };
                                       })}
                                       btnsActions
                                       search
                                       onClose={() => {
                                          sendingForm();
                                       }}
                                    />
                                 </div>
                              </div>
                           )}
                           <div className="mt-8">
                              <h3 className="title-3 mb-4">Тип недвижимости/застройщик</h3>
                              <div className="grid grid-cols-3 gap-2">
                                 <ControllerFieldSelect
                                    name="type-build"
                                    control={control}
                                    nameLabel="Тип недвижимости"
                                    options={typeBuild}
                                    requiredValue
                                    errors={errors}
                                    defaultValue={data.type_id ? typeBuild.find(item => item.value === data.type_id) : {}}
                                    onClose={() => {
                                       sendingForm();
                                    }}
                                 />
                                 <ControllerFieldSelect
                                    name="developer"
                                    control={control}
                                    nameLabel="Застройщик"
                                    options={developers}
                                    defaultValue={{
                                       value: data.developer?.id,
                                       label: data.developer?.name,
                                    }}
                                    search
                                    requiredValue
                                    errors={errors}
                                    onClose={() => {
                                       sendingForm();
                                    }}
                                 />
                              </div>
                           </div>
                        </div>
                        <div className="white-block mt-4">
                           <h2 className="title-2 mb-6">Описание</h2>
                           <ControllerFieldTextarea
                              control={control}
                              maxLength={4000}
                              name="description"
                              defaultValue={data.description?.replace(/<[^>]+>/g, '')}
                              placeholder="Расскажите о недвижимости, транспортной доступности и инфраструктуре"
                           />
                        </div>
                        <div className="white-block mt-4">
                           <h2 className="title-2 mb-6">Выводить на главную</h2>
                           <div className="flex gap-8">
                              <ControllerFieldCheckbox
                                 defaultValue={data?.showOnHomepage}
                                 control={control}
                                 option={{ label: 'Определенно рекомендуем' }}
                                 name="recommend-home"
                              />
                              <ControllerFieldCheckbox
                                 defaultValue={data?.showCashbackOnHomepage}
                                 control={control}
                                 option={{ label: 'Повышенный кешбэк' }}
                                 name="cashback-home"
                              />
                           </div>
                        </div>
                        <div className="white-block mt-4">
                           <h2 className="title-2 mb-6">Цена</h2>
                           <div className="grid grid-cols-3 gap-2">
                              <ControllerFieldInput
                                 control={control}
                                 beforeText="Цена от"
                                 afterText="₽"
                                 name="priceFrom"
                                 defaultValue={data.minPrice || ''}
                                 convertNumber
                                 onlyNumber
                                 disabled
                              />
                              <ControllerFieldInput
                                 control={control}
                                 beforeText="Начислим за покупку"
                                 afterText="%"
                                 name="cashback"
                                 defaultValue={data.cashback || ''}
                                 onlyNumberSemicolon
                                 maxLength={4}
                              />
                              <ControllerFieldInput
                                 control={control}
                                 beforeText="С мастер подпиской"
                                 afterText="%"
                                 name="cashbackSubscribe"
                                 defaultValue={data.cashback_with_master_subscribe || ''}
                                 onlyNumberSemicolon
                                 maxLength={4}
                              />
                           </div>
                        </div>
                        <ObjectPresents
                           data={data}
                           frames={frames}
                           fetchData={fetchDataGroupsPresents}
                           groupsData={groupsPresent}
                           specialists={specialists}
                        />
                        <ObjectRibbon dataObject={data} fetchData={fetchDataBuilding} specialists={specialists} frames={frames} />
                        <ObjectSpecialCondition dataObject={data} specialCondition={specialCondition} fetchData={fetchSpecialCondition} />
                        <ObjectVideo
                           dataObject={data}
                           setData={setData}
                           sendingForm={sendingForm}
                           frames={frames}
                           specialists={specialists}
                           tags={data.tags.map(item => ({
                              value: item.id,
                              label: item.name,
                           }))}
                        />
                        <ObjectPhoto
                           data={dataPhotos}
                           setData={setDataPhotos}
                           dataVideos={data.videos_gallery}
                           options={{
                              specialists,
                              frames,
                              tags: data.tags.map(item => ({
                                 value: item.id,
                                 label: item.name,
                              })),
                              dataObject: data,
                           }}
                           sendingForm={sendingForm}
                        />
                        <ObjectApartRenov
                           data={dataRenov}
                           setData={setDataRenov}
                           dataVideos={data.videos_apartRenov}
                           options={{
                              specialists,
                              frames,
                              tags: data.tags.map(item => ({
                                 value: item.id,
                                 label: item.name,
                              })),
                              dataObject: data,
                           }}
                           sendingForm={sendingForm}
                        />
                        <ObjectEcologyParks
                           data={dataEcologyParks}
                           setData={setDataEcologyParks}
                           dataVideos={data.videos_ecologyParks}
                           options={{
                              specialists,
                              frames,
                              tags: data.tags.map(item => ({
                                 value: item.id,
                                 label: item.name,
                              })),
                              dataObject: data,
                           }}
                           sendingForm={sendingForm}
                        />
                        <ObjectConstructProgress
                           data={constructItems}
                           id={params.id}
                           frames={frames}
                           dataObject={data}
                           sendingForm={sendingForm}
                           specialists={specialists}
                           tags={data.tags.map(item => ({
                              value: item.id,
                              label: item.name,
                           }))}
                           sending={fetchHistory}
                        />
                     </div>
                     <FixedBlock condition={{ top: 50, el: buttonSubmitRef }} className="!z-[999]">
                        <div className="container py-2.5">
                           <Button type="button" onClick={handleSubmit(data => onSubmitHandler(data))} className="w-full" disabled={isLoadingSend}>
                              {isLoadingSend ? 'Сохранение...' : 'Сохранить'}
                           </Button>
                        </div>
                     </FixedBlock>
                  </form>
                  <div className="container">
                     <div className="mt-4">
                        <BuildingApartments data={data} frames={frames} tags={data.tags} advantages={advantagesComplex} userRole={ROLE_ADMIN.name}/>
                     </div>
                     <div ref={buttonSubmitRef} className="mt-8">
                        <Button onClick={handleSubmit(data => onSubmitHandler(data))} type="button" className="w-full" disabled={isLoadingSend}>
                           {isLoadingSend ? 'Сохранение...' : 'Сохранить'}
                        </Button>
                     </div>
                  </div>
               </div>
            </div>
         </main>
         <DeleteBuildingModal
            options={{
               condition: confirmDeleteModal,
               set: setConfirmDeleteModal,
               title: data.title,
               redirectUrl: RoutesPath.listing,
            }}
         />
      </BuildingContext.Provider>
   );
};

export default ObjectEdit;
