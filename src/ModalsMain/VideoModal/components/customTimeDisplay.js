import formatTime from '../helpers/formatTime';

const customTimeDisplay = (player, arr, condition = true) => {
   const remainingTime = player.controlBar.getChild('RemainingTimeDisplay');
   if (!remainingTime) return;
   remainingTime.dispose();

   if (condition) {
      const customTimeDisplay = document.createElement('div');
      customTimeDisplay.className = 'vjs-custom-time vjs-control vjs-button';

      player.controlBar.el().insertBefore(customTimeDisplay, player.controlBar.getChild('progressControl').el());

      const updateCustomTimeDisplay = () => {
         customTimeDisplay.textContent = `${formatTime(player.currentTime())} / ${formatTime(player.duration())}`;
      };
      arr.push(updateCustomTimeDisplay);
      player.on('loadedmetadata', updateCustomTimeDisplay);
   }
};

export default customTimeDisplay;
