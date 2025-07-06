import { AuthRoutesPath, RoutesPath } from '../../../constants/RoutesPath';

export const HOME_NAV = [
   {
      name: 'Новостройки',
      link: RoutesPath.listing,
      image: 'https://statics.dmclk.ru/confer/static/3610/998908/c946d7f/ec6aeb92321cfd50c2da.png',
   },
   {
      name: 'Застройщики',
      link: RoutesPath.developers.list,
      image: 'https://img.dmclk.ru/s200x200q80/blog/frame-270988339.webp',
   },
   {
      name: 'Менеджеры',
      link: RoutesPath.specialists.list,
      image: 'https://statics.dmclk.ru/confer/static/3610/998908/c946d7f/4b5da8dd76d8771779a0.png',
   },
   {
      name: 'Заявки',
      link: RoutesPath.purchase.list,
      image: 'https://statics.dmclk.ru/confer/static/3610/998908/c946d7f/7303e2cd8f5dc323b76e.png',
   },
   {
      name: 'Скидки и подарки',
      link: RoutesPath.feedPromos,
      image: 'https://statics.dmclk.ru/confer/static/3610/998908/c946d7f/098a7ca7a63fd7c0a6a1.png',
   },
   {
      name: 'Видео и Клипы',
      link: RoutesPath.feedVideos,
      image: 'https://statics.dmclk.ru/confer/static/3610/998908/c946d7f/919e993efd94bbaa921e.png',
   },
   {
      name: 'Чат',
      link: AuthRoutesPath.chat,
      image: 'https://statics.dmclk.ru/confer/static/3610/998908/c946d7f/fe9881e6babbec2bd8ff.png',
      authRequired: true,
      mobileFull: true,
   },
];
