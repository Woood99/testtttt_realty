import { BASE_URL } from '../constants/api';
import axios from 'axios';
import { Cookies } from 'react-cookie';

const cookies = new Cookies();

export const instance = axios.create({
   withCredentials: true,
   baseURL: BASE_URL,
   headers: {
      'Content-Type': 'application/json',
   },
});

export const sendPostRequest = async (endpoint, data = {}, headersAttr = {}) => {
   try {
      const token = cookies.get('access_token') || '';
      
      const response = await instance.post(endpoint, data, {
         headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${token}`,
            ...headersAttr,
         },
      });

      return response;
   } catch (error) {
      throw error;
   }
};

export const sendPutRequest = async (endpoint, data, headersAttr = {}) => {
   try {
      const token = cookies.get('access_token') || '';
      const response = await instance.put(endpoint, data, {
         headers: {
            Authorization: `Bearer ${token}`,
            ...headersAttr,
         },
      });

      return response;
   } catch (error) {
      throw error;
   }
};

export const deleteRequest = async endpoint => {
   try {
      const token = cookies.get('access_token') || '';
      const response = await instance.delete(endpoint, {
         headers: {
            Authorization: `Bearer ${token}`,
         },
      });

      return response;
   } catch (error) {
      throw error;
   }
};

export const getDataRequest = async (endpoint, data = '') => {
   try {
      const token = cookies.get('access_token') || '';

      const response = await instance.get(endpoint, {
         params: data,
         headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${token}`,
         },
      });

      return response;
   } catch (error) {
      throw error;
   }
};
