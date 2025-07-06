import { getDataRequest } from './requestsApi';

export const getApartment = async id => {
   try {
      const response = await getDataRequest(`/api/apartment/${id}`);
      return response.data;
   } catch (error) {
      console.log(error);
   }
};
