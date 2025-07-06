import React, { memo, useState } from 'react';
import TabsControlsFieldBlock from '../../TabsControlsFieldBlock';
import { DragDropItems } from '../../../components/DragDrop/DragDropItems';
import { FileDropZone } from '../../../components/DragDrop/FileDropZone';
import getImagesObj from '../../../unifComponents/getImagesObj';
import StructureTabVideo from './StructureTabVideo';

const emptyField = {
   name: '',
   items: [],
};

const ObjectPhoto = memo(({ data, setData, options = {}, sendingForm, dataVideos }) => {
   const [videoModalCreate, setVideoModalCreate] = useState(false);

   const updateItems = (items, id) => {
      const newData = data.map(attr => {
         if (attr.id === id) {
            return {
               ...attr,
               items: [...getImagesObj([...items])],
            };
         }
         return attr;
      });
      setData(newData);
   };
   
   const addItem = (id, files) => {
      const newData = data.map(attr => {
         if (attr.id === id) {
            return {
               ...attr,
               items: [...getImagesObj([...attr.items, ...files])],
            };
         }
         return attr;
      });

      setData(newData);
   };

   const deleteItem = (idTab, idImage) => {
      const newData = data.map(attr => {
         if (attr.id === idTab) {
            const filteredPhoto = attr.items
               .filter(item => item.id !== idImage)
               .map((item, index) => {
                  return { ...item, id: index + 1 };
               });
            return { ...attr, items: filteredPhoto };
         }
         return attr;
      });

      setData(newData);
   };

   return (
      <div className="white-block mt-4">
         <TabsControlsFieldBlock
            data={data}
            setData={currentData => setData(currentData)}
            structureTabs={data => {
               return {
                  id: data.id,
                  name: data.name,
                  body: (
                     <div>
                        <DragDropItems
                           items={data.items}
                           dataCurrentId={data.id}
                           deleteItem={deleteItem}
                           onChange={value => updateItems(value, data.id)}
                        />
                        <FileDropZone addFiles={files => addItem(data.id, files)} className={data.items.length > 0 ? 'mt-6' : ''} />
                     </div>
                  ),
               };
            }}
            emptyField={emptyField}
            title="Фото"
            additionalTab={StructureTabVideo({
               onSubmitVideo: async currentData => {
                  await sendingForm({
                     videos: [currentData.url, ...(options.dataObject.videos || [])],
                     videos_gallery: [currentData.url, ...(options.dataObject.videos_gallery || [])],
                  });
               },
               onUpdate: async data => {
                  await sendingForm(data || {});
               },
               options: {
                  data: dataVideos,
                  setModal: setVideoModalCreate,
                  conditionModal: videoModalCreate,
                  specialists: options.specialists,
                  frames: options.frames,
                  tags: options.tags,
                  dataObject: options.dataObject,
               },
               id: data.length ? 'video_add_gallery_id' : 0,
            })}
         />
      </div>
   );
});

export default ObjectPhoto;
