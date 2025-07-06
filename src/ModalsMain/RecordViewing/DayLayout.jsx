import { Controller } from 'react-hook-form';
import styles from './RecordViewing.module.scss';
import { IconChecked } from '../../ui/Icons';
import { dataMaps } from './dataMaps';

const DayLayout = ({ date, stringDate, control, onChangeDay }) => {
   return (
      <Controller
         name="dateField"
         control={control}
         rules={{ required: true }}
         defaultValue={stringDate}
         render={({ field }) => (
            <li className={`${styles.RecordViewingDayItem} ${field.value === stringDate ? styles.RecordViewingActive : ''}`}>
               <div className={styles.RecordViewingDayCheck} aria-hidden="true">
                  <IconChecked />
               </div>
               <input
                  type="radio"
                  value={stringDate}
                  checked={field.value === stringDate}
                  onChange={() => {
                     field.onChange(stringDate);
                     onChangeDay(stringDate);
                  }}
                  className={styles.RecordViewingDayInput}
               />
               <span className={styles.RecordViewingDayWeek}>{dataMaps.daysOfWeek[date.getDay()]}</span>
               <span className={styles.RecordViewingDayMonth}>{date.getDate()}</span>
               <span className={styles.RecordViewingMonth}>{dataMaps.months[date.getMonth()]}</span>
            </li>
         )}
      />
   );
};

export default DayLayout;
