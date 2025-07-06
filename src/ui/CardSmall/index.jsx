import React from 'react';
import getSrcImage from '../../helpers/getSrcImage';
import { RoutesPath } from '../../constants/RoutesPath';
import isEmptyArrObj from '../../helpers/isEmptyArrObj';

const CardSmall = ({ data = {}, className = '', imageFit = 'cover' }) => {
   const images = isEmptyArrObj(data.images) ? data.gallery?.[0]?.images || [] : data.images;

   return (
      <article className={`flex gap-4 relative ${className}`}>
         <a href={data.type === 'building' ? `${RoutesPath.building}${data.id}` : `${RoutesPath.apartment}${data.id}`} className="CardLinkElement" />
         <img
            src={getSrcImage(images?.[0] || '')}
            className={`w-[65px] h-[65px] rounded-xl ${imageFit === 'contain' ? 'object-contain' : 'object-cover'}`}
            width={60}
            height={60}
            alt=""
         />
         <div className="flex flex-col gap-1">
            {Boolean(data.title) && <p>{data.title}</p>}
            {Boolean(data.address) && <p>{data.address}</p>}
            {Boolean(data.deadline) && <p>Срок сдачи: {data.deadline}</p>}
         </div>
      </article>
   );
};

export default CardSmall;
