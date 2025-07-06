export const apartmentsFilterRooms = {
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

export const apartmentsFilterPrice = {
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

export const apartmentsAdditionalFilters = [
   {
      name: 'area',
      nameLabel: 'Площадь',
      type: 'field-fromTo',
      postfix: 'м²',
      from: {
         name: 'areaFrom',
         label: 'От',
      },
      to: {
         name: 'areaTo',
         label: 'До',
      },
      value: {},
   },
];

export const constructProgressFilters = [
   {
      name: 'frame',
      nameLabel: 'Весь ЖК',
      type: 'list-single',
      options: [
         { value: 'liter1', label: 'Литер 1' },
         { value: 'liter2', label: 'Литер 2' },
         { value: 'liter3', label: 'Литер 3' },
         { value: 'liter4', label: 'Литер 4' },
      ],
      value: {},
   },
   {
      name: 'year',
      nameLabel: 'Год',
      type: 'list-single',
      options: [
         { value: '2022', label: '2022' },
         { value: '2023', label: '2023' },
         { value: '2024', label: '2024' },
      ],
      value: {},
   },
   {
      name: 'quarter',
      nameLabel: 'Квартал',
      type: 'list-single',
      options: [
         { value: 'quarter1', label: '1 квартал' },
         { value: 'quarter2', label: '2 квартал' },
         { value: 'quarter3', label: '3 квартал' },
         { value: 'quarter4', label: '4 квартал' },
      ],
      value: {},
   },
];