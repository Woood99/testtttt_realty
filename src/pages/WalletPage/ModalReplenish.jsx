import { useState } from 'react';
import { IconPlus } from '../../ui/Icons';
import Modal from '../../ui/Modal';
import ModalWrapper from '../../ui/Modal/ModalWrapper';
import AddBankCardModal from './AddBankCardModal';

const ModalReplenish = ({ condition, set }) => {
   const [bankCardModalIsOpen, setBankCardModalIsOpen] = useState(false);

   return (
      <>
         <ModalWrapper condition={condition}>
            <Modal
               condition={condition}
               set={set}
               options={{
                  overlayClassNames: '_center-max-content',
                  modalClassNames: '!w-[560px]',
                  modalContentClassNames: 'text-left',
               }}>
               <h2 className="title-2 mb-6">Пополнить</h2>
               <div className="grid grid-cols-3 gap-3">
                  <button
                     type="button"
                     className="border border-solid border-primary700 h-[100px] rounded-xl flex flex-col items-start text-left p-3 hover:bg-primary800"
                     onClick={() => {
                        setBankCardModalIsOpen(true);
                        set(false);
                     }}>
                     <div className="flex-center-all bg-pageColor w-9 h-6 rounded-md">
                        <IconPlus className="stroke-graySecond" />
                     </div>
                     <p className="text-defaultMax mt-2 ">
                        Добавить <br /> карту
                     </p>
                  </button>
               </div>
            </Modal>
         </ModalWrapper>

         <AddBankCardModal condition={bankCardModalIsOpen} set={setBankCardModalIsOpen} />
      </>
   );
};

export default ModalReplenish;
