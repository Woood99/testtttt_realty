import React from 'react';
import cn from 'classnames';

import styles from './Tag.module.scss';
import numberReplace from '../../helpers/numberReplace';

import presentImg from '../../assets/img/present.png';
import { Tooltip } from '../Tooltip';
import { IconInfoTooltip, IconLightning } from '../Icons';
import { RoutesPath } from '../../constants/RoutesPath';
import { ExternalLink } from '../ExternalLink';

import dayjs from 'dayjs';
import { getMaxDiscount } from '../../helpers/discountUtils';

const Tag = ({
   size = 'default',
   color = 'default',
   children,
   childrenRoot,
   onClick = () => {},
   value,
   className = '',
   tagObj = {},
   hoverEnable,
   disabled = false,
   isError = false,
}) => {
   let isActive = Boolean(value);
   const onClickHandler = () => {
      onClick(!isActive);
   };

   const currentSizeClass = () => {
      switch (size) {
         case 'small':
            return styles.TagSmall;
         case 'medium':
            return styles.TagMediumSize;
         case 'big':
            return styles.TagBig;
         default:
            return '';
      }
   };

   const currentColorClass = () => {
      switch (color) {
         case 'default':
            return '';
         case 'green':
            return styles.TagGreen;
         case 'green-second':
            return styles.TagGreenSecond;
         case 'aqua':
            return styles.TagAqua;
         case 'red':
            return styles.TagRed;
         case 'yellow':
            return styles.TagYellow;
         case 'purple':
            return styles.TagPurple;
         case 'darkGreen':
            return styles.TagDarkGreen;
         case 'blue':
            return styles.TagBlue;
         case 'select':
            return styles.TagSelect;
         case 'white':
            return styles.TagWhite;
         case 'choice':
            return styles.TagChoice;
         default:
            return '';
      }
   };

   if (tagObj && tagObj.link) {
      return (
         <Tooltip
            mobile
            color="white"
            ElementTarget={() => (
               <button
                  type="button"
                  onClick={onClickHandler}
                  className={cn(
                     'relative z-[98]',
                     styles.Tag,
                     styles.TagHoverEnable,
                     currentSizeClass(),
                     currentColorClass(),
                     isActive && color === 'choice' ? styles.TagChoiceActive : styles.TagActive,
                     className
                  )}>
                  <div className={`${tagObj.link ? 'flex !items-center gap-1' : ''}`}>
                     {children}
                     {Boolean(tagObj.link) && <IconInfoTooltip width={14} height={14} />}
                  </div>
               </button>
            )}>
            <div className="pr-8 flex flex-col items-start gap-2">
               {tagObj.name}
               <a href={tagObj.link} target="_blank" className="blue-link">
                  Подробнее
               </a>
            </div>
         </Tooltip>
      );
   } else {
      return (
         <button
            type="button"
            onClick={onClickHandler}
            className={cn(
               'relative z-[98]',
               styles.Tag,
               hoverEnable && styles.TagHoverEnable,
               currentSizeClass(),
               currentColorClass(),
               isActive && styles.TagActive,
               className,
               disabled && styles.TagDisabled,
               isError && styles.TagError
            )}>
            <div>{children}</div>
            {childrenRoot}
         </button>
      );
   }
};

export const TagCashback = ({ cashback = '', prefix = 'Кешбэк до', increased, placement = 'bottom' }) => {
   if (!cashback) return;

   const is_increased = Boolean(increased?.value);

   return (
      <Tooltip
         mobile
         ElementTarget={() => (
            <Tag size="small" color="green">
               {is_increased && <IconLightning width={11} height={11} />} {prefix} {numberReplace(cashback)} ₽
            </Tag>
         )}
         classNameContent="mmd1!p-6"
         placement={placement}
         offset={[5, 5]}>
         <h3 className="title-3-5 !text-white md1:!text-dark">{is_increased && 'Повышенный'} Кешбэк за покупку объекта</h3>
         <p className="mt-2">Начислим наличными за покупку на банковскую карту.</p>
         <ExternalLink to={RoutesPath.cashbackConditions} className="mmd1:text-white underline font-medium mt-2.5">
            Условия акции «Кешбэк»
         </ExternalLink>
      </Tooltip>
   );
};

export const TagPresent = ({ present = '', title = 'Подарок' }) => {
   return (
      present && (
         <Tag size="small" color="purple">
            <span className="flex items-center gap-2 w-max">
               <img src={presentImg} width={15} height={15} alt="Подарок" />
               {title}
            </span>
         </Tag>
      )
   );
};

export const TagPresents = ({ dataMainGifts = [], dataSecondGifts = [], title = 'Подарки', placement = 'bottom' }) => {
   const data = [...dataMainGifts, ...dataSecondGifts];
   if (!data.length) return;

   return (
      <Tooltip placement={placement} offset={[5, 5]} mobile color="dark" ElementTarget={() => <TagPresent present title={title} />}>
         <div className="mmd1:pr-8 flex flex-col items-start gap-4">
            {Boolean(dataMainGifts.length) && (
               <div>
                  <p className="font-medium mb-2">Гарантированные подарки:</p>
                  <div className="flex flex-col items-start gap-2">
                     {dataMainGifts.map((tag, index) => (
                        <Tag size="small" key={index}>
                           {tag}
                        </Tag>
                     ))}
                  </div>
               </div>
            )}
            {Boolean(dataSecondGifts.length) && (
               <div>
                  <p className="font-medium mb-2">Подарки на выбор:</p>
                  <div className="flex flex-col items-start gap-2 ">
                     {dataSecondGifts.map((tag, index) => (
                        <Tag size="small" key={index}>
                           {tag}
                        </Tag>
                     ))}
                  </div>
               </div>
            )}
         </div>
      </Tooltip>
   );
};

export const TagTop = ({ top = '' }) => {
   return (
      top && (
         <Tag size="small" color="aqua">
            {top}
         </Tag>
      )
   );
};

export const TagsDiscounts = ({ discounts, is_building, by_price, by_area }) => {
   if (!discounts || !discounts.length) return;

   const currentDiscount = getMaxDiscount({ discounts, by_price, by_area });
   if (!currentDiscount) return;

   return <TagDiscount {...currentDiscount} is_building={is_building} prefix={discounts.length > 1 ? 'Скидка до' : 'Скидка'} />;
};

export const TagDiscount = ({ type, unit, value, start_date, end_date, prefix = 'Скидка', is_building = false }) => {
   if (!value) return;
   const typeSuffix = type === 1 ? '%' : '₽';

   const start_date_format = dayjs(start_date).format('DD.MM.YYYY');
   const end_date_format = dayjs(end_date).format('DD.MM.YYYY');

   return (
      <Tooltip
         mobile
         ElementTarget={() => (
            <Tag size="small" color="yellow">
               <div className="flex items-center gap-1">
                  {prefix}
                  <span>
                     -{numberReplace(value)} {typeSuffix}
                  </span>
                  {Boolean(unit === 2) && <span className="-ml-1">/м²</span>}
                  <IconInfoTooltip width={16} height={16} className="!stroke-[#bc9829]" />
               </div>
            </Tag>
         )}>
         <div className="font-medium text-center">
            {is_building ? (
               <>
                  Скидка {numberReplace(value)} {typeSuffix} на определённые квартиры <br />
                  Действует с {start_date_format} до {end_date_format}
               </>
            ) : (
               <>
                  Скидка действует с {start_date_format} <br /> до {end_date_format} на данную квартиру
               </>
            )}
         </div>
      </Tooltip>
   );
};

export default Tag;
