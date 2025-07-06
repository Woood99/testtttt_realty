import styles from './CardPrimary.module.scss';

export const classVariant = variant => {
   switch (variant) {
      case '':
         return '';
      case 'shadow':
         return styles.CardPrimaryRootShadow;
      default:
         return '';
   }
};
