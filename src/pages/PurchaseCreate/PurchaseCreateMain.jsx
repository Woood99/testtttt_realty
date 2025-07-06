import React, { useContext } from 'react';
import { PurchaseCreateContext } from '../../context';
import ModalWrapper from '../../ui/Modal/ModalWrapper';
import Modal from '../../ui/Modal';
import Button from '../../uiForm/Button';
import { IconArrow } from '../../ui/Icons';
import ModalHeader from '../../ui/Modal/ModalHeader';

const PurchaseCreateMain = () => {
   const { typeActiveId, modalOpen, setModalOpen, stages, currentStage, setCurrentStage } = useContext(PurchaseCreateContext);

   return (
      <section className="flex flex-col gap-3 min-w-0">
         {!modalOpen && (
            <>
               <div className="white-block">{stages.find(item => item.id === 0).body}</div>
               {typeActiveId === 1 && (
                  <>
                     {stages.map(item => {
                        if (item.id !== 0) {
                           return (
                              <div className="white-block" key={item.id}>
                                 {item.body}
                              </div>
                           );
                        }
                     })}
                  </>
               )}
            </>
         )}

         <ModalWrapper condition={modalOpen}>
            <Modal
               condition={modalOpen}
               set={setModalOpen}
               usePortal={false}
               closeBtn={false}
               options={{ modalClassNames: 'HeaderSticky', overlayClassNames: '_full', modalContentClassNames: '!py-0 !px-4' }}
               ModalHeader={() => (
                  <ModalHeader set={setModalOpen} className="px-8 py-6 mb-8 md1:px-4 md1:py-4 md1:mb-6">
                     {currentStage >= 1 ? (
                        <button type="button" onClick={() => setCurrentStage(prev => prev - 1)}>
                           <IconArrow className="rotate-180" width={26} height={26} />
                        </button>
                     ) : (
                        <span />
                     )}
                  </ModalHeader>
               )}
               ModalFooter={() => (
                  <div className="ModalFooter">
                     {currentStage >= 8 && (
                        <Button type="button" variant="secondary" className="w-full" onClick={()=>setModalOpen(false)}>
                           Проверить
                        </Button>
                     )}
                     <Button className="w-full">{currentStage >= 8 ? 'Разместить' : 'Продолжить'}</Button>
                  </div>
               )}>
               {stages.map(item => {
                  if (item.id === currentStage) {
                     return <div key={item.id}>{item.body}</div>;
                  }
               })}
            </Modal>
         </ModalWrapper>
      </section>
   );
};

export default PurchaseCreateMain;
