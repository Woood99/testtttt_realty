import React from 'react';
import plural from 'plural-ru';

import { IconStar } from '../Icons';

export const RatingReviewSmall = ({ rating, reviews }) => {
   return (
      <div className="flex items-center gap-1.5">
         <IconStar className="fill-yellow" width={16} height={16} />
         <span className="text-primary500 text-small leading-none font-medium">{rating}</span>
         <span className="text-primary500 text-small leading-none">
            ({reviews} {plural(reviews, 'отзыв', 'отзыва', 'отзывов')})
         </span>
      </div>
   );
};
