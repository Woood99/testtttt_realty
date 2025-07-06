import React, { useEffect } from 'react';
import { ControllerFieldInput } from '../../../uiForm/ControllerFields/ControllerFieldInput';
import Button from '../../../uiForm/Button';
import { ControllerFieldSelect } from '../../../uiForm/ControllerFields/ControllerFieldSelect';
import { ControllerFieldTextarea } from '../../../uiForm/ControllerFields/ControllerFieldTextarea';
import { FiltersFromDataController } from '../../../unifComponents/FiltersFromData';

import ObjectPhoto from './ObjectPhoto';
import ObjectApartRenov from './ObjectApartRenov';
import ObjectEcologyParks from './ObjectEcologyParks';
import { ControllerFieldMultiSelect } from '../../../uiForm/ControllerFields/ControllerFieldMultiSelect';
import { ControllerFieldCheckbox } from '../../../uiForm/ControllerFields/ControllerFieldCheckbox';
import FixedBlock from '../../../components/FixedBlock';
import { BuildingContext } from '../../../context';
import MapAddressInput from '../../../unifComponents/ymap/AddressInput';
import isEmptyArrObj from '../../../helpers/isEmptyArrObj';
import { useObject } from './useObject';
import { useSelector } from 'react-redux';
import { getCurrentCitySelector } from '../../../redux/helpers/selectors';

const ObjectCreate = () => {
   const {
      data,
      tags,
      attributes,
      typeBuild,
      stickers,
      advantages,
      developers,
      onSubmitHandler,
      dataGeo,
      setDataGeo,
      addressInputWrapperRef,
      addressInputRef,
      watchCity,
      watchAddress,
      buttonSubmitRef,
      handleSubmit,
      control,
      setValue,
      errors,
      dataPhotos,
      setDataPhotos,
      dataRenov,
      setDataRenov,
      dataEcologyParks,
      setDataEcologyParks,
      citiesItems,
   } = useObject(null, 'create');
   const defaultCity = useSelector(getCurrentCitySelector);

   useEffect(() => {
      if (!defaultCity.id) return;
      setValue('city', {
         value: defaultCity.id,
         label: defaultCity.name,
         geo: defaultCity.geo,
      });
   }, [defaultCity.id]);

   return (
      <BuildingContext.Provider value={data}>
         <main className="main">
            <div className="main-wrapper--title">
               <div className="container">
                  <h2 className="title-2">Создать комплекс</h2>
               </div>
               <div className="mt-6">
                  <form onSubmit={handleSubmit(onSubmitHandler)}>
                     <div className="container">
                        <div className="white-block">
                           <h2 className="title-2 mb-6">Адрес</h2>
                           <div className="text-primary400">
                              <p>Укажите кликом нужное место на карте или переместите маркер чтобы изменить местоположение объекта.</p>
                              <p>Или добавьте адрес в ручную.</p>
                           </div>
                           <div className="grid grid-cols-3 gap-2 mt-6 mb-2">
                              <ControllerFieldInput control={control} beforeText="Комплекс" name="complex" requiredValue errors={errors} />
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
                                 name="city"
                                 requiredValue
                                 errors={errors}
                              />
                              <div ref={addressInputWrapperRef} className="col-span-2">
                                 <ControllerFieldInput
                                    control={control}
                                    beforeText="Улица, дом, корпус"
                                    requiredValue
                                    errors={errors}
                                    name="address"
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
                           <div className="mb-4 grid grid-cols-3">
                              <ControllerFieldInput control={control} requiredValue errors={errors} beforeText="Срок сдачи" name="deadline" />
                           </div>
                           <div>
                              {attributes ? (
                                 <>
                                    {attributes?.map((item, index) => {
                                       return (
                                          <div key={index} className="[&:not(:last-child)]:mb-6">
                                             <h3 className="title-3">{item.name}</h3>
                                             <div className="grid grid-cols-3 gap-6 mt-4">
                                                {item.items.map((data, index) => {
                                                   return (
                                                      <FiltersFromDataController
                                                         className={data.type !== 'flag' ? 'col-span-full' : ''}
                                                         key={index}
                                                         nameOptions="available-values"
                                                         defaultValues={[]}
                                                         {...{ data, control }}
                                                      />
                                                   );
                                                })}
                                             </div>
                                          </div>
                                       );
                                    })}
                                 </>
                              ) : (
                                 ''
                              )}
                           </div>
                           {Boolean(watchCity && !isEmptyArrObj(watchCity)) && (
                              <div className="mt-8">
                                 <h3 className="title-3 mb-4">Теги/стикеры</h3>
                                 <div className="grid grid-cols-3 gap-2">
                                    <ControllerFieldMultiSelect
                                       name="tags"
                                       control={control}
                                       nameLabel="Теги"
                                       setValue={setValue}
                                       options={tags
                                          .filter(item => item.city === watchCity.label)
                                          .map(item => {
                                             return {
                                                value: item.id,
                                                label: item.name,
                                             };
                                          })}
                                       btnsActions
                                       search
                                    />
                                    <ControllerFieldMultiSelect
                                       name="stickers"
                                       control={control}
                                       nameLabel="Стикеры"
                                       setValue={setValue}
                                       options={stickers
                                          .filter(item => item.city === watchCity.label)
                                          .map(item => {
                                             return {
                                                value: item.id,
                                                label: item.name,
                                             };
                                          })}
                                       btnsActions
                                       search
                                    />
                                    <ControllerFieldMultiSelect
                                       name="advantages"
                                       control={control}
                                       nameLabel="Уникальные преимущества объекта"
                                       setValue={setValue}
                                       options={advantages
                                          .filter(item => item.city === watchCity.label)
                                          .map(item => {
                                             return {
                                                value: item.id,
                                                label: item.name,
                                             };
                                          })}
                                       btnsActions
                                       search
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
                                 />
                                 <ControllerFieldSelect
                                    name="developer"
                                    control={control}
                                    nameLabel="Застройщик"
                                    options={developers}
                                    requiredValue
                                    errors={errors}
                                    search
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
                              placeholder="Расскажите о недвижимости, транспортной доступности и инфраструктуре"
                           />
                        </div>
                        <div className="white-block mt-4">
                           <h2 className="title-2 mb-6">Выводить на главную</h2>
                           <div className="flex gap-8">
                              <ControllerFieldCheckbox control={control} option={{ label: 'Определенно рекомендуем' }} name="recommend-home" />
                              <ControllerFieldCheckbox control={control} option={{ label: 'Повышенный кешбэк' }} name="cashback-home" />
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
                                 convertNumber
                                 onlyNumber
                                 disabled
                              />
                              <ControllerFieldInput
                                 control={control}
                                 beforeText="Начислим за покупку"
                                 afterText="%"
                                 name="cashback"
                                 onlyNumberSemicolon
                                 maxLength={4}
                              />
                              <ControllerFieldInput
                                 control={control}
                                 beforeText="С мастер подпиской"
                                 afterText="%"
                                 name="cashbackSubscribe"
                                 onlyNumberSemicolon
                                 maxLength={4}
                              />
                           </div>
                        </div>
                        <ObjectPhoto data={dataPhotos} setData={setDataPhotos} />
                        <ObjectApartRenov data={dataRenov} setData={setDataRenov} />
                        <ObjectEcologyParks data={dataEcologyParks} setData={setDataEcologyParks} />
                     </div>
                     <FixedBlock condition={{ top: 50, el: buttonSubmitRef }}>
                        <div className="container py-2.5">
                           <Button type="button" onClick={handleSubmit(onSubmitHandler)} className="w-full">
                              Сохранить
                           </Button>
                        </div>
                     </FixedBlock>
                     <div ref={buttonSubmitRef} className="container mt-8">
                        <Button type="submit" className="w-full">
                           Сохранить
                        </Button>
                     </div>
                  </form>
               </div>
            </div>
         </main>
      </BuildingContext.Provider>
   );
};

export default ObjectCreate;
