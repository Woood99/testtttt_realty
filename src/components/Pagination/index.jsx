import React from 'react';

import styles from './Pagination.module.scss';
import Button from '../../uiForm/Button';
import cn from 'classnames';

const PaginationPage = ({
   currentPage = 1,
   setCurrentPage = () => {},
   total = 1,
   textButton = 'Следующая страница',
   className = '',
   showBtn = true,
}) => {
   const getPageNumbers = () => {
      const pageNumbers = [];
      const maxPagesToShow = 5;

      if (total <= maxPagesToShow) {
         for (let i = 1; i <= total; i++) {
            pageNumbers.push(i);
         }
      } else {
         let start = Math.max(1, currentPage - 2);
         let end = Math.min(total, currentPage + 2);

         if (start === 1) {
            end = start + 4;
         }
         if (end === total) {
            start = end - 4;
         }

         for (let i = start; i <= end; i++) {
            pageNumbers.push(i);
         }

         if (start > 1) {
            pageNumbers.unshift('...');
            pageNumbers.unshift(1);
         }
         if (end < total) {
            pageNumbers.push('...');
            pageNumbers.push(total);
         }
      }

      return pageNumbers;
   };

   if (total <= 1) {
      return '';
   }

   return (
      <div className={cn(styles.PaginationPageRoot, className)}>
         {showBtn && (
            <Button
               variant="secondary"
               className={styles.PaginationPageButton}
               onClick={() => {
                  if (currentPage < total) setCurrentPage(currentPage + 1);
               }}>
               {textButton}
            </Button>
         )}

         <ul className={styles.PaginationPageList}>
            {getPageNumbers().map((page, index) => {
               if (page === '...') {
                  return <li key={index}>...</li>;
               } else {
                  return (
                     <li
                        className={`${styles.PaginationPageItem} ${page === currentPage ? styles.PaginationPageItemActive : ''}`}
                        key={index}
                        onClick={() => setCurrentPage(page)}>
                        {page}
                     </li>
                  );
               }
            })}
         </ul>
      </div>
   );
};

export default PaginationPage;
