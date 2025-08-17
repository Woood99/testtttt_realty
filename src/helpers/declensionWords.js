import plural from 'plural-ru';
import numberReplace from './numberReplace';

export const declensionWords = (value, arr, numberRepl = false) => {
   const result = plural(numberRepl ? numberReplace(value || 0) : value || 0, ...arr.map(item => `%d ${item}`));
   return result;
};

export const declensionWordsYear = value => {
   return declensionWords(value, ['год', 'года', 'лет']);
};
export const declensionWordsDays = value => {
   return declensionWords(value, ['день', 'дня', 'дней']);
};

export const declensionWordsSpecialist = value => {
   return declensionWords(value, ['менеджер', 'менеджера', 'менеджеров'], true);
};

export const declensionWordsOffer = value => {
   return declensionWords(value, ['предложение', 'предложения', 'предложений'], true);
};

export const declensionBuilding = value => {
   return declensionWords(value, ['новостройку', 'новостройки', 'новостроек'], true);
};

export const declensionWordsPurchaseRequests = value => {
   return declensionWords(value, ['заявка', 'заявки', 'заявок'], true);
};

export const declensionWordsMessage = value => {
   return declensionWords(value, ['сообщение', 'сообщения', 'сообщений'], true);
};

export const declensionWordsHouse = value => {
   return declensionWords(value, ['дом', 'дома', 'домов'], true);
};

export const declensionPinMessages = value => {
   return declensionWords(value, ['закреплённое сообщение', 'закреплённых сообщения', 'закреплённых сообщения'], true);
};

export const declensionParticipant = value => {
   return declensionWords(value, ['участник', 'участника', 'участников'], true);
};

export const declensionComments = value => {
   return declensionWords(value, ['комментарий', 'комментария', 'комментариев'], true);
};

export const declensionView = value => {
   return declensionWords(value, ['просмотр', 'просмотра', 'просмотров'], true);
};

export const declensionPlannings = value => {
   return declensionWords(value, ['планировка', 'планировки', 'планировок'], true);
};

export const declensionApartments = value => {
   return declensionWords(value, ['квартира', 'квартиры', 'квартир'], true);
};

export const declensionWordsName = (value = '', data = {}, type = 0) => {
   if (!value) return;

   const currentData = data[value.toLowerCase()];
   if (currentData) {
      return currentData[type];
   } else {
      return value;
   }
};
