import React from 'react';
import VideoCard from '../../../ui/VideoCard';
import { useSelector } from 'react-redux';
import { getIsDesktop } from '@/redux';

const PlayerSimilarVideo = ({ data, title = '' }) => {
   const isDesktop = useSelector(getIsDesktop);

   return (
      <>
         {Boolean(data.length) && (
            <div>
               <h3 className="title-3 mb-4">{title}</h3>
               <div className="grid grid-cols-1 gap-4 scrollbarPrimary mmd1:overflow-y-auto mmd1:overflow-x-hidden mmd1:max-h-[508px] md1:grid-cols-2 md1:gap-6 md3:grid-cols-1">
                  {data.map(item => {
                     return <VideoCard data={item} key={item.id} variant={isDesktop ? 'row' : ''} />;
                  })}
               </div>
            </div>
         )}
      </>
   );
};

export default PlayerSimilarVideo;
