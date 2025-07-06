import { useContext } from 'react';
import { BuildingContext, ChatContext } from '../../../../context';
import Modal from '../../../../ui/Modal';
import BuildingApartments from '../../../../pages/Building/BuildingApartments';

const ChatApartmentsByBuilding = () => {
   const { apartmentsByBuildingModal, setApartmentsByBuildingModal, dialogBuilding } = useContext(ChatContext);

   return (
      <Modal
         condition={apartmentsByBuildingModal}
         set={setApartmentsByBuildingModal}
         options={{ overlayClassNames: '_full', modalContentClassNames: '!p-8 md1:!px-0 bg-[red] !bg-pageColor' }}>
         <BuildingContext.Provider value={{ id: dialogBuilding.id }}>
            <BuildingApartments className="container" variant="mini" />
         </BuildingContext.Provider>
      </Modal>
   );
};

export default ChatApartmentsByBuilding;
