import React, { useContext } from 'react';

import { FeedBlockPrimary } from '../../../components/Ribbon';
import { RoutesPath } from '../../../constants/RoutesPath';
import { combinedArray } from '../../../helpers/arrayMethods';
import { HomeContext } from '..';

const Videos = () => {
   const { videoCards, shortsCards, getVideo } = useContext(HomeContext);
   if (!combinedArray(videoCards.data, shortsCards.data).length) return;

   return (
      <section className="mt-3">
         <div className="container-desktop">
            <FeedBlockPrimary
               data={[...videoCards.data.map(item => ({ ...item, type: 'video' })), ...shortsCards.data.map(item => ({ ...item, type: 'short' }))]}
               data_type="data"
               customHref={`${RoutesPath.feedVideos}?type=home&filterHidden=1`}
               refetchData={{ videos: getVideo, shorts: getVideo }}
            />
         </div>
      </section>
   );
};

export default Videos;
