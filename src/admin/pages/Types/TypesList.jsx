import React, { useEffect, useState } from 'react';
import { SecondTableContent, SecondTableHeader } from '../../../ui/SecondTable';
import { CardRowBg } from '../../../ui/CardsRow';
import { BtnActionDelete, BtnActionLook } from '../../../ui/ActionBtns';
import Button from '../../../uiForm/Button';
import { Link } from 'react-router-dom';
import { PrivateRoutesPath } from '../../../constants/RoutesPath';
import { useSelector } from 'react-redux';
import { getDataRequest, sendPostRequest } from '../../../api/requestsApi';
import Modal from '../../../ui/Modal';
import ModalWrapper from '../../../ui/Modal/ModalWrapper';

const TypesList = () => {
   const [typeItems, setTypeItems] = useState([]);
   const [confirmDeleteModal, setConfirmDeleteModal] = useState(false);

   const deleteTypeHandler = () => {
      if (!Number(confirmDeleteModal)) return;
      sendPostRequest(`/admin-api/types/delete/${confirmDeleteModal}`).then(res => {
         window.location.reload();
      });
   };

   useEffect(() => {
      getDataRequest('/api/object-types').then(res => {
         if (!res.data) return;
         setTypeItems(res.data);
      });
   }, []);

   return (
      <>
         <main className="main">
            <div className="main-wrapper--title">
               <div className="container">
                  <h2 className="title-2">Типы объектов</h2>
               </div>
               <div className="mt-6">
                  <div className="container">
                     <div>
                        <SecondTableHeader className="grid-cols-[200px_1fr_max-content]">
                           <span>Порядок</span>
                           <span>Название</span>
                           <span>Действие</span>
                        </SecondTableHeader>
                        <SecondTableContent className="mt-3 flex flex-col gap-3">
                           {typeItems.map((item, index) => {
                              return (
                                 <CardRowBg key={index} className="grid-cols-[200px_1fr_max-content]">
                                    <span>{item.id}</span>
                                    <span>{item.name}</span>
                                    <div className="flex items-center gap-4">
                                       <Link to={`${PrivateRoutesPath.types.show}${item.id}`}>
                                          <BtnActionLook Selector="div" />
                                       </Link>
                                       <BtnActionDelete onClick={() => setConfirmDeleteModal(item.id)} />
                                    </div>
                                 </CardRowBg>
                              );
                           })}
                        </SecondTableContent>
                     </div>
                     <Link to={PrivateRoutesPath.types.create} className="mt-8 w-full">
                        <Button Selector="div">Создать тип объекта</Button>
                     </Link>
                  </div>
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
                        <Button onClick={deleteTypeHandler}>Да</Button>
                     </div>
                  </div>
               </Modal>
            </ModalWrapper>
         </main>
      </>
   );
};

export default TypesList;
