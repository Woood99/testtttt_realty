import { sendPostRequest } from './requestsApi';

export const recordViewPost = async (data, type, id) => {
   try {
      return sendPostRequest(`/api/apply/${type}/${id}`, data);
   } catch (error) {
      console.log(error);
   }
};

export default recordViewPost;
