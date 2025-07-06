export const suggestionsTypes = {
   buyerOnly: {
      id: 1,
      endpoint: '/buyer-api/suggestions',
      title: 'Записи на просмотр',
      author_is_user: [
         {
            value: null,
            label: 'Все',
         },
         {
            value: true,
            label: 'Мои запросы',
         },
         {
            value: false,
            label: 'От продавца',
         },
      ],
   },
   buyerAll: {
      id: 2,
      endpoint: '/buyer-api/suggestions',
      title: 'Записи на просмотр',
      author_is_user: [
         {
            value: null,
            label: 'Все',
         },
         {
            value: true,
            label: 'Мои запросы',
         },
         {
            value: false,
            label: 'От продавца',
         },
      ],
   },
   sellerHistory: {
      id: 3,
      endpoint: '/seller-api/suggestions-cabinet',
      title: 'История записей на просмотр',
   },
   sellerAll: {
      id: 4,
      endpoint: '/seller-api/suggestions',
      title: 'Записи на просмотр',
      author_is_user: [
         {
            value: null,
            label: 'Все',
         },
         {
            value: true,
            label: 'От покупателя',
         },
         {
            value: false,
            label: 'Мои запросы',
         },
      ],
   },
};

export const suggestionsStatuses = [
   {
      value: 'all',
      label: 'Все',
      emptyText: 'Заявок нет',
   },
   {
      value: 'created',
      label: 'Новые',
      emptyText: 'Новых заявок нет',
   },
   {
      value: 'confirmed',
      label: 'Принятые',
      emptyText: 'Принятых заявок нет',
   },
   {
      value: 'declined',
      label: 'Отклонённые',
      emptyText: 'Отклонённых заявок нет',
   },
   {
      value: 'purchased',
      label: 'Забронированные',
      emptyText: 'Забронированных заявок нет',
   },
];

export const suggestionsDateRange = [
   {
      days: 365 * 5,
      value: 'all',
      label: 'За всё время',
   },
   {
      days: 7,
      value: 'week',
      label: 'За последнию неделю',
   },
   {
      days: 3,
      value: '3-days',
      label: 'За последние 3 дня',
   },
];
