import { BASE_URL } from '../constants/api';

const getSrcImage = src => {
   if (!src) return;

   if (!(typeof src === 'string')) {
      return '';
   }

   return src.includes('/uploads/images/') ? `${BASE_URL}${src}` : src;
};

export default getSrcImage;
