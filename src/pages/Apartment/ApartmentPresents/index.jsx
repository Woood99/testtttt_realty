import React, { useState } from 'react';
import { useApartmentPresents } from './useApartmentPresents';
import ApartmentPresentsBody from './ApartmentPresentsBody';
import ModalWrapper from '../../../ui/Modal/ModalWrapper';
import Modal from '../../../ui/Modal';

import ApartmentPresentsSidebar from './ApartmentPresentsSidebar';

const ApartmentPresents = ({ data, mainGift = [], secondGift = [] }) => {
   const { onChangeHandler, selector } = useApartmentPresents({ data, mainGift, secondGift });
   const [openModal, setOpenModal] = useState(false);

   return (
      <>
         <ApartmentPresentsBody options={{ onChangeHandler, selector, setOpenModal, mainGift, secondGift }} />
         <ModalWrapper condition={openModal}>
            <Modal
               condition={openModal}
               set={setOpenModal}
               options={{ overlayClassNames: '_center-max-content', modalClassNames: '!w-[1200px]', modalContentClassNames: '!px-10' }}>
               <div className="grid grid-cols-[1fr_300px] gap-x-6">
                  <ApartmentPresentsBody type="modal" options={{ onChangeHandler, selector, mainGift, secondGift }} />
                  <ApartmentPresentsSidebar selector={selector} />
               </div>
            </Modal>
         </ModalWrapper>
      </>
   );
};

export default ApartmentPresents;
