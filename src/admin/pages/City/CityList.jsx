import React, { useEffect, useState } from 'react';
import Button from '../../../uiForm/Button';
import { useSelector } from 'react-redux';
import Modal from '../../../ui/Modal';
import { BtnActionDelete, BtnActionEdit } from '../../../ui/ActionBtns';
import { SecondTableContent, SecondTableHeader } from '../../../ui/SecondTable';
import { CardRowBg } from '../../../ui/CardsRow';
import { Link } from 'react-router-dom';
import { PrivateRoutesPath } from '../../../constants/RoutesPath';
import { getDataRequest } from '../../../api/requestsApi';
import ModalWrapper from '../../../ui/Modal/ModalWrapper';
import { getCitiesSelector } from '../../../redux/helpers/selectors';

const CityList = () => {
  const citiesItems = useSelector(getCitiesSelector);

   const [items, setItems] = useState([]);
   const [confirmDeleteModal, setConfirmDeleteModal] = useState(false);

   useEffect(() => {
      setItems(citiesItems);
   }, [citiesItems]);

   const deleteCityHandler = () => {
      if (!Number(confirmDeleteModal)) return;

      getDataRequest(`admin/cities/delete/${confirmDeleteModal}`).then(res => {
         if (res.data.success) {
            window.location.href = `${PrivateRoutesPath.cities.list}`;
         }
      });
   };

   return (
      <main className="main">
         <div className="main-wrapper--title">
            <div className="container">
               <h2 className="title-2">Города</h2>
            </div>
            <div className="mt-6">
               <div className="container">
                  <SecondTableHeader className="grid-cols-[200px_1fr_max-content]">
                     <span>ID</span>
                     <span>Название</span>
                     <span>Действие</span>
                  </SecondTableHeader>
                  <SecondTableContent className="mt-3 flex flex-col gap-3">
                     {items.map((item, index) => (
                        <CardRowBg key={index} className="grid-cols-[200px_1fr_max-content]">
                           <span>{item.id}</span>
                           <span>{item.name}</span>
                           <div className="flex items-center gap-4">
                              <Link to={`${PrivateRoutesPath.cities.edit}${item.id}`}>
                                 <BtnActionEdit Selector="div" />
                              </Link>
                              <BtnActionDelete onClick={() => setConfirmDeleteModal(item.id)} />
                           </div>
                        </CardRowBg>
                     ))}
                  </SecondTableContent>

                  <Link to={PrivateRoutesPath.cities.create} className="mt-8 w-full">
                     <Button Selector="div">Создать новый город</Button>
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
                        <Button onClick={deleteCityHandler}>Да</Button>
                     </div>
                  </div>
               </Modal>
            </ModalWrapper>
         </div>
      </main>
   );
};

export default CityList;
