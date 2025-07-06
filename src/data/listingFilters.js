export const filterPrice = {
   name: 'price',
   type: 'field-fromTo',
   postfix: '₽',
   from: {
      name: 'priceFrom',
      label: 'Цена от',
   },
   to: {
      name: 'priceTo',
      label: 'До',
   },
   value: {},
};

export const filterRooms = {
   name: 'rooms',
   type: 'rooms',
   options: [
      { value: 0, label: 'Студия' },
      { value: 1, label: '1' },
      { value: 2, label: '2' },
      { value: 3, label: '3' },
      { value: 4, label: '4+' },
   ],
   value: [],
};

export const additionalFilters = [
   {
      name: 'other',
      nameLabel: 'Подборки комплексов',
      type: 'tags-multiple',
      options: [
         { value: 'is_gift', label: 'Есть подарок' },
         { value: 'is_video', label: 'Есть видеообзор' },
      ],
      value: [],
   },
];
