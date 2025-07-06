export const RoutesPath = {
   home: '/',
   listing: '/buy',
   listingFlats: '/flats',
   building: '/building/',
   apartment: '/apartment/',
   loginPhone: '/login/phone',
   purchase: {
      list: '/purchase/list',
      inner: '/purchase/',
   },
   feed: '/feed',
   feedPromos: '/feed/promos',
   feedVideos: '/feed/videos',
   comparison: '/comparison',
   favorites: '/favorites',
   promo: '/promo/',
   privacyPolicy: '/privacy-policy/',
   cashbackConditions: '/cashback-conditions/',
   empty: '/404',

   specialists: {
      list: '/specialists/list',
      inner: '/specialists/',
   },

   developers: {
      list: '/developers/list',
      inner: '/developers/',
   },

   videosPage: {
      videoPage: '/videos/',
      shortPage: '/shorts/',
   },

   stream: {
      broadcaster: '/admin/stream/broadcaster',
      view: '/admin/stream/view/',
      list: '/admin/stream/list',
   },
};

export const SellerRoutesPath = {
   home: '/seller',
   object: {
      list: '/seller/objects',
   },
   buyer: '/buyer/',
   view: '/seller/view',
   specialists: '/seller/specialists',
   objects_developer: '/seller/developer-objects',
   purchase: {
      list_all: '/seller/purchase/list-all',
      list_buyers: '/seller/purchase/list-buyers',
      inner: '/seller/purchase/',
   },
   wallet: '/seller/wallet',
   calendar_view: '/seller/calendar-view',
};

export const BuyerRoutesPath = {
   purchase: {
      create: '/purchase/create',
      list: '/cabinet/purchase/list',
      inner: '/cabinet/purchase/',
      edit: '/cabinet/purchase/edit/',
   },
   view: '/cabinet/view',
   walletPage: '/wallet',
};

export const AuthRoutesPath = {
   profile: {
      edit: '/profile/edit',
   },
   chat: '/chat',
};

export const PrivateRoutesPath = {
   dashboardAdmin: '/admin',
   login: '/admin/login',
   types: {
      list: '/admin/types/list',
      create: '/admin/types/create',
      show: '/admin/types/show/',
      createChars: '/admin/type/:typeId/add/attribute/:attributeId',
      createCharsApart: '/admin/type/:typeId/add/innerattribute',
      editChar: '/admin/type/:typeId/edit/attribute',
      editCharApart: '/admin/type/:typeId/edit/innerattribute',
   },
   objects: {
      create: '/admin/object/create',
      edit: '/admin/object/edit/',
   },
   listingFlats: '/admin/flats',
   apartment: {
      create: '/admin/apartment/create/',
      edit: '/admin/apartment/edit/',
   },
   cities: {
      list: '/admin/cities/list/',
      create: '/admin/cities/create/',
      edit: '/admin/cities/edit/',
   },
   tags: {
      list: '/admin/tags/list/',

      createTag: '/admin/tags/create/tag/',
      createSticker: '/admin/tags/create/sticker/',
      createAdvantage: '/admin/tags/create/advantage/',

      editTag: '/admin/tags/edit/tag/',
      editSticker: '/admin/tags/edit/sticker/',
      editAdvantage: '/admin/tags/edit/advantage/',
   },
   roles: {
      list: '/admin/roles/list',
      create: '/admin/roles/create',
   },
   specialists: {
      create: '/admin/specialists/create',
      edit: '/admin/specialists/edit/',
   },

   developers: {
      create: '/admin/developers/create',
      edit: '/admin/developers/edit/',
   },

   purchase: {
      create: '/admin/purchase/create',
      list: '/admin/purchase/list',
      edit: '/admin/purchase/edit/',
   },
};
