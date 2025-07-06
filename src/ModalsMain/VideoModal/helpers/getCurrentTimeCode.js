import { timeToSeconds } from '../../../helpers/timeTo';

const getCurrentTimeCode = (player, timeCodes, currentTime = null) => {
   const index = timeCodes.findIndex(item => timeToSeconds(item.time) > (currentTime || player.currentTime()));

   return timeCodes[index === -1 ? timeCodes.length - 1 : index - 1];
};

export default getCurrentTimeCode;
