export const dataNamesComplex = [
   {
      title: 'Общая информация',
      items: [
         { label: 'Входит в топ продаж', value: 'top', typeField: 'boolean' },
         { label: 'Застройщик', value: 'user', typeField: 'user' },
         { label: 'Кешбэк за покупку до', value: 'cashback', typeField: 'text', postfix: '₽' },
         { label: 'Подарок', value: 'present', typeField: 'boolean' },
         { label: 'Срок сдачи', value: 'deadline', typeField: 'text' },
      ],
   },
   {
      title: 'Адрес',
      items: [
         { label: 'Город, улица', value: 'address', typeField: 'text' },
         { label: 'Метро', value: 'metro', typeField: 'metro' },
      ],
   },
   {
      title: 'Об объекте',
      items: [{ label: 'Цена от', value: 'min_price_complex', typeField: 'text', postfix: '₽' }],
   },
];

export const dataNamesApartment = [
   {
      title: 'Общая информация',
      items: [
         { label: 'Общая стоимость', value: 'price', typeField: 'text', postfix: '₽' },
         { label: 'Цена за м²', value: 'pricePerMeter', typeField: 'text', postfix: ' ₽/м²' },
         { label: 'Тип недвижимости', value: 'type', typeField: 'text' },
         { label: 'Количество комнат', value: 'rooms', typeField: 'text' },
      ],
   },
   {
      title: 'Площадь',
      items: [{ label: 'Общая', value: 'area', typeField: 'text', postfix: 'м²' }],
   },
   {
      title: 'Адрес',
      items: [
         { label: 'Город, улица', value: 'address', typeField: 'text' },
         { label: 'Метро', value: 'metro', typeField: 'metro' },
      ],
   },
   {
      title: 'Параметры',
      items: [{ label: 'Этаж', value: 'floor', typeField: 'text' }],
   },
   {
      title: 'О доме',
      items: [
         { label: 'Застройщик', value: 'developer', typeField: 'developer' },
         { label: 'Кешбэк за покупку', value: 'cashback', typeField: 'text', postfix: '₽' },
         { label: 'Подарок', value: 'present', typeField: 'boolean' },
         { label: 'Срок сдачи', value: 'deadline', typeField: 'text' },
      ],
   },
];
