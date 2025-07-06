import React, { useEffect, useState } from 'react';
import { YMAPS_KEY } from '../../constants/api';
import axios from 'axios';

const SetCityCoordinates = ({ city = '', setCoordinates }) => {
   const [error, setError] = useState(null);

   useEffect(() => {
      if (!city) return;
      const fetchCoordinates = async () => {
         try {
            const response = await axios.get(
               `https://geocode-maps.yandex.ru/1.x/?format=json&geocode=${encodeURIComponent(
                  city
               )}&apikey=${YMAPS_KEY}`
            );

            const data = response.data;

            if (data.response.GeoObjectCollection.featureMember.length > 0) {
               const geoObject = data.response.GeoObjectCollection.featureMember[0].GeoObject;

               const point = geoObject.Point.pos.split(' ').map(parseFloat).reverse();
               setCoordinates(point);
               setError(null);
            } else {
               setError('Город не найден');
               setCoordinates(null);
            }
         } catch (err) {
            setError('Ошибка при запросе к API');
            setCoordinates(null);
         }
      };

      if (city) {
         fetchCoordinates();
      }
   }, [city]);

   return <div>{error && <p style={{ color: 'red' }}>{error}</p>}</div>;
};

export default SetCityCoordinates;
