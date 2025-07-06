import React from 'react';
import { useDropzone } from 'react-dropzone';

import styles from './FileDropZone.module.scss';
import Button from '../../uiForm/Button';

export const VideoDropZone = ({ addFiles, multiple = true, className = '' }) => {
   const onDrop = acceptedFiles => {
      addFiles(acceptedFiles);
   };

   const { getRootProps, getInputProps, isDragActive } = useDropzone({
      onDrop,
      multiple: multiple,
      accept: { 'video/*': [] },
   });

   return (
      <div {...getRootProps()} className={`${styles.FileDropZoneRoot} ${isDragActive ? styles.FileDropZoneRootActive : ''} ${className}`}>
         <input {...getInputProps()} />
         <Button Selector="div">Выберите видео</Button>
         <div className="text-primary400 ml-4">или перетащите в эту область</div>
         {isDragActive && <div className={styles.FileDropZoneOverlay}>Отпустите изображения</div>}
      </div>
   );
};
