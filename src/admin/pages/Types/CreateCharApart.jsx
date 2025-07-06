import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { ElementTitleSubtitle } from '../../../ui/Elements';
import { ControllerFieldInput } from '../../../uiForm/ControllerFields/ControllerFieldInput';
import Button from '../../../uiForm/Button';
import { ControllerFieldSelect } from '../../../uiForm/ControllerFields/ControllerFieldSelect';
import { ControllerFieldCheckbox } from '../../../uiForm/ControllerFields/ControllerFieldCheckbox';
import { useNavigate, useParams } from 'react-router-dom';

import selectTypeItems from './selectTypeItems';
import { useSelector } from 'react-redux';
import { sendPostRequest } from '../../../api/requestsApi';
import { PrivateRoutesPath } from '../../../constants/RoutesPath';

const CreateCharApart = () => {
   const {
      handleSubmit,
      control,
      reset,
      watch,
      formState: { errors },
   } = useForm();
   const navigate = useNavigate();
   const params = useParams();

   const [listSingle, setListSingle] = useState(false);
   const [listMultiple, setListMultiple] = useState(false);

   const typeWatch = watch('type');

   const onSubmitHandler = data => {
      const resData = { ...data, type: data.type.value, typeId: params.typeId };

      if (listSingle) {
         delete resData['list-multiple-value'];
         resData['list-single-value'] = resData['list-single-value'].replace(/ /g, '');
      }
      if (listMultiple) {
         resData['list-multiple-value'] = resData['list-multiple-value'].replace(/ /g, '');
         delete resData['list-single-value'];
      }

      sendPostRequest(`/admin-api/type/${params.typeId}/create/apartment-attribute`, resData).then(res => {
         reset();
         navigate(`${PrivateRoutesPath.types.show}${params.typeId}`);
      });
   };

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

   return (
      <main className="main">
         <div className="main-wrapper--title">
            <div className="container">
               <ElementTitleSubtitle>
                  Создать <span>характеристику квартир жилого комплекса</span>
               </ElementTitleSubtitle>
            </div>
            <div className="mt-6">
               <div className="container">
                  <form onSubmit={handleSubmit(onSubmitHandler)}>
                     <div className="white-block">
                        <h2 className="title-2 mb-6">Параметры</h2>
                        <div className="grid gap-2 grid-cols-3">
                           <ControllerFieldInput control={control} beforeText="Название" name="name" requiredValue errors={errors} />
                           <ControllerFieldSelect
                              control={control}
                              nameLabel="Тип фильтра"
                              options={selectTypeItems}
                              defaultValue={selectTypeItems[0]}
                              name="type"
                           />
                           <ControllerFieldInput control={control} beforeText="Постфикс (м²,₽,г)" name="postfix" />
                        </div>
                        <div className="mt-4">
                           {listSingle && (
                              <ControllerFieldInput control={control} beforeText="Значение для единичного  выбора" name="list-single-value" />
                           )}
                           {listMultiple && (
                              <ControllerFieldInput control={control} beforeText="Значение для множественного выбора" name="list-multiple-value" />
                           )}
                        </div>
                        <div className="flex items-center gap-6 mt-4">
                           <ControllerFieldCheckbox control={control} option={{ label: 'Обязательно для заполнения' }} name="required-field" />
                           <ControllerFieldCheckbox
                              control={control}
                              option={{ label: 'Показывать в фильтре на сайте' }}
                              name="show-filter-on-site"
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

export default CreateCharApart;
