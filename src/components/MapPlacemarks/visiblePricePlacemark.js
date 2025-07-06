import convertSum from '../../helpers/convertSum';
import styles from './MapPlacemarks.module.scss';

const visiblePricePlacemark = (map, item) => {
   let id = item.mark.properties.get('id');
   let minPrice = item.mark.properties.get('minPrice');
   let title = item.mark.properties.get('title');

   map.geoObjects.remove(item.mark);
   item.mark.options.set(
      'iconLayout',
      ymaps.templateLayoutFactory.createClass(
         `<div class="${styles.MapPlacemark} ${map.getZoom() > 15 ? `${styles.MapPlacemarkCol}` : ''}" data-placemark-id="${id}">
            ${map.getZoom() > 15 ? `<p>${title}</p>` : ''}
           <p>от ${minPrice ? convertSum(minPrice || 0) : '0'}</p>
         </div>`
      )
   );
   item.mark.options.set('zIndex', 9999);

   let coordinates = [];
   if (map.getZoom() > 15) {
      coordinates = [
         [-55, -22],
         [45, 22],
      ];
   } else {
      coordinates = [
         [-45, -20],
         [35, 0],
      ];
   }

   item.mark.options.set('iconShape', {
      type: 'Rectangle',
      coordinates,
   });
   map.geoObjects.add(item.mark);
};

export default visiblePricePlacemark;
