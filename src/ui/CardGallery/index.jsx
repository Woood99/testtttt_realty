import React, { useState, useEffect } from 'react';

import styles from './CardGallery.module.scss';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import getSrcImage from '../../helpers/getSrcImage';
import { getIsDesktop } from '../../redux/helpers/selectors';

const CardGallery = ({ images, title, href = '#', className = '', badge, imageFit = 'cover' }) => {
   const isDesktop = useSelector(getIsDesktop);

   return (
      <>
         {isDesktop ? (
            <Desktop images={images} title={title} className={className} href={href} badge={badge} imageFit={imageFit} />
         ) : (
            <Mobile images={images} title={title} className={className} href={href} badge={badge} imageFit={imageFit} />
         )}
      </>
   );
};

const Desktop = ({ images, title, href, className = '', badge, imageFit }) => {
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
                           <img src={getSrcImage(image)} className={`${imageFit === 'contain' ? '!object-contain' : ''}`} alt={title} />
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
};

const Mobile = ({ images, title, href, className = '', badge, imageFit }) => {
   return (
      <Link to={href} target="_blank" rel="noopener noreferrer" className={styles.CardGalleryTop}>
         {badge}
         <Swiper className={`${styles.CardGalleryImages} CardGallerySwiper`} slidesPerView={1} spaceBetween={0}>
            {images.map((image, index) => {
               return (
                  <SwiperSlide key={index} className={styles.CardGalleryImageWrapper}>
                     <div className={styles.CardGalleryImage}>
                        <img src={getSrcImage(image)} className={`${imageFit === 'contain' ? '!object-contain' : ''}`} alt={title} />
                     </div>
                  </SwiperSlide>
               );
            })}
         </Swiper>
      </Link>
   );
};

export default CardGallery;
