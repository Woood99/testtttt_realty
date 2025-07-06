import { getDataRequest } from './requestsApi';

export const getBuilding = async id => {
   try {
      const response = await getDataRequest(`/api/building/${id}`);
      return response.data;
   } catch (error) {
      return error;
   }
};
