export const joinCardsAndPromo = (cards = [], promo = []) => {
   const promos = promo.map(item => {
      return {
         ...item,
         type: 'promo',
      };
   });
   cards.splice(4, 0, promos[0]);
   cards.splice(13, 0, promos[1]);
   return cards.filter(item => Boolean(item));
};
