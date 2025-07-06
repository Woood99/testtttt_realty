import { getDataRequest } from '../requestsApi';

export const getSpecialists = async id => {
   try {
      const response = await getDataRequest(`/api/building/${id}/specialists`);
      return response.data;
   } catch (error) {
      console.log(error);
   }
};

export const getSpecialistsOrganization = async id => {
   try {
      const response = await getDataRequest(`/api/organization/${id}/specialists`);
      return response.data;
   } catch (error) {
      console.log(error);
   }
};
