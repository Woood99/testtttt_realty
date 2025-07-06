import { getBuilding } from '../../../api/getBuilding';
import { getDataRequest, sendPostRequest } from '../../../api/requestsApi';
import { getAttrData } from './getAttrData';

export const objectUpdateVideo = async (deleteCardData, building_id, citiesItems) => {
   const building = await getBuilding(building_id);

   const attributeComplex = await getDataRequest('/api/object-types').then(async res => {
      const id = res.data.find(item => item.name === 'Новостройки')?.id;

      const data = await getDataRequest(`/api/type/${id}`).then(res => {
         return res.data.attributeComplex;
      });
      return data;
   });

   const attrCombined = attributeComplex
      .flatMap(obj => obj.items)
      .map(item => {
         return {
            name: item.name,
            value: item['available-values'],
         };
      });

   const attrValues = attrCombined.map(item => {
      const currentAttribute = building.attributes.flatMap(obj => obj.items).find(obj => obj.name === item.name);
      if (currentAttribute) {
         return {
            name: currentAttribute.name,
            value: currentAttribute.value.split(',').map(item => item.trim()),
         };
      } else {
         return {
            name: item.name,
            value: [],
         };
      }
   });

   const attrData = getAttrData(
      attributeComplex,
      attrValues.reduce((acc, { name, value }) => {
         acc[name] = value;
         return acc;
      }, {})
   );

   const currentCity = citiesItems.find(item => item.name === building.city);

   await new Promise(resolve => setTimeout(resolve, 2000)); // небольшая задержка !!!

   await sendPostRequest(`/admin-api/building/${building_id}/unlink-video/${deleteCardData.id}`);

   const buildingData = {
      complex: building.title.replace(/^ЖК\s+'|'$/g, ''),
      city: currentCity.id,
      address: building.address,
      deadline: building.deadline,
      'type-build': {
         value: building.type_id,
      },
      developer: {
         value: building.developer.id,
      },
      description: building.description,
      'recommend-home': building.showOnHomepage,
      'cashback-home': building.showCashbackOnHomepage,
      cashback: String(building.cashback || ''),
      cashbackSubscribe: String(building.cashback_with_master_subscribe || ''),
      tags: building.tags.map(item => item.id),
      stickers: building.stickers.map(item => item.id),
      advantages: building.advantages.map(item => item.id),
      attributes: attrData,
      photos: building.gallery.map((item, index) => {
         return {
            id: index + 1,
            name: item.title,
            items: item.images.map((image, index) => {
               return {
                  id: index + 1,
                  image,
                  new_image: false,
               };
            }),
         };
      }),
      priceFrom: building.minPrice,
      apartRenov: building.apartmentRenov.map((item, index) => {
         return {
            id: index + 1,
            name: item.title,
            description: item.description,
            price: item.price,
            items: item.images.map((image, index) => {
               return {
                  id: index + 1,
                  image,
                  new_image: false,
               };
            }),
         };
      }),
      ecologyParks: building.ecologyParks.map((item, index) => {
         return {
            id: index + 1,
            name: item.title,
            description: item.description,
            distance: item.distance,
            items: item.images.map((image, index) => {
               return {
                  id: index + 1,
                  image,
                  new_image: false,
               };
            }),
         };
      }),

      geo: building.location,
      videos: building.videos.filter(item => item !== deleteCardData.url),
      shorts: building.shorts.filter(item => item !== deleteCardData.url),
      videos_gallery: building.videos_gallery.filter(item => item !== deleteCardData.url),
      videos_apartRenov: building.videos_apartRenov.filter(item => item !== deleteCardData.url),
      videos_ecologyParks: building.videos_ecologyParks.filter(item => item !== deleteCardData.url),
   };

   const formData = new FormData();
   formData.append('data', JSON.stringify(buildingData));

   sendPostRequest(`/admin-api/update/object/${building_id}`, formData, {
      'Content-Type': 'multipart/form-data',
   }).then(res => {
      console.log(res);
   });

   await new Promise(resolve => setTimeout(resolve, 1500)); // небольшая задержка !!!
};
