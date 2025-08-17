import { useSelector } from 'react-redux';
import Avatar from '../../ui/Avatar';
import { IconСamcorderOff } from '../../ui/Icons';
import { getIsDesktop } from '@/redux';

const UserVideoPlug = ({ videoCallParams, userInfo }) => {
   const isDesktop = useSelector(getIsDesktop);

   return (
      <div className="flex-center-all rounded-2xl p-6 w-full h-full max-h-[250px] md1:max-w-[200px] bg-dark">
         <Avatar size={isDesktop ? 85 : 55} src={userInfo.image} title={userInfo.name} className="" />

         <h3 className="absolute bottom-3 left-3 text-white text-defaultMax font-medium">Вы</h3>
         <IconСamcorderOff width={24} height={24} className="absolute top-3 right-3 fill-red" />
      </div>
   );
};

export default UserVideoPlug;
