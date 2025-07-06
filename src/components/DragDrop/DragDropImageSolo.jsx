import React from 'react';
import { useDropzone } from 'react-dropzone';

import styles from './DragDropItems.module.scss';
import { IconClose } from '../../ui/Icons';

const DragDropImageSolo = ({
   onChange = () => {},
   image,
   className = '',
   defaultLayout,
   effect = true,
   children,
   changeAvatarChildren,
   deleteAvatarChildren,
   size = 110,
}) => {
   const { getRootProps, getInputProps, open } = useDropzone({
      onDrop: onChange,
      multiple: false,
      accept: {
         'image/jpeg': ['.jpeg', '.png', '.jpg'],
      },
   });

   return (
      <>
         <div className={`${styles.DragDropImageSolo} ${className}`} style={{ width: size, height: size }}>
            {image && (
               <button
                  type="button"
                  className={`${styles.DragDropImageIcon} top-0 right-0 !z-[99] !w-6 !h-6`}
                  onClick={() => {
                     onChange(null);
                  }}>
                  <IconClose width={14} height={14} />
               </button>
            )}

            {image ? <img loading="lazy" src={image} className={styles.DragDropImageSoloImage} width={size} height={size} alt="" /> : defaultLayout()}
            <div className={`${styles.DragDropImageSoloInput} ${effect ? styles.DragDropImageSoloInputEffect : ''}`} {...getRootProps()}>
               <input {...getInputProps()} />
               {effect && (
                  <svg width="32" height="32" fill="none" xmlns="http://www.w3.org/2000/svg">
                     <path
                        d="M13.02 5.714h5.96c.868 0 1.376.253 1.874.838.026.03.446.552.903 1.116.457.565 1.388.903 2.243.903h.572c2.285 0 4 1.715 4 4.572v8.571c0 2.286-2.286 4.572-5.143 4.572H8.572c-2.858 0-5.143-2.286-5.143-4.572v-8.571c0-2.857 1.714-4.572 4-4.572H8c.855 0 1.786-.338 2.243-.903.457-.564.877-1.086.903-1.116.498-.585 1.006-.838 1.873-.838zM9.885 16.857A6.116 6.116 0 0016 22.971a6.117 6.117 0 006.114-6.114A6.117 6.117 0 0016 10.743a6.116 6.116 0 00-6.114 6.114zm1.828 0a4.285 4.285 0 118.571 0 4.285 4.285 0 01-8.57 0z"
                        fill="currentColor"
                     />
                  </svg>
               )}
            </div>
            {children}
         </div>
         {deleteAvatarChildren && (
            <button
               type="button"
               onClick={() => {
                  onChange(null);
               }}>
               {deleteAvatarChildren}
            </button>
         )}
         {changeAvatarChildren && (
            <button type="button" onClick={open}>
               {changeAvatarChildren}
            </button>
         )}
      </>
   );
};

export default DragDropImageSolo;
