import { useContext } from 'react';
import { StreamContext } from '../../context';
import Button from '../../uiForm/Button';

const StreamControlsBasic = () => {
   const { startStream, is_live, endStream, getInfoStream } = useContext(StreamContext);

   return (
      <div className="flex items-center gap-2 flex-wrap">
         <Button size="Small" onClick={startStream} disabled={is_live}>
            Включить стрим
         </Button>
         <Button
            size="Small"
            variant="red"
            disabled={!is_live}
            onClick={async () => {
               await endStream();
               getInfoStream();
            }}>
            Завершить стрим
         </Button>
      </div>
   );
};

export default StreamControlsBasic;
