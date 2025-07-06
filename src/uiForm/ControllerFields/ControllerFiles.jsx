import { Controller } from 'react-hook-form';

import React from 'react';
import { DragDropItems, VideoControls } from '../../components/DragDrop/DragDropItems';
import { FileDropZone } from '../../components/DragDrop/FileDropZone';
import getImagesObj, { getVideoObj } from '../../unifComponents/getImagesObj';
import { VideoDropZone } from '../../components/DragDrop/VideoDropZone';

export const ControllerPhoto = ({ control, name = '', defaultValue = [], multiple = true }) => {
   return (
      <Controller
         control={control}
         name={name}
         defaultValue={defaultValue}
         render={({ field }) => {
            return (
               <>
                  <DragDropItems
                     items={field.value}
                     deleteItem={(_, idImage) => {
                        const newData = field.value
                           .filter(item => item.id !== idImage)
                           .map((item, index) => {
                              return { ...item, id: index + 1 };
                           });
                        field.onChange(newData);
                     }}
                  />
                  <FileDropZone
                     multiple={multiple}
                     addFiles={files => {
                        if (multiple) {
                           field.onChange(getImagesObj([...field.value, ...files]));
                        } else {
                           field.onChange(getImagesObj([...files]));
                        }
                     }}
                     className={`${field.value.length > 0 ? 'mt-6' : ''} mb-4`}
                  />
               </>
            );
         }}
      />
   );
};

export const ControllerVideo = ({ control, name = '', defaultValue = [], multiple = false }) => {
   return (
      <Controller
         control={control}
         name={name}
         defaultValue={defaultValue}
         render={({ field }) => {
            return (
               <>
                  {field.value[0]?.video && (
                     <div className="grid grid-cols-4 gap-4 mb-4">
                        <VideoControls src={field.value[0]?.video} deleteItem={() => field.onChange([])} />
                     </div>
                  )}
                  <VideoDropZone
                     multiple={multiple}
                     addFiles={files => {
                        if (multiple) {
                           field.onChange(getVideoObj([...field.value, ...files]));
                        } else {
                           field.onChange(getVideoObj([...files]));
                        }
                     }}
                     className={`${field.value.length > 0 ? 'mt-6' : ''} mb-4`}
                  />
               </>
            );
         }}
      />
   );
};
