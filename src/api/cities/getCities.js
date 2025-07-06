import { getDataRequest } from '../requestsApi';

export const getCities = async () => {
   try {
      const response = await getDataRequest('/api/cities');
      return response.data;
   } catch (error) {
      console.log(error);
   }
};
