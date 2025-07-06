import styles from './MapPlacemarks.module.scss';

const visibleCirclePlacemark = (map, item) => {
   let id = item.mark.properties.get('id');
   map.geoObjects.remove(item.mark);
   item.mark.properties.set('hintContent', null);
   item.mark.options.set('iconLayout', ymaps.templateLayoutFactory.createClass(`<div class=${styles.MapCircle} data-placemark-id="${id}"></div>`));
   item.mark.options.set('iconShape', {
      type: 'Rectangle',
      coordinates: [
         [0, 0],
         [15, 15],
      ],
   });
   map.geoObjects.add(item.mark);
};

export default visibleCirclePlacemark;
