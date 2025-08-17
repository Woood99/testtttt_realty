import { useContext, useState } from 'react';
import { useLocation } from 'react-router-dom';

import { StreamContext } from '../../context';
import Button from '../../uiForm/Button';
import { IconShareArrow } from '../../ui/Icons';
import ShareModal from '../../ModalsMain/ShareModal';
import { RoutesPath, SellerRoutesPath } from '../../constants/RoutesPath';
import Avatar from '../../ui/Avatar';
import { capitalizeWords } from '../../helpers/changeString';
import { ExternalLink } from '../../ui/ExternalLink';

const StreamInfo = () => {
   const { data } = useContext(StreamContext);
   const location = useLocation();

   const [isShareModal, setIsShareModal] = useState(false);

   return (
      <>
         <div className="mt-4">
            <div>
               <div className="flex justify-between gap-2">
                  <h2 className="title-2">{data?.stream.title}</h2>
                  <div className="flex gap-2">
                     {data?.user_status.is_broadcaster && location.pathname.includes(SellerRoutesPath.stream.broadcaster) && (
                        <ExternalLink to={`${RoutesPath.stream.view}${data?.stream.id}`}>
                           <Button Selector="div" variant="secondary" size="32" className="flex gap-2 items-center text-blue">
                              Перейти на страницу стрима
                           </Button>
                        </ExternalLink>
                     )}
                     {data?.user_status.is_broadcaster && location.pathname.includes(RoutesPath.stream.view) && (
                        <ExternalLink to={`${SellerRoutesPath.stream.broadcaster}${data?.stream.id}`}>
                           <Button Selector="div" variant="secondary" size="32" className="flex gap-2 items-center text-blue">
                              Перейти в настройки стрима
                           </Button>
                        </ExternalLink>
                     )}

                     <Button variant="secondary" size="32" className="flex gap-2 items-center text-blue" onClick={() => setIsShareModal(true)}>
                        <IconShareArrow className="fill-blue" width={16} height={16} />
                        Поделиться
                     </Button>
                  </div>
               </div>
               <p className="mt-4 leading-5">{data?.stream.description}</p>
               <div className="mt-8">
                  <h3 className="title-2-5">Автор</h3>
                  <div className="mt-4 flex items-center gap-4 p-6 bg-primary600 rounded-xl relative">
                     <Avatar size={110} src={data?.stream.user.image} title={data?.stream.user.name} />
                     <div>
                        <p className="title-2-5">{capitalizeWords(data?.stream.user.name, data?.stream.user.surname)}</p>
                        <p className="mt-1 text-primary400 text-small">Менеджер отдела продаж</p>
                     </div>
                     <Button className="ml-auto relative z-20" size="Small" disabled={data?.user_status?.is_broadcaster} onClick={() => {}}>
                        Задать вопрос в чат
                     </Button>
                  </div>
               </div>
            </div>
         </div>
         <ShareModal
            condition={isShareModal}
            set={setIsShareModal}
            title="Поделиться"
            url={window.location.origin + `${RoutesPath.stream.view}${data?.stream.id}`}
         />
      </>
   );
};

export default StreamInfo;
