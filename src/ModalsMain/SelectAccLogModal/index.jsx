import React, { useState } from 'react';

import Modal from '../../ui/Modal';

import styles from './SelectAccLogModal.module.scss';
import Button from '../../uiForm/Button';
import ModalWrapper from '../../ui/Modal/ModalWrapper';
import { LoginPhoneModal } from '../../pages/LoginPhone';
import { RoutesPath } from '../../constants/RoutesPath';

const SelectAccLogModal = ({ condition, set }) => {
   const [popupLoginPhoneOpen, setPopupLoginPhoneOpen] = useState(false);

   return (
      <>
         {/* <ModalWrapper condition={condition}>
            <Modal options={{ overlayClassNames: '_right', modalClassNames: styles.root }} set={set} condition={condition}>
               <h2 className="title-2 modal-title-gap text-center">Войти в аккаунт</h2>
               <Button
                  variant="secondary"
                  size="Big"
                  className="w-full"
                  onClick={() => {
                     set(false);
                     if (window.location.pathname !== RoutesPath.loginPhone) {
                        setPopupLoginPhoneOpen(true);
                     }
                  }}>
                  Войти по номеру телефона
               </Button>
            </Modal>
         </ModalWrapper> */}
         <ModalWrapper condition={condition}>
            <LoginPhoneModal condition={condition} set={set} />
         </ModalWrapper>
      </>
   );
};

export default SelectAccLogModal;
