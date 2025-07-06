import { useSelector } from 'react-redux';
import isEmptyArrObj from '../../../../../helpers/isEmptyArrObj';
import { getUserInfo } from '../../../../../redux/helpers/selectors';
import getSrcImage from '../../../../../helpers/getSrcImage';
import { ThumbPhotoDefault } from '../../../../../ui/ThumbPhoto';
import { GetDescrHTML } from '../../../../BlockDescr/BlockDescr';

const LastMessageTextLayout = ({ data }) => {
   const last_message = data.last_message;
   if (!(last_message && !isEmptyArrObj(last_message))) return;

   const userInfo = useSelector(getUserInfo);

   const photos = last_message.photos || [];
   const video = last_message.files?.filter(item => item.type === 'video')?.[0];
   const audio = last_message.files?.filter(item => item.type === 'audio');

   return (
      <div className="flex gap-1">
         <span className="text-blue font-medium">{userInfo.id === last_message.user.id ? 'Вы' : last_message.user.name}:</span>
         <div className="flex items-center min-w-0">
            {Boolean(photos.length) && (
               <div className="flex gap-1 mr-1">
                  {photos.map((photo, index) => {
                     return (
                        <ThumbPhotoDefault key={index} style={{ width: 15, height: 15, borderRadius: 2 }}>
                           <img src={getSrcImage(photo.url)} />
                        </ThumbPhotoDefault>
                     );
                  })}
               </div>
            )}
            {Boolean(video) && (
               <ThumbPhotoDefault style={{ width: 15, height: 15, borderRadius: 2, marginRight: 4 }}>
                  <img src={getSrcImage(video.preview || '')} />
               </ThumbPhotoDefault>
            )}
            {Boolean(audio.length) && <span className="cut-one">Голосовое сообщение</span>}
            {Boolean(photos.length) && !last_message.text && <span className="cut-one">Фотография</span>}
            {Boolean(video) && !last_message.text && <span className="cut-one">Видео</span>}
            {Boolean(last_message.text) && (
               <div className="cut cut-1">
                  <GetDescrHTML data={last_message.text} />
               </div>
            )}
         </div>
      </div>
   );
};

export default LastMessageTextLayout;
