import React from 'react';

import ModalWrapper from '../../ui/Modal/ModalWrapper';
import { LoginPhoneModal } from '../../pages/LoginPhone';

const SelectAccLogModal = ({ condition, set }) => {
   return (
      <ModalWrapper condition={condition}>
         <LoginPhoneModal condition={condition} set={set} />
      </ModalWrapper>
   );
};

export default SelectAccLogModal;
