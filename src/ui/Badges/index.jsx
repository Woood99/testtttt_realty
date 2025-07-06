import React from 'react';

import styles from './Badges.module.scss';

export const Badges = ({ data, className = '', container = true }) => {
   if (!data || data.length === 0) return;

   const Layout = () => {
      return data.map((item, index) => {
         switch (item) {
            case 'Ипотека, есть одобрение от банка':
               return <BadgeMortgage key={index} />;
            case 'Ипотека, нет одобрения от банка':
               return <BadgeNoMortgage key={index} />;
            case 'Наличные':
               return <BadgeCash key={index} />;
            case 'В сделке будет использоваться сертификат':
               return <BadgeCertificate key={index} />;
            case 'Срочно':
               return <BadgeUrgently key={index} />;
            case 'Рассрочка':
               return <BadgeInstallmentPlan key={index} />;
            case 'Поиск квартиры по ежемесячному платежу':
               return <BadgeMonthlyPayment key={index} />;
            case 'Без первоначального взноса':
               return <BadgeNoDownPayment key={index} />;
            default:
               return '';
         }
      });
   };

   return (
      <>
         {container ? (
            <div className={`${styles.List} ${className}`}>
               <Layout />
            </div>
         ) : (
            <Layout />
         )}
      </>
   );
};

export const Badge = ({ text, variant }) => {
   return <button className={`${styles.Badge} ${styles[variant]}`}>{text}</button>;
};

export const BadgeText = ({ children, color = 'white', variant = '', className = '', animated }) => {
   const classColor = () => {
      switch (color) {
         case 'white':
            return styles.BadgeTextWhite;
         case 'dark':
            return styles.BadgeTextDark;
         default:
            return '';
      }
   };
   const classVariant = () => {
      switch (variant) {
         case 'absolute':
            return styles.BadgeTextAbsolute;
         default:
            return '';
      }
   };

   return (
      <div className={`${styles.BadgeText} ${classColor()} ${classVariant()} ${className}`}>
         {animated ? <div className={styles.BadgeTextAnimated} /> : ''}
         {children}
      </div>
   );
};

export const BadgeMortgage = () => {
   return <Badge variant="BadgeMortgage" text="Ипотека, есть одобрение от банка" />;
};
export const BadgeNoMortgage = () => {
   return <Badge variant="BadgeNoMortgage" text="Ипотека, нет одобрения от банка" />;
};

export const BadgeCash = () => {
   return <Badge variant="BadgeCash" text="Наличные" />;
};

export const BadgeCertificate = () => {
   return <Badge variant="BadgeCertificate" text="В сделке используется сертификат" />;
};

export const BadgeUrgently = () => {
   return <Badge variant="BadgeUrgently" text="Срочно" />;
};
export const BadgeMonthlyPayment = () => {
   return <Badge variant="BadgeMonthlyPayment" text="Поиск квартиры по ежемесячному платежу" />;
};

export const BadgeNoDownPayment = () => {
   return <Badge variant="BadgeNoDownPayment" text="Без первоначального взноса" />;
};

export const BadgeInstallmentPlan = () => {
   return <Badge variant="BadgeInstallmentPlan" text="Рассрочка" />;
};
