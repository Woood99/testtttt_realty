export const priceByDiscountApartment = (buildingDiscount, priceApartment, area = 1) => {
   if (!buildingDiscount) return null;

   let result;

   if (buildingDiscount.type === 1) {
      result = priceApartment - (priceApartment / 100) * buildingDiscount.value;
   }

   if (buildingDiscount.type === 2) {
      const pricePerSqm = priceApartment / area;

      if (buildingDiscount.unit === 2) {
         result = (pricePerSqm - buildingDiscount.value) * area;
      } else {
         result = priceApartment - buildingDiscount.value;
      }
   }

   return result;
};
