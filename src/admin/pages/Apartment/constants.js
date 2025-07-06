import { roomsOptions } from '../../../data/selectsField';

export const defaultApartData = {
   rooms: roomsOptions,
   floor: [...new Array(101)]
      .map((_, index) => {
         return {
            value: index.toString(),
            label: index.toString(),
         };
      })
      .slice(1),
};

export const defaultApartDataCreate = {
   rooms: '',
   photos: [],
   room: [],
   description: '',
   price: '',
   floor: '',
   show_on_homepage: false,
   show_cashback_on_homepage: false,
   attributes: [],
   apartment_tags: [],
   advantages: [],
   housing: '',
};
