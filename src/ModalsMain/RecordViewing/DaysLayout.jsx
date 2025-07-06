import styles from './RecordViewing.module.scss';

import DayLayout from './DayLayout';
import getStringDate from '../../helpers/getStringDate';

const DaysLayout = ({ daysRef, control, onChangeDay }) => {
   const newDate = new Date();
   return (
      <div className={styles.RecordViewingDays} ref={daysRef}>
         {[...new Array(14)].map((_, index) => {
            const date = new Date(newDate.setDate(newDate.getDate() + (index === 0 ? 0 : 1)));
            const stringDate = getStringDate(date);
            return <DayLayout key={index} date={date} stringDate={stringDate} control={control} onChangeDay={onChangeDay} />;
         })}
      </div>
   );
};

export default DaysLayout;
