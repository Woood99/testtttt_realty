import React from 'react';
import Tabs from '../../ui/Tabs';
import DetailedStatisticsTabLayout from './DetailedStatisticsTabLayout';
import { combinedArrayLength } from '../../helpers/arrayMethods';

const DetailedStatisticsTabsLayout = ({ tabData }) => {
   return (
      <div className="white-block">
         <Tabs
            navClassName="!sticky top-[40px] left-0 z-[999] bg-white"
            data={tabData.map(item => {
               return {
                  name: item.title,
                  body: <DetailedStatisticsTabLayout data={item} />,
                  count: combinedArrayLength(item.cardIds),
               };
            })}
         />
      </div>
   );
};

export default DetailedStatisticsTabsLayout;
