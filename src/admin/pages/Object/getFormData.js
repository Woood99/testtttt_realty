import { v4 as uuidv4 } from 'uuid';
import { getAttrData } from './getAttrData';

export const getFormData = (data, dataForm, attributes) => {
   const attrData = getAttrData(attributes, dataForm);

   const resData = {
      ...dataForm,
      attributes: attrData,
      address: dataForm.address,
      city: dataForm.city?.value,
      photos: data.photos.map(item => ({
         ...item,
         items: item.items.filter(item => item.image),
      })),
      apartRenov: data.apartRenov.map(item => ({
         ...item,
         items: item.items.filter(item => item.image),
      })),
      ecologyParks: data.ecologyParks.map(item => ({
         ...item,
         items: item.items.filter(item => item.image),
      })),
      geo: data.geo,
      complex: dataForm.complex.replace(/^ЖК\s+'|'$/g, ''),
      tags: dataForm.tags.map(item => item.value),
      stickers: dataForm.stickers.map(item => item.value),
      advantages: dataForm.advantages.map(item => item.value),

      videos: data.videos || [],
      shorts: data.shorts || [],
      videos_gallery: data.videos_gallery || [],
      videos_apartRenov: data.videos_apartRenov || [],
      videos_ecologyParks: data.videos_ecologyParks || [],
   };

   delete resData['calculations'];
   delete resData['stock'];

   const refactoringStartPhotoBlock = data => {
      return data.map(photoBlock => {
         return {
            ...photoBlock,
            items: photoBlock.items.map(item => {
               let newItem;
               if (item.file) {
                  newItem = {
                     ...item,
                     image: uuidv4(),
                     new_image: true,
                  };
               } else {
                  newItem = {
                     ...item,
                     new_image: false,
                  };
               }
               return newItem;
            }),
         };
      });
   };

   const refactoringEndPhotoBlock = data => {
      return data.map(photoBlock => {
         return {
            ...photoBlock,
            items: photoBlock.items.map(item => {
               return {
                  id: item.id,
                  image: item.image,
                  new_image: item.new_image,
               };
            }),
         };
      });
   };

   const appendImagesForm = (data, form) => {
      for (let key in data) {
         const currentItems = data[key].items;
         currentItems.forEach(item => {
            if (item.new_image) {
               form.append(item.image, item.file);
            }
         });
      }
   };

   resData.photos = refactoringStartPhotoBlock(resData.photos);
   resData.apartRenov = refactoringStartPhotoBlock(resData.apartRenov);
   resData.ecologyParks = refactoringStartPhotoBlock(resData.ecologyParks);

   const formData = new FormData();

   appendImagesForm(resData.photos, formData);
   appendImagesForm(resData.apartRenov, formData);
   appendImagesForm(resData.ecologyParks, formData);

   resData.photos = refactoringEndPhotoBlock(resData.photos);
   resData.apartRenov = refactoringEndPhotoBlock(resData.apartRenov);
   resData.ecologyParks = refactoringEndPhotoBlock(resData.ecologyParks);

   formData.append('data', JSON.stringify(resData));
   console.log(resData);

   // for (let pair of formData.entries()) {
   //    console.log(pair[0] + ': ' + pair[1]);
   // }

   return formData;
};
