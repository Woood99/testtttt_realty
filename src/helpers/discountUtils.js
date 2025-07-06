import { priceByDiscountApartment } from './priceByDiscountApartment';

const calcDiscount = (discount, price = 1, area = 1) => {
   if (!discount) return null;

   let result;

   if (discount.type === 1) {
      result = price - (price / 100) * discount.value;
   }
   if (discount.type === 2) {
      result = discount.value;
   }

   return result;
};

export const getMaxDiscount = data => {
   const { discounts = [], by_price = 1, by_area = 1 } = data;

   if (discounts.length === 0) {
      return null;
   }

   if (discounts.length === 1) {
      return discounts[0];
   }

   const itemsWithValues = discounts.map(item => ({
      item,
      value: calcDiscount(item, by_price, by_area),
   }));


   const maxValue = Math.max(...itemsWithValues.map(x => x.value));

   return itemsWithValues.find(x => x.value === maxValue)?.item;
};

export const getMinDiscount = () => {};
