import { IconInfoTooltip } from '../ui/Icons';
import { Tooltip } from '../ui/Tooltip';

import presentImg from '../assets/img/present.png';
import discountImg from '../assets/img/discount.png';

export const nearestYearsOptions = [
   { value: '2024', label: '2024' },
   { value: '2025', label: '2025' },
   { value: '2026', label: '2026' },
];

export const quartersOptions = [
   { value: 'quarter1', label: '1 квартал' },
   { value: 'quarter2', label: '2 квартал' },
   { value: 'quarter3', label: '3 квартал' },
   { value: 'quarter4', label: '4 квартал' },
];

export const roomsOptions = [
   { value: 0, label: 'Студия' },
   { value: 1, label: '1' },
   { value: 2, label: '2' },
   { value: 3, label: '3' },
   { value: 4, label: '4+' },
];

export const calcPropsOptionsValues = {
   cash: 'cash',
   installment_plan: 'installment_plan',
   mortgage_approval_bank: 'mortgage_approval_bank',
   mortgage_no_approval_bank: 'mortgage_no_approval_bank',
   no_down_payment: 'no_down_payment',
   certificate: 'certificate',
};

export const calcPropsOptions = [
   { id: 1, value: 'cash', label: 'Наличные' },
   { id: 6, value: 'installment_plan', label: 'Рассрочка' },
   { id: 2, value: 'mortgage_approval_bank', label: 'Ипотека, есть одобрение от банка' },
   { id: 3, value: 'mortgage_no_approval_bank', label: 'Ипотека, нет одобрения от банка' },
   { id: 4, value: 'no_down_payment', label: 'Без первоначального взноса' },
   {
      id: 5,
      value: 'certificate',
      label: 'В сделке будет использоваться сертификат',
      BodyContent: () => {
         return (
            <Tooltip
               mobile
               color="white"
               ElementTarget={() => <IconInfoTooltip width={16} height={16} />}
               classNameTarget="h-4 mt-1"
               classNameContent="mmd1:!p-6"
               placement="bottom">
               <div className="font-medium">
                  Материнский капитал, жилищный сертификат, <br /> региональный и тд.
               </div>
            </Tooltip>
         );
      },
   },
];

export const view_start_data = [
   {
      value: 'any',
      label: 'В любое время',
   },
   {
      value: 'today',
      label: 'Сегодня',
   },
   {
      value: 'week',
      label: 'В течении недели',
   },
   {
      value: 'month',
      label: 'В течении месяца',
   },
];

export const is_gift_data = {
   value: 'is_gift',
   label: 'Есть подарок',
   descr: 'Подарки от застройщика на выбор при покупке квартиры',
   icon: presentImg,
   iconSize: 26,
};
export const is_cashback_data = {
   value: 'is_cashback',
   label: 'Есть кешбэк',
   descr: 'Начислим наличными за покупку на банковскую карту.',
   icon: presentImg,
   iconSize: 26,
};

export const is_discount_data = {
   value: 'is_discount',
   label: 'Со скидкой',
   descr: 'Скидка от застройщика при покупке квартиры',
   icon: discountImg,
   iconSize: 32,
};

export const is_video_data = {
   value: 'is_video',
   label: 'Есть видеообзор',
   descr: 'Видеообзор от застройщика',
};

export const filterTypeMultipleSelect = (type = '') => {
   const TYPES = ['Застройщик', 'Комплекс'];
   return TYPES.includes(type);
};

export const timesOptions = [
   { value: '08:00', label: '08:00 - 09:00', time: 8 },
   { value: '09:00', label: '09:00 - 10:00', time: 9 },
   { value: '10:00', label: '10:00 - 11:00', time: 10 },
   { value: '11:00', label: '11:00 - 12:00', time: 11 },
   { value: '12:00', label: '12:00 - 13:00', time: 12 },
   { value: '13:00', label: '13:00 - 14:00', time: 13 },
   { value: '14:00', label: '14:00 - 15:00', time: 14 },
   { value: '15:00', label: '15:00 - 16:00', time: 15 },
   { value: '16:00', label: '16:00 - 17:00', time: 16 },
   { value: '17:00', label: '17:00 - 18:00', time: 17 },
   { value: '18:00', label: '18:00 - 19:00', time: 18 },
   { value: '19:00', label: '19:00 - 20:00', time: 19 },
   { value: '20:00', label: '20:00 - 21:00', time: 20 },
];

export const choiceApartmentsFilterOptions = {
   rooms: [],
   frame: [],
   areaFrom: '',
   areaTo: '',
};

export const sortOptionsFlats = [
   {
      label: 'Сначала дешёвые',
      value: 'priceAsc',
   },
   {
      label: 'Сначала дорогие',
      value: 'priceDesc',
   },
];
