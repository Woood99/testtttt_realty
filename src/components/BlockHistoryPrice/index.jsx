import React from 'react';

import { HistoryWrapper } from '../../ui/HistoryPrice';

const BlockHistoryPrice = ({ data }) => {
   return (
      <div className="white-block">
         <h2 className="title-2 mb-6">История изменения цены</h2>
         <HistoryWrapper data={data} />
      </div>
   );
};

export default BlockHistoryPrice;
