import React, { useContext } from 'react';

import { FeedBlockPrimary } from '../../../components/Ribbon';
import { RoutesPath } from '../../../constants/RoutesPath';
import { mergeArraysFromObject } from '../../../helpers/objectMethods';
import { HomeContext } from '..';

const Stocks = () => {
   const { promoCards, getPromo } = useContext(HomeContext);
   if (!mergeArraysFromObject(promoCards.data).length) return;

   return (
      <section className="mt-3">
         <div className="container-desktop">
            <FeedBlockPrimary
               data={[
                  ...promoCards.data.promos.map(item => ({ ...item, type: 'stock' })),
                  ...promoCards.data.calculations.map(item => ({ ...item, type: 'calculation' })),
                  ...promoCards.data.news.map(item => ({ ...item, type: 'news' })),
               ]}
               data_type="data"
               customHref={`${RoutesPath.feedPromos}?type=home&filterHidden=1`}
               refetchData={{ promos: getPromo }}
            />
         </div>
      </section>
   );
};

export default Stocks;
