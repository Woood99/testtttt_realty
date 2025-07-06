import { timeToSeconds } from '../../../helpers/timeTo';
import formatTime from '../helpers/formatTime';
import getCurrentTimeCode from '../helpers/getCurrentTimeCode';

const timeTooltip = (player, timeCodes) => {
   if (!player) return;
   if (!(timeCodes && timeCodes.length)) return;
   const progressControl = player.controlBar.progressControl;
   const seekBar = progressControl.seekBar.el();

   const tooltip = document.createElement('div');
   const tooltipTime = document.createElement('div');
   const tooltipInfo = document.createElement('div');
   tooltip.appendChild(tooltipTime);
   if (timeCodes.length > 0) {
      tooltipInfo.className = 'mt-2';
      tooltip.appendChild(tooltipInfo);
   }
   seekBar.appendChild(tooltip);

   tooltip.className = 'vjs-tooltip';

   const updateTooltip = event => {
      hideTooltip();
      const rect = seekBar.getBoundingClientRect();
      const offsetX = event.clientX - rect.left;
      const percentage = offsetX / rect.width;
      const time = player.duration() * percentage;
      const formattedTime = formatTime(time);
      tooltipTime.textContent = `${formattedTime}`;
      if (percentage * 100 < 95) {
         tooltip.style.right = `auto`;
         tooltip.style.left = `${offsetX}px`;
      } else {
         tooltip.style.left = `auto`;
         tooltip.style.right = `0px`;
      }
      tooltip.style.opacity = '1';

      const currentTimeCode = getCurrentTimeCode(player, timeCodes, timeToSeconds(formattedTime.trim()));
      if (currentTimeCode) {
         tooltipInfo.textContent = currentTimeCode.title;
      }
   };

   const hideTooltip = () => {
      tooltip.style.opacity = '0';
   };

   seekBar.addEventListener('mousemove', updateTooltip);
   seekBar.addEventListener('mouseleave', hideTooltip);
};

export default timeTooltip;
