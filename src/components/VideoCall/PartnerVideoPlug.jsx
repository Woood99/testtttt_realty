import { capitalizeWords } from '../../helpers/changeString';
import Avatar from '../../ui/Avatar';
import { IconMicrophoneOff } from '../../ui/Icons';
import UserPosition from '../../ui/UserPosition';

const PartnerVideoPlug = ({ currentDialog, videoCallParams }) => {   
   if (!currentDialog) return;
   return (
      <div className="flex flex-col items-center rounded-2xl p-6 w-[350px] h-max bg-dark relative">
         <h3 className="text-bigSmall text-white mb-2 text-center font-medium">
            <UserPosition role={currentDialog.companion.role} />
            &nbsp;{capitalizeWords(currentDialog.companion.name, currentDialog.companion.surname)}
         </h3>

         <p className="mb-5 text-primary400 text-center">У собеседника выключена камера</p>

         <Avatar size={120} src={currentDialog.companion.image} title={currentDialog.companion.name} />

         <div className="absolute top-2 right-2 flex gap-3 flex-col">
            {!videoCallParams.statusCompanionMedia.audio && <IconMicrophoneOff width={24} height={24} className="fill-red" />}
         </div>
      </div>
   );
};

export default PartnerVideoPlug;
