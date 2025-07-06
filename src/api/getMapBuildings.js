import { getDataRequest } from './requestsApi';

export const getMapBuildings = async (cityName, visibleIds = null) => {
   try {
      const response = await getDataRequest('/api/data-map-buildings', { city: cityName, visibleIds });
      return response.data;
   } catch (error) {
      console.log(error);
   }
};
