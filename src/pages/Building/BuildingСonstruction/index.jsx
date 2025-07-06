import React from 'react';

import ConstructProgress from '../../../components/ConstructProgress';

const BuildingСonstruction = ({ data, options, sidebar }) => {
   return (
      <div className="white-block">
         <h2 className="title-2 mb-4">Ход строительства</h2>
         <ConstructProgress data={data} options={options} sidebar={sidebar} />
      </div>
   );
};

export default BuildingСonstruction;
