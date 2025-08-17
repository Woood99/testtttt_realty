import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link, useSearchParams } from 'react-router-dom';

import Button from '../../../uiForm/Button';
import Modal from '../../../ui/Modal';
import { BtnActionDelete, BtnActionEdit } from '../../../ui/ActionBtns';
import { SecondTableContent, SecondTableHeader } from '../../../ui/SecondTable';
import { CardRowBg } from '../../../ui/CardsRow';
import { PrivateRoutesPath } from '../../../constants/RoutesPath';
import Tabs from '../../../ui/Tabs';
import { getDataRequest } from '../../../api/requestsApi';
import ModalWrapper from '../../../ui/Modal/ModalWrapper';
import CardBasicRowSkeleton from '../../../components/CardBasicRowSkeleton';
import WebSkeleton from '../../../ui/Skeleton/WebSkeleton';
import Select from '../../../uiForm/Select';
import Input from '../../../uiForm/Input';
import FormRow from '../../../uiForm/FormRow';
import ResetBtn from '../../../uiForm/ResetBtn';
import isEmptyArrObj from '../../../helpers/isEmptyArrObj';
import { getCitiesSelector, getCurrentCitySelector } from '@/redux';
import { useQueryParams } from '../../../hooks/useQueryParams';
import { useGetTagsAllTypes } from '../../../api/other/useGetTags';
import { useObjectTypes } from '../../../api/other/useObjectTypes';

const TagsList = () => {
   const [confirmDeleteModal, setConfirmDeleteModal] = useState(false);

   const [_, setSearchParams] = useSearchParams();

   const [defaultTab, setDefaultTab] = useState(null);

   const params = useQueryParams();

   const citiesData = useSelector(getCitiesSelector);
   const currentCity = useSelector(getCurrentCitySelector);

   const { data: objectTypes } = useObjectTypes();
   const { data: tagsAllData, refetch: refetchTags, isLoading } = useGetTagsAllTypes();

   const objectTypesMap = new Map(objectTypes.map(type => [type.id, type.name]));

   const transformItems = items => {
      return (
         items?.map(item => ({
            ...item,
            types: item.types.map(id => objectTypesMap.get(id)),
         })) || []
      );
   };

   const itemsData = {
      tags: transformItems(tagsAllData.tags),
      stickers: transformItems(tagsAllData.stickers),
      advantages: transformItems(tagsAllData.advantages),
   };

   const searchParams = [
      {
         id: 0,
         name: 'tags',
      },
      {
         id: 1,
         name: 'stickers',
      },
      {
         id: 2,
         name: 'advantages',
      },
   ];

   const [filterFields, setFilterFields] = useState({
      city: {},
      search: '',
   });

   useEffect(() => {
      setDefaultTab(searchParams.find(item => item.name === params.type)?.id);
   }, []);

   const deleteTagHandler = async () => {
      if (!Number(confirmDeleteModal)) return;
      await getDataRequest(`/admin-api/tags/delete/${confirmDeleteModal}`);
      refetchTags();
      setConfirmDeleteModal(false);
   };

   const getFilteredData = (data = [], filters, defaultCity) => {
      return data.filter(item => {
         const city = !isEmptyArrObj(filters.city) ? filters.city.label : defaultCity.name;

         if (item.city === city && (filters.search ? item.name.trim().toLowerCase().includes(filters.search.trim().toLowerCase()) : true)) {
            return true;
         }
      });
   };

   const LayoutTab = ({ data = [], linkEdit = '#', linkCreate = '#', textCreate = '' }) => {
      return (
         <div className="mt-6 container">
            <SecondTableHeader className="grid-cols-[150px_350px_250px_1fr_max-content]">
               <span>ID</span>
               <span>Название</span>
               <span>Категория</span>
               <span>Город</span>
               <span>Действие</span>
            </SecondTableHeader>
            <SecondTableContent className="mt-3 flex flex-col gap-3">
               {isLoading
                  ? [...new Array(8)].map((_, index) => {
                       return (
                          <CardBasicRowSkeleton key={index} className="grid-cols-[150px_350px_250px_1fr_max-content] h-[96px]">
                             <WebSkeleton className="w-[100px] h-10 rounded-lg" />
                             <WebSkeleton className="w-3/6 h-10 rounded-lg" />
                             <WebSkeleton className="w-3/6 h-10 rounded-lg" />
                             <WebSkeleton className="w-3/6 h-10 rounded-lg" />
                             <WebSkeleton className="w-[100px] h-10 rounded-lg" />
                          </CardBasicRowSkeleton>
                       );
                    })
                  : data.map((item, index) => (
                       <CardRowBg key={index} className="grid-cols-[150px_350px_250px_1fr_max-content]">
                          <span>{item.id}</span>
                          <span>{item.name}</span>
                          <span>{item.types.join(', ')}</span>
                          <span>{item.city}</span>
                          <div className="flex items-center gap-4">
                             <Link to={`${linkEdit}${item.id}`}>
                                <BtnActionEdit Selector="div" />
                             </Link>
                             <BtnActionDelete onClick={() => setConfirmDeleteModal(item.id)} />
                          </div>
                       </CardRowBg>
                    ))}
            </SecondTableContent>
            <Link to={linkCreate} className="mt-8 w-full">
               <Button Selector="div">{textCreate}</Button>
            </Link>
         </div>
      );
   };

   return (
      <main className="main">
         <form>
            <FormRow className="grid-cols-[350px_500px_max-content] container">
               <Select
                  nameLabel="Город"
                  options={citiesData.map(item => ({
                     value: item.id,
                     label: item.name,
                  }))}
                  onChange={option => setFilterFields({ ...filterFields, city: option })}
                  value={
                     !isEmptyArrObj(filterFields.city)
                        ? filterFields.city
                        : {
                             value: currentCity.id,
                             label: currentCity.name,
                          }
                  }
               />
               <Input onChange={value => setFilterFields({ ...filterFields, search: value })} value={filterFields.search} before="Название" />
               <ResetBtn
                  className="mr-2"
                  text="Очистить"
                  onClick={e => {
                     e.preventDefault();
                     setFilterFields({
                        city: {},
                        search: '',
                     });
                  }}
               />
            </FormRow>
         </form>
         <div className="main-wrapper--title">
            <div className="container">
               <h2 className="title-2">Теги/стикеры</h2>
            </div>
            <div className="mt-4">
               <Tabs
                  data={[
                     {
                        name: 'Теги',
                        body: (
                           <LayoutTab
                              data={getFilteredData(itemsData.tags, filterFields, currentCity)}
                              linkEdit={PrivateRoutesPath.tags.editTag}
                              linkCreate={PrivateRoutesPath.tags.createTag}
                              textCreate="Создать новый тег"
                           />
                        ),
                        count: getFilteredData(itemsData.tags, filterFields, currentCity).length,
                     },
                     {
                        name: 'Стикеры',
                        body: (
                           <LayoutTab
                              data={getFilteredData(itemsData.stickers, filterFields, currentCity)}
                              linkEdit={PrivateRoutesPath.tags.editSticker}
                              linkCreate={PrivateRoutesPath.tags.createSticker}
                              textCreate="Создать новый стикер"
                           />
                        ),
                        count: getFilteredData(itemsData.stickers, filterFields, currentCity).length,
                     },
                     {
                        name: 'Уникальные преимущества объекта',
                        body: (
                           <LayoutTab
                              data={getFilteredData(itemsData.advantages, filterFields, currentCity)}
                              linkEdit={PrivateRoutesPath.tags.editAdvantage}
                              linkCreate={PrivateRoutesPath.tags.createAdvantage}
                              textCreate="Создать новое преимущество"
                           />
                        ),
                        count: getFilteredData(itemsData.advantages, filterFields, currentCity).length,
                     },
                  ]}
                  navClassName="container--no-padding"
                  defaultValue={defaultTab}
                  onChange={index => {
                     setSearchParams({ type: searchParams.find(item => item.id === index)?.name });
                  }}
               />
            </div>
         </div>
         <ModalWrapper condition={confirmDeleteModal}>
            <Modal
               condition={Boolean(confirmDeleteModal)}
               set={setConfirmDeleteModal}
               options={{ overlayClassNames: '_center-max-content', modalClassNames: '!w-[700px]' }}>
               <div className="text-center">
                  <h2 className="title-2">Вы действительно хотите удалить?</h2>
                  <p className="mt-2">Это действие необратимо</p>
                  <div className="mt-8 grid grid-cols-2 gap-2">
                     <Button onClick={() => setConfirmDeleteModal(false)}>Нет</Button>
                     <Button onClick={deleteTagHandler}>Да</Button>
                  </div>
               </div>
            </Modal>
         </ModalWrapper>
      </main>
   );
};

export default TagsList;
