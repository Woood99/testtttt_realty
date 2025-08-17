import React, { memo, useState } from 'react';

import styles from './CardGallery.module.scss';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import getSrcImage from '../../helpers/getSrcImage';
import { getIsDesktop } from '@/redux';

const CardGallery = memo(({ images, title, href = '#', className = '', badge, imageFit = 'cover', imageWidth, imageHeight, maxImagesLength = 8 }) => {
   const isDesktop = useSelector(getIsDesktop);

   return (
      <>
         {isDesktop ? (
            <Desktop
               images={images}
               title={title}
               className={className}
               href={href}
               badge={badge}
               imageFit={imageFit}
               imageWidth={imageWidth}
               imageHeight={imageHeight}
            />
         ) : (
            <Mobile
               images={images}
               title={title}
               className={className}
               href={href}
               badge={badge}
               imageFit={imageFit}
               imageWidth={imageWidth}
               imageHeight={imageHeight}
               maxImagesLength={maxImagesLength}
            />
         )}
      </>
   );
});

const Desktop = memo(({ images, title, href, className = '', badge, imageFit, imageWidth, imageHeight }) => {
   const isDesktop = useSelector(getIsDesktop);
   const [activeImageIndex, setActiveImageIndex] = useState(0);

   const handleMouseEnter = index => {
      if (!isDesktop) return;
      if (index !== undefined) {
         setActiveImageIndex(index);
      }
   };

   return (
      <Link to={href} target="_blank" rel="noopener noreferrer" className={`${styles.CardGalleryTop} ${className}`}>
         {badge}
         <div className={styles.CardGalleryImages}>
            {images.map((image, index) => {
               if (index < 3) {
                  return (
                     <div key={index} className={styles.CardGalleryImageWrapper} onMouseEnter={() => handleMouseEnter(index)}>
                        <div className={styles.CardGalleryImage}>
                           <img
                              src={getSrcImage(image)}
                              className={`${imageFit === 'contain' ? '!object-contain' : ''}`}
                              width={imageWidth}
                              height={imageHeight}
                              alt={title}
                           />
                        </div>
                     </div>
                  );
               }
            })}
            {images.length > 3 && (
               <div className={styles.CardGalleryImageWrapper} onMouseEnter={() => handleMouseEnter()}>
                  <div className={styles.CardGalleryImage}>
                     <div className={styles.CardGalleryMore}>Показать ещё {images.length - 3} фото</div>
                     <img src={getSrcImage(images[0])} className={`${imageFit === 'contain' ? '!object-contain' : ''}`} alt={title} />
                  </div>
               </div>
            )}
            {images.length > 1 ? (
               <div className={styles.CardGalleryPagination}>
                  {images.map((_, index) => {
                     if (index < 3) {
                        return (
                           <span
                              className={`${styles.PaginationItem} ${activeImageIndex === index ? styles.PaginationItemActive : ''}`}
                              key={index}></span>
                        );
                     }
                  })}
               </div>
            ) : (
               ''
            )}
         </div>
      </Link>
   );
});

const Mobile = memo(({ images, title, href, badge, imageFit, imageWidth, imageHeight, maxImagesLength = 8 }) => {
   return (
      <Link to={href} target="_blank" rel="noopener noreferrer" className={styles.CardGalleryTop}>
         {badge}
         <Swiper className={`${styles.CardGalleryImages} CardGallerySwiper`} slidesPerView={1} spaceBetween={0}>
            {images.slice(0, maxImagesLength).map((image, index) => {
               return (
                  <SwiperSlide key={index} className={styles.CardGalleryImageWrapper}>
                     <div className={styles.CardGalleryImage}>
                        <img
                           src={getSrcImage(image)}
                           className={`${imageFit === 'contain' ? '!object-contain' : ''}`}
                           width={imageWidth}
                           height={imageHeight}
                           alt={title}
                        />
                     </div>
                  </SwiperSlide>
               );
            })}
         </Swiper>
      </Link>
   );
});

export default CardGallery;
