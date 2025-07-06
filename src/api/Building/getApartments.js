import { getDataRequest } from '../requestsApi';

export const getApartments = async (id, data) => {
   try {
      const response = await getDataRequest(`/api/building/${id}/apartments`, data);
      return response.data;
   } catch (error) {
      console.log(error);
   }
};
