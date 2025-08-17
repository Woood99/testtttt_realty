import { useSelector } from 'react-redux';
import { useContext, useEffect, useState } from 'react';

import BlockShorts from '../../../components/BlockShorts';
import VideoCard from '../../../ui/VideoCard';
import { combinedArray } from '../../../helpers/arrayMethods';
import { HomeContext } from '..';
import { shuffleArray } from '../../../helpers/shuffleArray';
import TitleIcon from '../TitleIcon';
import { IconVideo } from '../../../ui/Icons';
import { getCurrentCityNameSelector } from '@/redux';

const ShowcaseVideos = () => {
   const { videoCards, shortsCards } = useContext(HomeContext);
   const currentCityName = useSelector(getCurrentCityNameSelector);

   const [randomVideos, setRandomVideos] = useState([]);
   const [randomShorts, setRandomShorts] = useState([]);

   useEffect(() => {
      if (!videoCards.data.length) return;

      setRandomVideos(shuffleArray(videoCards.data).slice(0, 5));
   }, [videoCards.data]);

   useEffect(() => {
      if (!shortsCards.data.length) return;

      setRandomShorts(shuffleArray(shortsCards.data));
   }, [shortsCards.data]);

   if (!combinedArray(videoCards.data, shortsCards.data).length) return;

   return (
      <div className="container mt-3">
         <div className="white-block">
            <TitleIcon icon={<IconVideo width={20} height={20} />} text="Видео и клипы" />
            <div className="grid grid-cols-2 gap-2">
               <div>
                  {Boolean(randomVideos[0]) && (
                     <VideoCard data={randomVideos[0]} shouldPlayOnHover userVisible visibleContent={false} widthImage={559} heightImage={359} />
                  )}
                  <div className="flex gap-2 justify-end">
                     <div className="w-[240px]">
                        {Boolean(randomVideos[1]) && (
                           <VideoCard
                              data={randomVideos[1]}
                              shouldPlayOnHover
                              userVisible
                              visibleContent={false}
                              widthImage={240}
                              heightImage={154}
                           />
                        )}
                     </div>
                     <div className="w-[290px]">
                        {Boolean(randomVideos[2]) && (
                           <VideoCard
                              data={randomVideos[2]}
                              shouldPlayOnHover
                              userVisible
                              visibleContent={false}
                              widthImage={290}
                              heightImage={185}
                           />
                        )}
                     </div>
                  </div>
               </div>
               <div>
                  <div className="flex gap-2 items-end">
                     <div className="w-[290px]">
                        {Boolean(randomVideos[3]) && (
                           <VideoCard
                              data={randomVideos[3]}
                              shouldPlayOnHover
                              userVisible
                              visibleContent={false}
                              widthImage={290}
                              heightImage={185}
                           />
                        )}
                     </div>
                     <div className="w-[240px]">
                        {Boolean(randomVideos[4]) && (
                           <VideoCard
                              data={randomVideos[4]}
                              shouldPlayOnHover
                              userVisible
                              visibleContent={false}
                              widthImage={240}
                              heightImage={154}
                           />
                        )}
                     </div>
                  </div>
                  <div className="grid grid-cols-3 gap-2 mt-2">
                     <BlockShorts
                        data={randomShorts.slice(0, 3)}
                        dataModal={randomShorts}
                        onlyImage={true}
                        shouldPlayOnHover
                        dynamicShortsParams={{
                           url: '/api/feed/videos',
                           params: {
                              city: currentCityName,
                              developer: null,
                              complex: null,
                              author: null,
                              tags: null,
                              type: 'shorts',
                              page: 1,
                              per_page: 999,
                           },
                        }}
                     />
                  </div>
               </div>
            </div>
         </div>
      </div>
   );
};

export default ShowcaseVideos;
