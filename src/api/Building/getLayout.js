import { getDataRequest } from '../requestsApi';

export const getLayout = async (id, data) => {
   try {
      const response = await getDataRequest(`/api/building/${id}/layout`, data);
      return response.data;
   } catch (error) {
      console.log(error);
   }
};
