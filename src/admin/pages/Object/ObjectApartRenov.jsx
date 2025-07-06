import React, { useEffect, useState } from 'react';
import TabsControlsFieldBlock from '../../TabsControlsFieldBlock';
import { DragDropItems } from '../../../components/DragDrop/DragDropItems';
import { FileDropZone } from '../../../components/DragDrop/FileDropZone';
import Textarea from '../../../uiForm/Textarea';
import Input from '../../../uiForm/Input';
import getImagesObj from '../../../unifComponents/getImagesObj';
import StructureTabVideo from './StructureTabVideo';

const emptyField = {
   name: '',
   price: '',
   description: '',
   items: [],
};

const ObjectApartRenov = ({ data, setData, options = {}, sendingForm, dataVideos }) => {
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

   const structureTabs = currentData => {
      return {
         id: currentData.id,
         name: currentData.name,
         body: (
            <div>
               <DragDropItems
                  items={currentData.items}
                  dataCurrentId={currentData.id}
                  deleteItem={deleteItem}
                  onChange={value => updateItems(value, currentData.id)}
               />
               <FileDropZone addFiles={files => addItem(currentData.id, files)} className={currentData.items.length > 0 ? 'mt-6' : ''} />
               <Textarea
                  className="mt-4"
                  maxLength={3000}
                  value={currentData.description}
                  onChange={value => {
                     const newData = data.map(item => {
                        if (item.id === currentData.id) {
                           return { ...item, description: value };
                        }
                        return item;
                     });
                     setData(newData);
                  }}
                  placeholder="Описание к фотографии"
               />
               <Input
                  className="mt-4 max-w-[400px]"
                  before="Цена"
                  after="₽"
                  onlyNumber
                  convertNumber
                  value={currentData.price}
                  onChange={value => {
                     const newData = data.map(item => {
                        if (item.id === currentData.id) {
                           return { ...item, price: value };
                        }
                        return item;
                     });
                     setData(newData);
                  }}
               />
            </div>
         ),
      };
   };

   return (
      <div className="white-block mt-4">
         <TabsControlsFieldBlock
            data={data}
            setData={currentData => setData(currentData)}
            structureTabs={structureTabs}
            emptyField={emptyField}
            title="Отделка квартир"
            additionalTab={StructureTabVideo({
               onSubmitVideo: async currentData => {
                  await sendingForm({
                     videos: [currentData.url, ...(options.dataObject.videos || [])],
                     videos_apartRenov: [currentData.url, ...(options.dataObject.videos_apartRenov || [])],
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
               id: data.length ? 'video_add_apartRenov_id' : 0,
            })}
         />
      </div>
   );
};

export default ObjectApartRenov;
