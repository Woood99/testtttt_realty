import { useEffect, useRef } from 'react';

export const useRingtone = (isCalling, ringtone = '/ringtone.mp3') => {
   const audioRef = useRef(null);
   const channelRef = useRef(null);
   const tabIdRef = useRef(Date.now().toString()); // Уникальный ID вкладки

   useEffect(() => {
      channelRef.current = new BroadcastChannel('rington_channel');

      // Обработчик сообщений от других вкладок
      const handleMessage = event => {
         if (event.data.type === 'claim_leadership') {
            // Если другая вкладка объявила себя лидером, а мы играем — останавливаемся
            if (audioRef.current && !audioRef.current.paused && event.data.tabId !== tabIdRef.current) {
               audioRef.current.pause();
               audioRef.current.currentTime = 0;
            }
         }
      };

      channelRef.current.addEventListener('message', handleMessage);

      // Создаем аудио-элемент
      if (!audioRef.current) {
         audioRef.current = new Audio(ringtone);
         audioRef.current.loop = true;
      }

      const audio = audioRef.current;

      if (isCalling) {
         // 1. Заявляем права на воспроизведение
         channelRef.current.postMessage({
            type: 'claim_leadership',
            tabId: tabIdRef.current,
         });

         // 2. Пытаемся играть (даже если вкладка неактивна)
         audio.volume = 0.25;
         audio
            .play()
            .catch(error => {
               console.error('Ошибка воспроизведения:', error);
            })
            .finally(() => {
               audio.volume = 0.25;
            });
      } else {
         audio.pause();
         audio.currentTime = 0;
      }

      return () => {
         if (audio) {
            audio.pause();
            audio.currentTime = 0;
         }
         if (channelRef.current) {
            channelRef.current.removeEventListener('message', handleMessage);
            channelRef.current.close();
         }
      };
   }, [isCalling, ringtone]);

   // Дополнительно: Отслеживаем закрытие вкладки, чтобы передать лидерство
   useEffect(() => {
      const handleBeforeUnload = () => {
         if (isCalling && !audioRef.current?.paused) {
            // Перед закрытием сообщаем другим вкладкам, что они могут перехватить лидерство
            channelRef.current?.postMessage({
               type: 'leader_left',
            });
         }
      };

      window.addEventListener('beforeunload', handleBeforeUnload);
      return () => {
         window.removeEventListener('beforeunload', handleBeforeUnload);
      };
   }, [isCalling]);
};
