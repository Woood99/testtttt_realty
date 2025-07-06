import React from 'react';
import { DragDropItems } from '../../../components/DragDrop/DragDropItems';
import { FileDropZone } from '../../../components/DragDrop/FileDropZone';
import getImagesObj from '../../../unifComponents/getImagesObj';

const ApartmentPhoto = ({ images, setImages }) => {
   const addPhoto = files => {
      const newData = getImagesObj([...images, ...files]);
      setImages(newData);
   };

   const deleteItem = (_, idImage) => {
      const newData = images
         .filter(item => item.id !== idImage)
         .map((item, index) => {
            return { ...item, id: index + 1 };
         });

      setImages(newData);
   };

   return (
      <div className="white-block mt-4">
         <h3 className="title-2 mb-6">Фото</h3>
         <DragDropItems items={images} deleteItem={deleteItem} />
         <FileDropZone addFiles={files => addPhoto(files)} className={images.length > 0 ? 'mt-6' : ''} />
      </div>
   );
};

export default ApartmentPhoto;
