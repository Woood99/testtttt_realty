import { AuthRoutesPath, RoutesPath } from '../../../constants/RoutesPath';

import HOME_NAV_1 from '../../../assets/img/home-nav/home-nav-1.png';
import HOME_NAV_2 from '../../../assets/img/home-nav/home-nav-2.webp';
import HOME_NAV_3 from '../../../assets/img/home-nav/home-nav-3.png';
import HOME_NAV_4 from '../../../assets/img/home-nav/home-nav-4.png';
import HOME_NAV_5 from '../../../assets/img/home-nav/home-nav-5.png';
import HOME_NAV_6 from '../../../assets/img/home-nav/home-nav-6.png';
import HOME_NAV_7 from '../../../assets/img/home-nav/home-nav-7.png';
import HOME_NAV_8 from '../../../assets/img/home-nav/home-nav-8.png';

export const HOME_NAV = [
   {
      name: 'Новостройки',
      link: RoutesPath.listing,
      image: HOME_NAV_1,
   },
   {
      name: 'Чат',
      link: RoutesPath.chat,
      image: HOME_NAV_7,
   },
   {
      name: 'Скидки и подарки',
      link: RoutesPath.feedPromos,
      image: HOME_NAV_5,
   },
   {
      name: 'Видео и Клипы',
      link: RoutesPath.feedVideos,
      image: HOME_NAV_6,
   },
   {
      name: 'Застройщики',
      link: RoutesPath.developers.list,
      image: HOME_NAV_2,
   },
   {
      name: 'Менеджеры',
      link: RoutesPath.specialists.list,
      image: HOME_NAV_3,
   },
   {
      name: 'Заявки',
      link: RoutesPath.purchase.list,
      image: HOME_NAV_4,
   },
];

export const HOME_NAV_MOBILE = [
   {
      name: 'Новостройки',
      link: RoutesPath.listing,
      image: HOME_NAV_1,
   },
   {
      name: 'Застройщики',
      link: RoutesPath.developers.list,
      image: HOME_NAV_2,
   },
   {
      name: 'Скидки и подарки',
      link: RoutesPath.feedPromos,
      image: HOME_NAV_5,
   },
   {
      name: 'Менеджеры',
      link: RoutesPath.specialists.list,
      image: HOME_NAV_3,
   },
   {
      name: 'Видео и Клипы',
      link: RoutesPath.feedVideos,
      image: HOME_NAV_6,
   },
   {
      name: 'Заявки',
      link: RoutesPath.purchase.list,
      image: HOME_NAV_4,
   },
   {
      name: 'Live',
      link: RoutesPath.stream.list,
      image: HOME_NAV_8,
   },
   {
      name: 'Чат',
      link: RoutesPath.chat,
      image: HOME_NAV_7,
   },
];
