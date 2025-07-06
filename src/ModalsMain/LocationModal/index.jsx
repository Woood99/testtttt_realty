import React from 'react';
import ModalWrapper from '../../ui/Modal/ModalWrapper';
import BuildingMap from '../../pages/Building/BuildingMap';
import Modal from '../../ui/Modal';
import { useSelector } from 'react-redux';
import { getIsDesktop } from '../../redux/helpers/selectors';

const LocationModal = ({ condition, set, zoom = 15, geo = [] }) => {
  const isDesktop = useSelector(getIsDesktop);

   return (
      <ModalWrapper condition={condition} set={set}>
         <Modal
            condition={condition}
            set={set}
            closeBtn={isDesktop}
            options={{ modalContentClassNames: '!px-6 !pb-6 mmd1:max-h-[90vh] md1:!p-0', modalClassNames: 'mmd1:max-h-[90vh]' }}
            style={{
               '--modal-height': isDesktop ? '900px' : '100%',
               '--modal-width': '1200px',
            }}>
            <BuildingMap
               coordinates={geo}
               variant="default"
               zoom={zoom}
               onClose={() => {
                  if (!isDesktop) {
                     set(false);
                  }
               }}
            />
         </Modal>
      </ModalWrapper>
   );
};

export default LocationModal;
