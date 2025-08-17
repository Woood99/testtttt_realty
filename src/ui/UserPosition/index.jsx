import { ROLE_ADMIN, ROLE_BUYER, ROLE_SELLER, ROLES } from '../../constants/roles';

const UserPosition = ({ role = 1, buildingName = '' }) => {
   const currentRole = ROLES.find(item => item.id === role);
   if (!currentRole) return;
   if (currentRole.id === ROLE_ADMIN.id) {
      return 'Застройщик';
   }
   if (currentRole.id === ROLE_SELLER.id) {
      return `Менеджер${buildingName ? ` отдела продаж ${buildingName}` : ''}`;
   }
   if (currentRole.id === ROLE_BUYER.id) {
      return `Покупатель`;
   }
};

export default UserPosition;
