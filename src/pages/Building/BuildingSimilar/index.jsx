import React from 'react';
import CardPrimary from '../../../ui/CardPrimary';

const BuildingSimilar = ({ similarData }) => {
   return (
      <div className="white-block">
         <h2 className="title-2 mb-6">Похожие новостройки</h2>
         <div className="grid grid-cols-[repeat(auto-fill,minmax(320px,1fr))] gap-6">
            {similarData.map((item, index) => (
               <CardPrimary key={index} {...item} className="h-full" />
            ))}
         </div>
      </div>
   );
};

export default BuildingSimilar;
