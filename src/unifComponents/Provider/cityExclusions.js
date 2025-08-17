export const cityExclusionsBuyer = cities => {
   return cities.filter(
      city =>
         city.name !== 'Краснодарский край' &&
         city.name !== 'Москва' &&
         city.name !== 'Анапа' &&
         city.name !== 'Туапсе' &&
         city.name !== 'Новороссийск' &&
         city.name !== 'Ростов-на-Дону'
   );
};

export const cityExclusionsSeller = (cities, userInfo) => {
   return cities.filter(city => userInfo.cities.includes(city.id));
};
