import BUILDING_ICON from '../../assets/svg/building.svg';
import HOUSE_ICON from '../../assets/svg/house.svg';

export const PURCHASE_CREATE_TYPES = [
   {
      id: 1,
      image: BUILDING_ICON,
      title: 'Новостройку',
      value: 'buildings',
   },
   {
      id: 2,
      image: HOUSE_ICON,
      title: 'Дома, коттеджи, дачи',
      value: 'houses',
   },
];

export const PURCHASE_CREATE_TYPE_HOUSE = [
   {
      id: 1,
      value: 'any',
      label: 'Любой',
   },
   {
      id: 2,
      value: 'apartment',
      label: 'Квартира',
   },
   {
      id: 3,
      value: 'apartments',
      label: 'Апартаменты',
   },
];

export const PURCHASE_CREATE_NAV_ITEMS = [
   {
      id: 1,
      title: 'Тип недвижимости',
      name: 'type',
      value: false,
   },
   {
      id: 2,
      title: 'Способ покупки и цена',
      name: 'price',
      value: false,
   },
   {
      id: 3,
      title: 'Параметры заявки',
      name: 'parameters',
      value: false,
   },
   {
      id: 4,
      title: 'Описание',
      name: 'descr',
      value: false,
   },
   {
      id: 5,
      title: 'Когда планируете начинать просмотр',
      name: 'start-view',
      value: false,
   },
   {
      id: 6,
      title: 'Ваши контакты',
      name: 'contacts',
      value: false,
   },
];

export const PURCHASE_CREATE_FLOOR_OPTIONS = [
   {
      value: 'not_first',
      label: 'Не первый',
   },
   {
      value: 'not_last',
      label: 'Не последний',
   },
];
