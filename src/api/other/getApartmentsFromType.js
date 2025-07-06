import { getDataRequest, sendPostRequest } from '../requestsApi';

export const getApartmentsFromType = async (id, type, per_page = 3) => {
   try {
      if (id && type) {
         const apartments = await getDataRequest(`/api/${type}/${id}/apartments`).then(apartments => {
            return apartments.data;
         });

         const response = (await apartments.length)
            ? sendPostRequest(`/api/apartments`, { ids: apartments, per_page, page: 1 }).then(res => {
                 return res.data;
              })
            : [];

         return {
            data: response,
            apartments,
         };
      }
   } catch (error) {
      console.log(error);
   }
};
