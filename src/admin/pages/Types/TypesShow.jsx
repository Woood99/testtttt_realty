import React, { useEffect, useState } from 'react';
import { ElementTitleSubtitle } from '../../../ui/Elements';
import BtnBlue from '../../../ui/BtnBlue';
import Button from '../../../uiForm/Button';
import TabsControls from '../../../ui/Tabs/TabsControls';
import { SecondTableContent, SecondTableHeader } from '../../../ui/SecondTable';
import { CardRowBg } from '../../../ui/CardsRow';
import { BtnActionDelete, BtnActionEdit } from '../../../ui/ActionBtns';
import { Link, useNavigate, useParams } from 'react-router-dom';
import TabsControlsFieldBlock from '../../TabsControlsFieldBlock';
import { useSelector } from 'react-redux';
import { getDataRequest, sendPostRequest } from '../../../api/requestsApi';

const emptyField = {
   name: '',
   necessarily: false,
   items: [],
};

const TypesShow = () => {
   const params = useParams();
   const navigate = useNavigate();

   const [attributeComplex, setAttributeComplex] = useState([]);
   const [attributeInner, setAttributeInner] = useState([]);

   useEffect(() => {
      getDataRequest(`/api/type/${params.id}`).then(res => {
         if (!res.data) return;
         setAttributeComplex(res.data.attributeComplex);
         setAttributeInner(res.data.attributeInner);
      });
   }, []);

   const structureDataTabs = data => {
      return {
         id: data.id,
         name: data.name,
         necessarily: data.necessarily,
         body: (
            <div>
               <SecondTableHeader className="grid-cols-[120px_200px_180px_250px_1fr_max-content]">
                  <span>Порядок</span>
                  <span>Название</span>
                  <span>Тип</span>
                  <span>Показывать в фильтре</span>
                  <span>Обязательное</span>
                  <span>Действие</span>
               </SecondTableHeader>
               <SecondTableContent className="mt-3 flex flex-col gap-3">
                  {data.items.map((card, index) => {
                     return (
                        <CardRowBg key={index} className="grid-cols-[120px_200px_180px_250px_1fr_max-content]">
                           <span>{card.order}</span>
                           <span>{card.name}</span>
                           <span>{card.type}</span>
                           <span>{card.showInFilter ? 'Да' : 'Нет'}</span>
                           <span>{card.necessarily ? 'Да' : 'Нет'}</span>
                           <div className="flex items-center gap-4">
                              <BtnActionEdit
                                 onClick={() => {
                                    sendPostRequest(`/admin-api/type/${params.id}`, { attributeComplex, attributeInner }).then(res => {
                                       navigate(`/admin/type/${params.id}/edit/attribute?tabId=${data.id}&old_name=${card.name}`);
                                    });
                                 }}
                              />
                              <BtnActionDelete
                                 onClick={() => {
                                    getDataRequest(`/admin-api/type/${params.id}/delete/attribute`, { name: card.name }).then(() => {
                                       window.location.reload();
                                    });
                                 }}
                              />
                           </div>
                        </CardRowBg>
                     );
                  })}
                  <Link to={`/admin/type/${params.id}/add/attribute/${data.id}`} className="mt-8 w-full">
                     <Button Selector="div">Создать характеристику жилого комплекса</Button>
                  </Link>
               </SecondTableContent>
            </div>
         ),
      };
   };

   const onSubmitHandler = (attributeComplexData = null) => {
      const resData = { attributeComplex: attributeComplexData || attributeComplex, attributeInner };
      console.log(resData);

      sendPostRequest(`/admin-api/type/${params.id}`, resData);
   };

   return (
      <main className="main">
         <div className="main-wrapper--title">
            <div className="container">
               <ElementTitleSubtitle>
                  Просмотр <span>типы объектов</span>
               </ElementTitleSubtitle>
            </div>
            <div className="mt-6">
               <div className="container">
                  <div className="white-block">
                     <TabsControlsFieldBlock
                        data={attributeComplex}
                        setData={setAttributeComplex}
                        structureTabs={structureDataTabs}
                        emptyField={emptyField}
                        title="Характеристики жилого комплекса"
                        onChangeParams={{ name: 'attribute' }}
                        onSubmit={onSubmitHandler}
                     />
                  </div>
                  <div className="white-block mt-4">
                     <h3 className="title-2">Характеристики квартир жилого комплекса</h3>
                     <div className="mt-6">
                        <SecondTableHeader className="grid-cols-[120px_200px_180px_250px_1fr_max-content]">
                           <span>Порядок</span>
                           <span>Название</span>
                           <span>Тип</span>
                           <span>Показывать в фильтре</span>
                           <span>Обязательное</span>
                           <span>Действие</span>
                        </SecondTableHeader>
                        <SecondTableContent className="mt-3 flex flex-col gap-3">
                           {attributeInner.map((card, index) => {
                              return (
                                 <CardRowBg key={index} className="grid-cols-[120px_200px_180px_250px_1fr_max-content]">
                                    <span>{card.order}</span>
                                    <span>{card.name}</span>
                                    <span>{card.type}</span>
                                    <span>{card.showInFilter ? 'Да' : 'Нет'}</span>
                                    <span>{card.necessarily ? 'Да' : 'Нет'}</span>
                                    <div className="flex items-center gap-4">
                                       <BtnActionEdit
                                          onClick={() => {
                                             sendPostRequest(`/admin-api/type/${params.id}`, { attributeComplex, attributeInner }).then(res => {
                                                navigate(`/admin/type/${params.id}/edit/innerattribute?old_name=${card.name}`);
                                             });
                                          }}
                                       />
                                       <BtnActionDelete
                                          onClick={() => {
                                             getDataRequest(`/admin-api/type/${params.id}/delete/innerattribute`, { name: card.name }).then(() => {
                                                window.location.reload();
                                             });
                                          }}
                                       />
                                    </div>
                                 </CardRowBg>
                              );
                           })}
                           <Link to={`/admin/type/${params.id}/add/innerattribute`} className="mt-8 w-full">
                              <Button Selector="div">Создать характеристику квартир жилого комплекса</Button>
                           </Link>
                        </SecondTableContent>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </main>
   );
};

export default TypesShow;
