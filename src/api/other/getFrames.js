import { getDataRequest } from '../requestsApi';

export const getFrames = async id => {
   try {
      const response = await getDataRequest(`/api/building/${id}/frames`);
      if (!response.data) return;

      const arrayOfObjects = Object.keys(response.data).map(key => {
         const item = response.data[key];
         return {
            label: item,
            value: item,
         };
      });
      return arrayOfObjects;
   } catch (error) {
      console.log(error);
   }
};
