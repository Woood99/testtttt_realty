import { AuthRoutesPath } from '../constants/RoutesPath';
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

export const getUrlNavigateToChat = () => {
   window.open(AuthRoutesPath.chat, '_blank');
};

export const getUrlNavigateToChatDialog = (id, tag, call) => {
   window.open(`${AuthRoutesPath.chat}?dialog=${id}${tag ? '&tag=' + tag : ''}${call ? '&call=1' : ''}`, '_blank');
};

export const getUrlNavigateToChatDialogFake = options => {
   const { recipients_id = '', building_id = '', organization_id = '', call = '', tag = '' } = options;
   const params = {
      recipients_id,
      building_id,
      organization_id,
      call: call ? 1 : '',
      tag,
   };

   const filteredParams = Object.fromEntries(Object.entries(params).filter(([_, value]) => value !== ''));

   window.open(`${AuthRoutesPath.chat}?not_dialog=1&${new URLSearchParams(filteredParams).toString()}`, '_blank');
};
