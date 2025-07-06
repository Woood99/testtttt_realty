import styles from './CardPrimaryRow.module.scss';

export const classVariant = variant => {
   switch (variant) {
      case '':
         return '';
      case 'shadow':
         return styles.CardPrimaryRowRootShadow;
      default:
         return '';
   }
};
