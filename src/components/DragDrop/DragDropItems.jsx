import React, { memo, useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { DndContext, DragOverlay, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

import styles from './DragDropItems.module.scss';
import { IconRightLeft, IconTrash } from '../../ui/Icons';

import pdfImage from '../../assets/img/pdf.webp';
import videoImage from '../../assets/img/videoImage.png';
import getSrcImage from '../../helpers/getSrcImage';

export const ImageControls = memo(({ src, deleteItem }) => {
   if (!src) return;

   return (
      <div
         className={styles.DragDropImage}
         style={{ backgroundImage: `url(${getSrcImage(src)})`, backgroundRepeat: 'no-repeat', backgroundSize: 'cover' }}>
         <div type="button" className={`${styles.DragDropImageIcon} top-2 left-2`}>
            <IconRightLeft width={15} height={15} className="fill-blue" />
         </div>
         <button type="button" className={`${styles.DragDropImageIcon} top-2 right-2`} onClick={deleteItem}>
            <IconTrash width={15} height={15} className="fill-red" />
         </button>
         {/* <img src={getSrcImage(src)} alt="" width={270} height={175} loading="lazy" /> */}
      </div>
   );
});

export const PdfControls = ({ src, deleteItem }) => {
   if (!src) return;
   return (
      <a href={src} className={styles.DragDropImage} target="_blank" rel="noopener noreferrer">
         <div type="button" className={`${styles.DragDropImageIcon} top-2 left-2`}>
            <IconRightLeft width={15} height={15} className="fill-blue" />
         </div>
         <button type="button" className={`${styles.DragDropImageIcon} top-2 right-2`} onClick={deleteItem}>
            <IconTrash width={15} height={15} className="fill-red" />
         </button>
         <img src={pdfImage} alt="" />
      </a>
   );
};

export const VideoControls = ({ src, deleteItem }) => {
   if (!src) return;
   return (
      <div className={styles.DragDropImage}>
         <a href={src} className="absolute inset-0 z-10" target="_blank" rel="noopener noreferrer" />
         <div type="button" className={`${styles.DragDropImageIcon} top-2 left-2`}>
            <IconRightLeft width={15} height={15} className="fill-blue" />
         </div>
         <button type="button" className={`${styles.DragDropImageIcon} top-2 right-2 !z-20`} onClick={deleteItem}>
            <IconTrash width={15} height={15} className="fill-red" />
         </button>
         <img src={videoImage} alt="" />
      </div>
   );
};

const DragDropItem = ({ item, deleteItem, dataCurrentId, type = 'default' }) => {
   const { setNodeRef, attributes, listeners, transform, transition, isDragging } = useSortable({
      id: item.id,
      data: {
         type: 'Item',
         item,
      },
   });

   const style = {
      transition,
      transform: CSS.Transform.toString(transform),
   };

   if (isDragging) {
      return <div ref={setNodeRef} style={style} className={styles.DragDropOverlay}></div>;
   }

   return (
      <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
         {type === 'default' ? (
            <ImageControls src={item.image} deleteItem={() => deleteItem(dataCurrentId, item.id)} />
         ) : type === 'element' ? (
            item.el
         ) : (
            ''
         )}
      </div>
   );
};

export const DragDropItems = memo(({ items, dataCurrentId, deleteItem = () => {}, className, onChange = () => {} }) => {
   const [newItems, setNewItems] = useState([...items]);

   useEffect(() => {
      setNewItems([...items]);
   }, [items]);

   const itemsId = useMemo(() => newItems.map(item => item.id), [newItems]);

   const [activeItem, setActiveItem] = useState(null);

   const sensors = useSensors(
      useSensor(PointerSensor, {
         activationConstraint: {
            distance: 3, // 3px
         },
      })
   );

   const onDragStart = event => {
      if (event.active.data.current?.type === 'Item') {
         setActiveItem(event.active.data.current.item);
         return;
      }
   };

   const onDragEnd = event => {
      const { active, over } = event;
      if (!over) return;
      const activeItemId = active.id;
      const overItemId = over.id;
      if (activeItemId === overItemId) {
         return;
      }

      const activeItemIndex = newItems.findIndex(item => item.id === activeItemId);
      const overItemIndex = newItems.findIndex(item => item.id === overItemId);
      const res = arrayMove(newItems, activeItemIndex, overItemIndex);
      setNewItems(res);
      setTimeout(() => {
         onChange(res);
      }, 250);
   };
   return (
      <DndContext sensors={sensors} onDragStart={onDragStart} onDragEnd={onDragEnd}>
         <div className="grid grid-cols-4 gap-4">
            <SortableContext items={itemsId}>
               {newItems.map(item => (
                  <DragDropItem key={item.id} item={item} deleteItem={deleteItem} dataCurrentId={dataCurrentId} />
               ))}
            </SortableContext>
         </div>
         {createPortal(<DragOverlay className="!z-[9999]">{activeItem && <DragDropItem item={activeItem} />}</DragOverlay>, document.body)}
      </DndContext>
   );
});

export const DragDropElements = ({ items, className = '', onChange = () => {} }) => {
   const [newItems, setNewItems] = useState(
      [...items].map((item, index) => ({
         id: index + 1,
         el: item,
      }))
   );

   useEffect(() => {
      setNewItems(
         [...items].map((item, index) => ({
            id: index + 1,
            el: item,
         }))
      );
   }, [items]);

   const itemsId = useMemo(() => newItems.map(item => item.id), [newItems]);

   const [activeItem, setActiveItem] = useState(null);

   const sensors = useSensors(
      useSensor(PointerSensor, {
         activationConstraint: {
            distance: 3, // 3px
         },
      })
   );

   const onDragStart = event => {
      if (event.active.data.current?.type === 'Item') {
         setActiveItem(event.active.data.current.item);
         return;
      }
   };

   const onDragEnd = event => {
      const { active, over } = event;
      if (!over) return;
      const activeItemId = active.id;
      const overItemId = over.id;
      if (activeItemId === overItemId) {
         return;
      }

      const activeItemIndex = newItems.findIndex(item => item.id === activeItemId);
      const overItemIndex = newItems.findIndex(item => item.id === overItemId);
      const res = arrayMove(newItems, activeItemIndex, overItemIndex);
      setNewItems(res);
      setTimeout(() => {
         onChange(res);
      }, 250);
   };

   return (
      <DndContext sensors={sensors} onDragStart={onDragStart} onDragEnd={onDragEnd}>
         <div className={className}>
            <SortableContext items={itemsId}>
               {newItems.map(item => {
                  return <DragDropItem key={item.id} item={item} type="element" />;
               })}
            </SortableContext>
         </div>
         {createPortal(
            <DragOverlay className="!z-[9999]">{activeItem && <DragDropItem item={activeItem} type="element" />}</DragOverlay>,
            document.body
         )}
      </DndContext>
   );
};
