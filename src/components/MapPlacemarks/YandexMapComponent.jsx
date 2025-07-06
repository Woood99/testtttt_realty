import React, { useEffect, useRef, useState } from 'react';
import { YMAPS_KEY } from '../../constants/api';
import { Map, Placemark, Rectangle, useYMaps, YMaps } from '@r3flector/react-yandex-maps';
import { YmapFeatureFullscreen, YmapFeaturePlacemarkComplex, YmapFeatures, YmapFeatureZoom } from '../../unifComponents/ymap/YmapFeatures';
import convertSum from '../../helpers/convertSum';

const YandexMapComponent = ({ className = '', coordinates, placemarksData = [] }) => {
   const mapRef = useRef(null);
   const featuresRef = useRef(null);

   const [activePlacemark, setActivePlacemark] = useState(null);

   return (
      <YMaps query={{ apikey: YMAPS_KEY }}>
         <div className={`w-full h-[425px] bg-[#cfcfcf] rounded-xl overflow-hidden remove-copyrights-pane relative ${className}`}>
            <Map defaultState={{ center: coordinates, zoom: 13 }} width="100%" height="100%" instanceRef={mapRef}>
               <Placemark geometry={coordinates} />
               {placemarksData.map((item, index) => {
                  return <YmapFeaturePlacemarkComplex data={item} key={index} map={mapRef} setActivePlacemark={setActivePlacemark} />;
               })}
            </Map>
            <YmapFeatures containerRef={featuresRef}>
               <YmapFeatureFullscreen map={mapRef} container={featuresRef} />
               <YmapFeatureZoom map={mapRef} />
            </YmapFeatures>
         </div>
      </YMaps>
   );
};

export default YandexMapComponent;
