import React, { useEffect, useRef } from 'react';
import { IconFullscreen, IconMinus, IconPlus } from '../../ui/Icons';
import { handleZoomIn, handleZoomOut } from './YmapZoom';
import { toggleFullscreen } from './YmapFullscreen';
import { Placemark, useYMaps } from '@r3flector/react-yandex-maps';
import convertSum from '../../helpers/convertSum';

import stylesPlacemark from '../../components/MapPlacemarks/MapPlacemarks.module.scss';

export const YmapFeatures = ({ containerRef, children }) => {
   return (
      <div className="ymap-actions-container" ref={containerRef}>
         {children}
      </div>
   );
};

export const YmapFeatureZoom = ({ map }) => {
   return (
      <div className="ymap-actions ymap-top-right-center ymap-actions-group ymap-actions-group-join">
         <button type="button" onClick={() => handleZoomIn(map.current)} className="ymap-action">
            <IconPlus className="stroke-black" />
         </button>
         <button type="button" onClick={() => handleZoomOut(map.current)} className="ymap-action">
            <IconMinus />
         </button>
      </div>
   );
};

export const YmapFeatureFullscreen = ({ map, container }) => {
   return (
      <div className="ymap-actions ymap-actions-group ymap-action-right-top">
         <button type="button" onClick={() => toggleFullscreen(map.current, container)} className="ymap-action ymap-action-btn">
            <IconFullscreen />
         </button>
      </div>
   );
};

export const YmapFeaturePlacemarkComplex = ({ data, map, setActivePlacemark }) => {
   const ymaps = useYMaps(['templateLayoutFactory']);
   if (!ymaps) return;

   const placemarkOptions = {
      iconLayout: YmapFeaturePlacemarkComplexLayout(ymaps, data),
      iconImageSize: [-40, -25],
      iconImageOffset: [60, 0],
   };

   return (
      <Placemark
         geometry={data.geo}
         options={placemarkOptions}
         onMouseEnter={() => {console.log('hover')}}
         onMouseLeave={() => setActivePlacemark(null)}
         onClick={() => {
            console.log('click');
         }}
      />
   );
};

const YmapFeaturePlacemarkComplexLayout = function (ymap, data) {
   let Chips = ymap?.templateLayoutFactory.createClass(
      `<div class=${stylesPlacemark.MapPlacemark} data-placemark-id="${data.id}">
      <span>от ${convertSum(data.minPrice || 0)} ₽</span>
   </div>`
   );

   return Chips;
};
