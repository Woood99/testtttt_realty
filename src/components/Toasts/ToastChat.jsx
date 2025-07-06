import { Link, useLocation } from 'react-router-dom';
import Avatar from '../../ui/Avatar';
import { IconMegaphone, IconUsers } from '../../ui/Icons';
import getSrcImage from '../../helpers/getSrcImage';
import { ThumbPhotoDefault } from '../../ui/ThumbPhoto';
import { AuthRoutesPath } from '../../constants/RoutesPath';
import { ROLE_ADMIN } from '../../constants/roles';
import { CHAT_TYPES } from '../Chat/constants';
import { GetDescrHTML } from '../BlockDescr/BlockDescr';

const ToastChat = ({ data }) => {
   const location = useLocation();
   const is_chat = data.dialog_type === CHAT_TYPES.CHAT;
   const type_group = data.dialog_type === CHAT_TYPES.GROUP;
   const type_channel = data.dialog_type === CHAT_TYPES.CHANNEL;

   const info = is_chat ? (data.user.role === ROLE_ADMIN.id ? data.organization : data.user) : { name: data.name, image: data.image };
   const message = data.message;

   const audio = message.files.find(item => item.type === 'audio');
   const video = message.files.find(item => item.type === 'video');
   const photos = message.photos;

   if (location.pathname === AuthRoutesPath.chat) {
      return null;
   }

   return (
      <Link to={`${AuthRoutesPath.chat}?dialog=${data.dialog_id}`} className="w-full flex gap-3 overflow-hidden">
         <Avatar size={54} src={info.image} title={info.name} />
         <div className="mt-2 w-[90%] overflow-hidden">
            <p className="title-4 cut cut-1 flex mb-1">
               {type_group && <IconUsers className="mr-1" width={14} height={14} />}
               {type_channel && <IconMegaphone className="mr-1" width={14} height={14} />}
               <span>{info.name}</span>
            </p>
            <div className="w-full flex gap-1">
               {!is_chat && <span className="text-blue font-medium whitespace-nowrap">{data.user.name}:</span>}

               <div className="flex items-center cut-one w-full">
                  {Boolean(photos.length) && (
                     <div className="flex gap-1 mr-1">
                        {photos.map((photo, index) => {
                           return (
                              <ThumbPhotoDefault key={index} style={{ width: 15, height: 15, borderRadius: 2 }}>
                                 <img src={getSrcImage(photo)} />
                              </ThumbPhotoDefault>
                           );
                        })}
                     </div>
                  )}
                  {Boolean(video) && (
                     <div className="flex gap-1 mr-1">
                        <ThumbPhotoDefault style={{ width: 15, height: 15, borderRadius: 2 }}>
                           <img src={getSrcImage(video.preview || '')} />
                        </ThumbPhotoDefault>
                     </div>
                  )}
                  {Boolean(audio) && <span className="text-dark cut-one">Голосовое сообщение</span>}
                  {Boolean(photos.length) && !message.text && <span className="text-dark cut-one">Фотография</span>}
                  {Boolean(video && !message.text && !photos.length) && <span className="text-dark cut-one">Видео</span>}
                  {console.log(message.text)}
                  {Boolean(message.text) && (
                     <div className="text-dark cut cut-1">
                        <GetDescrHTML data={message.text} />
                     </div>
                  )}
               </div>
            </div>
         </div>
      </Link>
   );
};

export default ToastChat;
