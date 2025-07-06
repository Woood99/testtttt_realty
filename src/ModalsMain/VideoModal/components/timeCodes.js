import isEmptyArrObj from '../../../helpers/isEmptyArrObj';
import { timeToSeconds } from '../../../helpers/timeTo';
import getCurrentTimeCode from '../helpers/getCurrentTimeCode';

const timeCodes = (player, data, arr) => {
   if (!data.timeCodes || isEmptyArrObj(data.timeCodes)) return;

   

   const addMarkers = () => {
      const timelineEl = player.controlBar.progressControl.seekBar.el();
      
      data.forEach(item => {
         const marker = document.createElement('div');
         marker.className = 'vjs-marker';
         marker.style.left = (timeToSeconds(item.time) / player.duration()) * 100 + '%';
         marker.title = item.title;
         timelineEl.appendChild(marker);
      });
   };

   const currentTimeCodeEl = document.createElement('div');
   currentTimeCodeEl.className = 'vjs-timecode-title vjs-control vjs-button';
   player.controlBar.el().insertBefore(currentTimeCodeEl, player.controlBar.getChild('progressControl').el());

   const showCurrentTitle = () => {
      const currentTimeCode = getCurrentTimeCode(player, data);

      if (currentTimeCode) {
         currentTimeCodeEl.innerHTML = `<span>•</span> ${currentTimeCode.title}`;
      }
   };

   player.on('loadedmetadata', addMarkers);
   player.on('loadedmetadata', showCurrentTitle);
   arr.push(showCurrentTitle);
};

export default timeCodes;
