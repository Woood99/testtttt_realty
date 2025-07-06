import axios from 'axios';
import { BASE_URL } from '../../constants/api';

export const getSimilar = async id => {
   try {
      const response = await axios.get(`${BASE_URL}/api/building/${id}/similar`);
      return response.data;
   } catch (error) {
      console.log(error);
   }
};
