import { capitalizeWords, getFirstLetter } from '../../helpers/changeString';
import convertSum from '../../helpers/convertSum';
import styles from './MapPlacemarks.module.scss';

const PlacemarkCreate = data => {
   const geo = [data.geo[0], data.geo[1]];
   let classNamePlacemark = styles.MapPlacemark;
   if (data.type === 'infrastructure') {
      classNamePlacemark = `${styles.MapPlacemarkInfrastructure} ${styles[`MapPlacemark${capitalizeWords(data.settings.type)}`]}`;

      const mark = new ymaps.Placemark(
         geo,
         {
            id: data.id,
            name: data.name,
            address: data.address,
            type: data.type,
            geo,
         },
         {
            iconLayout: ymaps.templateLayoutFactory.createClass(
               `<div class='${classNamePlacemark}' data-placemark-id="${data.id}">
                 ${data.settings.icon}
               </div>`
            ),
            iconShape: {
               type: 'Rectangle',
               coordinates: [
                  [32, 32],
                  [-15, -32],
               ],
            },
         }
      );
      return {
         id: data.id,
         name: data.name,
         address: data.address,
         type: data.type,
         mark,
         geo,
      };
   } else {
      const mark = new ymaps.Placemark(
         geo,
         {
            id: data.id,
            price: data.minPrice,
            geo,
         },
         {
            iconLayout: ymaps.templateLayoutFactory.createClass(
               `<div class='${classNamePlacemark}' data-placemark-id="${data.id}">
                  <span>от ${convertSum(data.minPrice || 0)} ₽</span>
               </div>`
            ),
            iconShape: {
               type: 'Rectangle',
               coordinates: [
                  [-40, -25],
                  [60, 0],
               ],
            },
         }
      );
      return {
         id: data.id,
         minPrice: data.minPrice,
         mark,
         geo,
      };
   }
};

export default PlacemarkCreate;
