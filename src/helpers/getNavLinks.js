const links = [
   {
      id: 'section-apartments-id',
      label: 'Квартиры',
   },
   {
      id: 'section-promo-id',
      label: 'Скидки',
   },
   {
      id: 'section-video-id',
      label: 'Видео',
   },
   {
      id: 'section-descr-id',
      label: 'Описание',
   },
   {
      id: 'section-apartRenov-id',
      label: 'Отделка квартир',
   },
   {
      id: 'section-location-id',
      label: 'Расположение',
   },
   {
      id: 'section-ecologyParks-id',
      label: 'Экология и парки',
   },
   {
      id: 'section-constPrgs-id',
      label: 'Ход строительства',
   },
];

const getNavLinks = () => {
   return links.filter(item => document.querySelector(`#${item.id}`));
};

export default getNavLinks;
