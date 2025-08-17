import { useContext } from 'react';
import { ChatContext } from '../../../../context';
import { RoutesPath } from '../../../../constants/RoutesPath';
import { ThumbPhotoDefault } from '../../../../ui/ThumbPhoto';
import WebSkeleton from '../../../../ui/Skeleton/WebSkeleton';
import getSrcImage from '../../../../helpers/getSrcImage';
import { ExternalLink } from '../../../../ui/ExternalLink';
import { useSelector } from 'react-redux';
import { getIsDesktop } from '@/redux';

const ChatMainBuildingTop = () => {
   const { isLoadingDialog, dialogBuilding, setApartmentsByBuildingModal, allowScroll } = useContext(ChatContext);
   const isDesktop = useSelector(getIsDesktop);

   if (isLoadingDialog || allowScroll) {
      return (
         <div className="px-4 py-2 flex items-center gap-3 bg-white">
            <WebSkeleton className="w-[55px] h-[45px] rounded-lg" />
            <WebSkeleton className="w-[200px] h-[40px] rounded-lg" />
         </div>
      );
   }

   if (!Boolean(dialogBuilding)) return;

   return (
      <div className="bg-white p-2 md1:p-0">
         <div className="flex items-center gap-3 group bg-pageColor p-1.5 pr-3 mmd1:rounded-lg relative md1:px-4">
            <ExternalLink to={`${RoutesPath.building}${dialogBuilding.id}`} className="CardLinkElement" />
            <ThumbPhotoDefault style={{ width: isDesktop ? 55 : 50, height: isDesktop ? 45 : 40, borderRadius: 8 }}>
               <img src={getSrcImage(dialogBuilding.images[0])} />
            </ThumbPhotoDefault>
            <div>
               <h4 className="title-4 hover:!text-blue">ЖК {dialogBuilding.name}</h4>
               <p className="mt-1 text-dark">{dialogBuilding.address}</p>
            </div>
            <button type="button" className="blue-link z-10 text-small self-center ml-auto" onClick={() => setApartmentsByBuildingModal(true)}>
               Квартиры ЖК
            </button>
         </div>
      </div>
   );
};

export default ChatMainBuildingTop;
