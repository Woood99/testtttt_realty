import { sendPostRequest } from '../../../api/requestsApi';

const getApartmentsPlayer = (params = {}) => {
   const structureApartData = data => {
      return {
         pages: data.pages,
         total: data.total,
         items: data.items.map(item => {
            return {
               ...item,
               title: `${item.rooms === 0 ? 'Студия' : `${item.rooms}-комн.`} ${item.area} м²,  ${item.floor}/${item.building_floors} эт.`,
            };
         }),
      };
   };

   return sendPostRequest('/api/apartments', { sort: 'priceAsc', ...params }).then(res => structureApartData(res.data));
};

export default getApartmentsPlayer;
