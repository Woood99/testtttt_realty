import { useContext, useEffect, useState } from 'react';
import videojs from 'video.js';
import cn from 'classnames';

import { playerLocalRu } from '../../ModalsMain/VideoModal/components/playerLocalRu';
import { StreamContext } from '../../context';
import dayjs from 'dayjs';
import { declensionWordsDays } from '../../helpers/declensionWords';
import { IconPlay } from '../../ui/Icons';

const StreamPlayer = ({ playerRef, muted = false, className }) => {
   const { data, is_live, streamParams } = useContext(StreamContext);
   const [isPaused, setIsPaused] = useState(true);

   useEffect(() => {
      const handlePlay = () => setIsPaused(false);
      const handlePause = () => setIsPaused(true);

      const player = videojs(playerRef.current, {
         controls: true,
         autoplay: true,
         muted,
         language: 'ru',
         techOrder: ['html5'],
         html5: {
            nativeAudioTracks: false,
            nativeVideoTracks: false,
            hls: { overrideNative: true },
            dash: { overrideNative: true },
         },
      });

      player.on('play', handlePlay);
      player.on('pause', handlePause);

      videojs.addLanguage('ru', playerLocalRu);

      if (playerRef) {
         playerRef.current.videojs = player;
         playerRef.current.videoEl = playerRef.current;
      }

      return () => player.dispose();
   }, []);

   return (
      <div className={cn('video-player video-player-default', className)}>
         <video ref={playerRef} autoPlay muted={muted} playsInline className="video-js w-full h-[550px] max-h-[550px]" />
         {is_live && !streamParams.mediaStream && !streamParams.isLoading && (
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 title-2 !text-white text-center">
               <p>Соединение потеряно</p>
               {data.user_status?.is_broadcaster && <p className="mt-1">Завершите трансляцию</p>}
            </div>
         )}
         {!is_live && !streamParams.mediaStream && data?.stream.status === 'ended' && !streamParams.isLoading && (
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 title-2 !text-white text-center">
               <p>Трансляция завершена</p>
               {data.user_status?.is_broadcaster && <p className="mt-1">При необходимости запустите снова</p>}
            </div>
         )}
         {!is_live && !streamParams.mediaStream && data?.stream.status === 'scheduled' && !streamParams.isLoading && (
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 title-2 !text-white text-center">
               <p>Начнется через {declensionWordsDays(dayjs(data.stream.scheduled_start).diff(dayjs(), 'day'))}</p>
               <p className="mt-1">{dayjs(data.stream.scheduled_start).format('D MMMM в HH:mm')}</p>
            </div>
         )}
         {is_live && streamParams.mediaStream && !streamParams.isLoading && isPaused && (
            <>
               <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 title-2 !text-white text-center">
                  <IconPlay className="fill-white" width={46} height={46} />
               </div>
            </>
         )}
      </div>
   );
};

export default StreamPlayer;
