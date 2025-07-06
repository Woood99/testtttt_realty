import React, { useEffect, useState } from 'react';
import qs from 'qs';
import { useForm } from 'react-hook-form';
import { ElementTitleSubtitle } from '../../../ui/Elements';
import { ControllerFieldInput } from '../../../uiForm/ControllerFields/ControllerFieldInput';
import Button from '../../../uiForm/Button';
import { ControllerFieldSelect } from '../../../uiForm/ControllerFields/ControllerFieldSelect';
import { ControllerFieldCheckbox } from '../../../uiForm/ControllerFields/ControllerFieldCheckbox';
import { useNavigate, useParams } from 'react-router-dom';

import selectTypeItems from './selectTypeItems';
import { getDataRequest, sendPostRequest } from '../../../api/requestsApi';
import { useSelector } from 'react-redux';
import { PrivateRoutesPath } from '../../../constants/RoutesPath';

const EditCharApart = () => {
   const {
      handleSubmit,
      control,
      watch,
      formState: { errors },
   } = useForm();
   const params = useParams();
   const navigate = useNavigate();
   const { old_name } = qs.parse(window.location.search.substring(1));

   const [fieldsOld, setFieldsOld] = useState({});
   const [listSingle, setListSingle] = useState(false);
   const [listMultiple, setListMultiple] = useState(false);

   const typeWatch = watch('type');

   useEffect(() => {
      getDataRequest(`/admin-api/type/${params.typeId}/show/innerattribute`, { name: old_name }).then(res => {
         if (!res.data) return;
         setFieldsOld(res.data);
      });
   }, []);

   const onSubmitHandler = data => {
      const resData = { ...data, type: data.type.value, typeId: params.typeId, old_name };
      if (listSingle) {
         delete resData['list-multiple-value'];
         resData['list-single-value'] = resData['list-single-value'].replace(/ /g, '');
      }
      if (listMultiple) {
         resData['list-multiple-value'] = resData['list-multiple-value'].replace(/ /g, '');
         delete resData['list-single-value'];
      }

      sendPostRequest(`/admin-api/type/${params.typeId}/update/apartment-attribute`, resData).then(res => {
         navigate(`${PrivateRoutesPath.types.show}${params.typeId}`);
      });
   };

   useEffect(() => {
      setListSingle(false);
      setListMultiple(false);

      if (fieldsOld.type === 'list-single') {
         setListSingle(true);
      }
      if (fieldsOld.type === 'list-multiple') {
         setListMultiple(true);
      }
   }, [fieldsOld]);

   useEffect(() => {
      if (!typeWatch) return;

      setListSingle(false);
      setListMultiple(false);

      if (typeWatch.value === 'list-single') {
         setListSingle(true);
      }
      if (typeWatch.value === 'list-multiple') {
         setListMultiple(true);
      }
   }, [typeWatch]);

   if (!fieldsOld.name) return '';

   return (
      <main className="main">
         <div className="main-wrapper--title">
            <div className="container">
               <ElementTitleSubtitle>
                  Редактировать <span>характеристику квартир жилого комплекса</span>
               </ElementTitleSubtitle>
            </div>
            <div className="mt-6">
               <div className="container">
                  <form onSubmit={handleSubmit(onSubmitHandler)}>
                     <div className="white-block">
                        <h2 className="title-2 mb-6">Параметры</h2>
                        <div className="grid gap-2 grid-cols-3">
                           <ControllerFieldInput
                              control={control}
                              beforeText="Название"
                              name="name"
                              errors={errors}
                              defaultValue={fieldsOld.name.toString() || ''}
                              requiredValue
                           />
                           <ControllerFieldSelect
                              control={control}
                              nameLabel="Тип фильтра"
                              options={selectTypeItems}
                              defaultValue={selectTypeItems.find(item => item.value === fieldsOld.type)}
                              name="type"
                           />
                           <ControllerFieldInput
                              control={control}
                              beforeText="Постфикс (м²,₽,г)"
                              name="postfix"
                              defaultValue={fieldsOld.postfix || ''}
                           />
                        </div>
                        <div className="mt-4">
                           {listSingle && (
                              <ControllerFieldInput
                                 control={control}
                                 beforeText="Значение для единичного  выбора"
                                 name="list-single-value"
                                 defaultValue={fieldsOld['available-values']?.join(', ')}
                              />
                           )}
                           {listMultiple && (
                              <ControllerFieldInput
                                 control={control}
                                 beforeText="Значение для множественного выбора"
                                 name="list-multiple-value"
                                 defaultValue={fieldsOld['available-values']?.join(', ')}
                              />
                           )}
                        </div>
                        <div className="flex items-center gap-6 mt-4">
                           <ControllerFieldCheckbox
                              control={control}
                              option={{ label: 'Обязательно для заполнения' }}
                              name="required-field"
                              defaultValue={fieldsOld['required-field']}
                           />
                           <ControllerFieldCheckbox
                              control={control}
                              option={{ label: 'Показывать в фильтре на сайте' }}
                              name="show-filter-on-site"
                              defaultValue={fieldsOld['show-filter-on-site']}
                           />
                        </div>
                     </div>
                     <Button className="mt-8 w-full">Сохранить</Button>
                  </form>
               </div>
            </div>
         </div>
      </main>
   );
};

export default EditCharApart;
