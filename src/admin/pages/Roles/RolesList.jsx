import React, { useState } from 'react';
import { SecondTableContent, SecondTableHeader } from '../../../ui/SecondTable';
import { PrivateRoutesPath } from '../../../constants/RoutesPath';
import Button from '../../../uiForm/Button';
import { Link } from 'react-router-dom';
import Modal from '../../../ui/Modal';
import { BtnActionDelete } from '../../../ui/ActionBtns';
import { CardRowBg } from '../../../ui/CardsRow';
import ModalWrapper from '../../../ui/Modal/ModalWrapper';

export const rolesItems = [
   {
      id: 1,
      value: 'buyer',
      name: 'Покупатель',
      quantity: 4,
   },
   {
      id: 2,
      value: 'seller',
      name: 'Продавец',
      quantity: 1,
   },
];

const RolesList = () => {
   const [confirmDeleteModal, setConfirmDeleteModal] = useState(false);

   const deleteRoleHandler = () => {
      if (!Number(confirmDeleteModal)) return;
      console.log(confirmDeleteModal);
   };

   return (
      <main className="main mt-6">
         <div className="container">
            <h2 className="title-2">Группы</h2>
         </div>
         <div className="bg-pageColor pt-4 mt-6 pb-6">
            <div className="container">
               <div>
                  <SecondTableHeader className="grid-cols-[300px_1fr_max-content]">
                     <span>Роль</span>
                     <span>Количество</span>
                     <span>Действие</span>
                  </SecondTableHeader>
                  <SecondTableContent className="mt-3 flex flex-col gap-3">
                     {rolesItems.map((item, index) => {
                        return (
                           <CardRowBg key={index} className="grid-cols-[300px_1fr_max-content]">
                              <span>{item.name}</span>
                              <span>{item.quantity}</span>
                              <BtnActionDelete onClick={() => setConfirmDeleteModal(item.id)} />
                           </CardRowBg>
                        );
                     })}
                  </SecondTableContent>
               </div>
               <Link to={'#'} className="mt-8 w-full">
                  <Button Selector="div">Создать новую роль</Button>
               </Link>
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
                     <Button onClick={deleteRoleHandler}>Да</Button>
                  </div>
               </div>
            </Modal>
         </ModalWrapper>
      </main>
   );
};

export default RolesList;
