import React from 'react';
import Modal from '../../ui/Modal';
import ModalWrapper from '../../ui/Modal/ModalWrapper';
import BuildingSpecialists from '../../pages/Building/BuildingSpecialists';

const ChoiceSpecialistForChat = ({ condition, set, specialists = [], building_id, title = null, descr = null, toChat = false, toCall = false }) => {
   if (specialists.length > 0) {
      return (
         <ModalWrapper condition={condition}>
            <Modal
               condition={Boolean(condition)}
               set={set}
               options={{ overlayClassNames: '_center-max-content', modalClassNames: '!w-[800px]', modalContentClassNames: '!p-8' }}>
               <BuildingSpecialists
                  specialists={specialists}
                  building_id={building_id}
                  title={title}
                  descr={descr}
                  block={false}
                  toChat={toChat}
                  toCall={toCall}
               />
            </Modal>
         </ModalWrapper>
      );
   }
};

export default ChoiceSpecialistForChat;
