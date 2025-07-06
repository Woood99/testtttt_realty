import React, { useEffect, useState } from 'react';
import Modal from '../../../ui/Modal';
import ModalHeader from '../../../ui/Modal/ModalHeader';
import Button from '../../../uiForm/Button';
import { getDataRequest, sendPostRequest } from '../../../api/requestsApi';
import { SpinnerOverlay } from '../../../ui/Spinner';
import CreatePresent from './CreatePresent';
import { PresentCard } from '../../../ui/PresentCard';
import ModalWrapper from '../../../ui/Modal/ModalWrapper';
import EditPresent from './EditPresent';

const PresentsGroup = ({ conditionModal, setModal, defaultValues = null, specialists = [], developer = [] }) => {
   const [isLoading, setIsLoading] = useState(true);
   const [presentsData, setPresentsData] = useState([]);

   const [isOpenModalCreatePresent, setIsOpenModalCreatePresent] = useState(false);
   const [isOpenModalEditPresent, setIsOpenModalEditPresent] = useState(false);

   const optionsStyle = {
      '--modal-space': '40px',
      '--modal-height': 'calc(var(--vh) - 80px)',
      '--modal-width': '1070px',
   };

   useEffect(() => {
      getDataRequest(`/admin-api/group/${defaultValues.id}/gifts`).then(res => {
         setPresentsData(res.data);
         setIsLoading(false);
      });
   }, []);

   const ModalSpinner = () => {
      return (
         <SpinnerOverlay className="absolute inset-0 flex flex-col items-center justify-center" classNameSpinner="!w-[60px] !h-[60px]">
            <span className="mt-8 text-bigSmall">Загрузка...</span>
         </SpinnerOverlay>
      );
   };

   const ModalHeaderLayout = () => {
      return (
         <ModalHeader set={setModal} className="px-10 py-6 mb-8">
            <h2 className="title-2">Подарки группы</h2>
         </ModalHeader>
      );
   };

   const ModalFooterLayout = () => {
      return (
         <div className="px-14 py-6 grid grid-cols-[1fr_max-content] gap-2">
            <Button onClick={() => setIsOpenModalCreatePresent(true)} className="w-full">
               Создать подарок
            </Button>
         </div>
      );
   };

   const deleteCard = id => {
      sendPostRequest(`/admin-api/gift/${id}/delete`).then(res => {
         getDataRequest(`/admin-api/group/${defaultValues.id}/gifts`).then(res => {
            setPresentsData(res.data);
         });
      });
   };

   return (
      <>
         <Modal
            set={setModal}
            options={{ modalClassNames: 'HeaderSticky', modalContentClassNames: 'flex flex-col !py-0 !px-10 md1:!px-4' }}
            condition={conditionModal}
            style={optionsStyle}
            closeBtn={false}
            ModalHeader={ModalHeaderLayout}
            ModalFooter={ModalFooterLayout}
            ModalChildren={isLoading && ModalSpinner}>
            <div className="mb-6">
               {presentsData.length ? (
                  <div className="grid grid-cols-2 gap-4">
                     {presentsData.map((item, index) => {
                        return (
                           <PresentCard
                              {...item}
                              deleteCard={() => deleteCard(item.id)}
                              editCard={() => setIsOpenModalEditPresent(item)}
                              key={index}
                              controls
                           />
                        );
                     })}
                  </div>
               ) : (
                  <span className="text-primary400">Вы пока не добавили ни одного подарка</span>
               )}
            </div>
         </Modal>

         <ModalWrapper condition={isOpenModalCreatePresent}>
            <CreatePresent
               conditionModal={isOpenModalCreatePresent}
               setModal={setIsOpenModalCreatePresent}
               groupData={defaultValues}
               fetchData={() => {
                  getDataRequest(`/admin-api/group/${defaultValues.id}/gifts`).then(res => {
                     setPresentsData(res.data);
                     setIsOpenModalCreatePresent(false);
                  });
               }}
               specialists={specialists}
               developer={developer}
               firstPresent={presentsData[0]}
            />
         </ModalWrapper>
         <ModalWrapper condition={isOpenModalEditPresent}>
            <EditPresent
               conditionModal={isOpenModalEditPresent !== false}
               setModal={setIsOpenModalEditPresent}
               groupData={defaultValues}
               fetchData={() => {
                  getDataRequest(`/admin-api/group/${defaultValues.id}/gifts`).then(res => {
                     setPresentsData(res.data);
                     setIsOpenModalEditPresent(false);
                  });
               }}
               specialists={specialists}
               developer={developer}
               defaultValues={isOpenModalEditPresent}
            />
         </ModalWrapper>
      </>
   );
};

export default PresentsGroup;


