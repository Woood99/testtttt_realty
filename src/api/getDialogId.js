import { RoutesPath } from '../constants/RoutesPath';
import { openUrl } from '../helpers/openUrl';
import { sendPostRequest } from './requestsApi';

export const getDialogId = async (data, setError) => {
   try {
      return sendPostRequest('/api/dialogs/get-dialog-id', data).then(res => res.data.result);
   } catch (error) {
      if (setError) {
         setError(true);
      }
      throw new Error('error');
   }
};

export const checkDialogId = async (data, setError) => {
   try {
      return await sendPostRequest('/api/dialogs/check-dialog', data).then(res => res.data.result);
   } catch (error) {
      if (setError) {
         setError(true);
      }
      throw new Error('error');
   }
};

export const getUrlNavigateToChatDialog = (id, tag, call) => {
   openUrl(`${RoutesPath.chat}?dialog=${id}${tag ? '&tag=' + tag : ''}${call ? '&call=1' : ''}`);
};

export const getUrlNavigateToChatDialogFake = options => {
   const { recipients_id = '', building_id = '', organization_id = '', tag = '' } = options;
   const params = {
      recipients_id,
      building_id,
      organization_id,
      tag,
   };

   const filteredParams = Object.fromEntries(Object.entries(params).filter(([_, value]) => value !== ''));
   openUrl(`${RoutesPath.chat}?not_dialog=1&${new URLSearchParams(filteredParams).toString()}`);
};
