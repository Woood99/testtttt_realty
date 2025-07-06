import React, { useContext, useState } from 'react';
import { SpecialistPageContext } from '../../../context';
import { ThumbPhoto } from '../../../ui/ThumbPhoto';
import getSrcImage from '../../../helpers/getSrcImage';
import ModalWrapper from '../../../ui/Modal/ModalWrapper';
import { GalleryModalDefault } from '../../../ModalsMain/GalleryModal';
import { GalleryDefaultLayout } from '../../../components/GalleryDefault';
import SpecialistPageSidebar from './SpecialistPageSidebar';

const SpecialistPageAbout = () => {
   const { data } = useContext(SpecialistPageContext);

   const [isOpenModalGallery, setIsOpenModalGallery] = useState(false);

   if (!data.description && !(data.photos && data.photos.length)) return;

   return (
      <section className="white-block">
         <h3 className="title-3 mb-4">О себе</h3>
         {data.videoUrl && (
            <div>
               <h3 className="title-3 mb-2">Видео</h3>
               video-block
            </div>
         )}
         {data.photos && data.photos.length ? (
            <div className="mt-8">
               <h3 className="title-3">Дипломы и награды</h3>
               <div className="mt-4 flex gap-8 flex-wrap">
                  {data.photos.map((photo, index) => {
                     return (
                        <ThumbPhoto key={index} onClick={() => setIsOpenModalGallery(index + 1)} size={100} className="cursor-pointer">
                           <img src={getSrcImage(photo)} />
                        </ThumbPhoto>
                     );
                  })}
               </div>
            </div>
         ) : (
            ''
         )}

         <ModalWrapper condition={isOpenModalGallery !== false}>
            <GalleryModalDefault condition={isOpenModalGallery !== false} set={setIsOpenModalGallery}>
               <div className="grid mmd1:grid-cols-[1fr_minmax(auto,350px)] gap-x-5">
                  <GalleryDefaultLayout images={data.photos} classNameRoot="!max-h-[70vh] !h-[700px]" startIndex={isOpenModalGallery} />
                  <SpecialistPageSidebar />
               </div>
            </GalleryModalDefault>
         </ModalWrapper>
      </section>
   );
};

export default SpecialistPageAbout;
