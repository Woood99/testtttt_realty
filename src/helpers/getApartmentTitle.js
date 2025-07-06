export const getApartmentTitle = data => {
   return `${data.rooms === 0 ? 'Студия' : `${data.rooms}-ком. квартира`} ${data.area} м²,  ${data.floor}/${data.building_floors} эт.`;
};
