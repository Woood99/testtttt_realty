import React, { useContext } from 'react';
import cn from 'classnames';

import { DeveloperPageContext } from '../../../context';
import { RoutesPath } from '../../../constants/RoutesPath';
import Tag from '../../../ui/Tag';

const DeveloperPageCities = () => {
   const { developerId, data, citiesItems, currentCity } = useContext(DeveloperPageContext);
   const filteredCities = citiesItems.filter(item => data.cities.includes(item?.id));

   if (!filteredCities.length) return;

   return (
      <div className="mt-6">
         <h3 className="title-3-5">Регионы работы:</h3>

         <div className="mt-3 flex gap-2">
            {filteredCities.map((city, index) => {
               const value = currentCity === city.name || (currentCity === '' && index === 0);
               return (
                  <Tag key={city.id} color="choice" value={value}>
                     <a href={`${RoutesPath.developers.inner}${developerId}?city=${city.name}`}>{city.name}</a>
                  </Tag>
               );
            })}
            {/* {filteredCities.map((city, index) => {
               return (
                  <Tag
                     key={city.id}
                     value={currentCity === city.name || (currentCity === '' && index === 0)}
                     onClick={() => {
                        window.location.href = `${RoutesPath.developers.inner}${developerId}?city=${city.name}`;
                     }}>
                     {city.name}
                  </Tag>
               );
            })} */}
         </div>
      </div>
   );
};

export default DeveloperPageCities;
