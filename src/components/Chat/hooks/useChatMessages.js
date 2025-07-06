import { useEffect, useRef, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import getImagesObj from '../../../unifComponents/getImagesObj';

export const useChatMessages = options => {
   const { mainBlockBar, filesUpload, setFilesUpload, setIsVisibleBtnArrow, isLoadingDialog, allowScroll, setAllowScroll, messages } = options;

   const [filesLimitModal, setFilesLimitModal] = useState(false);
   const [activeAudio, setActiveAudio] = useState(null);
   const [currentlyPlayingId, setCurrentlyPlayingId] = useState(null);
   const firstUnreadRef = useRef(null);

   const observerRef = useRef();
   const isActiveRef = useRef(true);

   const handlePlayAudio = audioElement => {
      if (activeAudio && activeAudio !== audioElement) {
         activeAudio.pause();
         activeAudio.currentTime = 0;
      }
      setActiveAudio(audioElement);
   };

   const handleStopAudio = () => {
      if (activeAudio) {
         activeAudio.pause();
         activeAudio.currentTime = 0;
         setActiveAudio(null);
      }
   };

   const addFile = data => {
      const newData = [...filesUpload, ...data];

      const photosData = getImagesObj(
         newData.filter(item => {
            return (item.type || item.file.type).startsWith('image');
         })
      ).map(item => ({
         ...item,
         type: 'image',
      }));

      const videoData = newData
         .filter(item => {
            return item.type.startsWith('video');
         })
         .map(item => ({
            file: item.file || item,
            type: 'video',
         }));

      const resData = [...photosData, ...videoData];
      if (resData.length > 10) {
         setFilesLimitModal(resData.length);
      } else {
         setFilesUpload(resData);
      }
   };

   const deleteFile = idImage => {
      const newData = filesUpload
         .filter(item => item.id !== idImage)
         .map((item, index) => {
            return { ...item, id: index + 1 };
         });

      setFilesUpload(newData);
   };

   const handlePlayMedia = id => {
      setCurrentlyPlayingId(prevId => {
         if (prevId && prevId !== id) {
            const prevPlayer = document.getElementById(prevId);
            if (prevPlayer) prevPlayer.pause();
         }
         return id;
      });
   };

   const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
      onDrop: addFile,
      multiple: true,
      noClick: true,
      accept: {
         'image/jpeg': ['.jpeg', '.png', '.jpg'],
         'video/mp4': ['.mp4'],
         'video/webm': ['.webm'],
         'video/quicktime': ['.mov'],
      },
   });

   useEffect(() => {
      const scrollableElement = mainBlockBar.current;

      const handleScroll = event => {
         const scrollElement = event.target;
         const scrollTop = scrollElement.scrollTop;
         const scrollHeight = scrollElement.scrollHeight;
         const clientHeight = scrollElement.clientHeight;
         const remainingScroll = scrollHeight - clientHeight - scrollTop;
         if (remainingScroll > 200) {
            setIsVisibleBtnArrow(true);
         } else {
            setIsVisibleBtnArrow(false);
         }
      };

      if (scrollableElement) {
         scrollableElement.addEventListener('scroll', handleScroll);
      }

      return () => {
         if (scrollableElement) {
            scrollableElement.removeEventListener('scroll', handleScroll);
         }
      };
   }, []);

   // useEffect(() => {
   //    if (!allowScroll || !mainBlockBar.current) return;

   //    const checkStability = () => {
   //       if (!messages.length || isLoadingDialog) return;

   //       const currentScrollHeight = mainBlockBar.current.scrollHeight;

   //       if (currentScrollHeight !== lastScrollHeight.current) {
   //          lastScrollHeight.current = currentScrollHeight;
   //          timerRef.current = setTimeout(checkStability, 500);
   //          return;
   //       }

   // if (firstUnreadRef.current) {
   //    const messageTop = firstUnreadRef.current.offsetTop - 32;
   //    mainBlockBar.current.scrollTop = messageTop;
   // } else {
   //    console.log('fasfasfsa');

   //    mainBlockBar.current.scrollTop = mainBlockBar.current.scrollHeight;
   // }

   //       setAllowScroll(false);
   //    };

   //    checkStability();

   //    return () => {
   //       if (timerRef.current) clearTimeout(timerRef.current);
   //    };
   // }, [allowScroll, messages.length, isLoadingDialog]);

   useEffect(() => {
      if (isLoadingDialog) return;
      if (!allowScroll) return;
      setTimeout(() => {
         setAllowScroll(false);
      }, 500);
   }, [isLoadingDialog, allowScroll]);

   useEffect(() => {
      if (isLoadingDialog) {
         isActiveRef.current = true;
      }
   }, [isLoadingDialog]);

   useEffect(() => {
      if (isLoadingDialog) return;
      if (!messages.length) return;
      if (!mainBlockBar.current) return;

      // Функция для скролла вниз
      const scrollHandler = () => {
         if (isActiveRef.current && mainBlockBar.current) {
            if (firstUnreadRef.current) {
               const messageTop = firstUnreadRef.current.offsetTop - 32;
               mainBlockBar.current.scrollTop = messageTop;
               // console.log('unread');
            } else {
               mainBlockBar.current.scrollTop = mainBlockBar.current.scrollHeight;
               // console.log('read');
            }
         }
      };

      // 1. Настраиваем наблюдатель за изменениями DOM
      observerRef.current = new MutationObserver(scrollHandler);

      observerRef.current.observe(mainBlockBar.current, {
         childList: true, // Отслеживаем новые элементы
         subtree: true, // И во вложенных элементах
         characterData: true, // И изменения текста
      });

      scrollHandler();

      const disableTimer = setTimeout(() => {
         isActiveRef.current = false;
         if (observerRef.current) {
            observerRef.current.disconnect();
         }
      }, 1000);

      return () => {
         clearTimeout(disableTimer);
         if (observerRef.current) {
            observerRef.current.disconnect();
         }
      };
   }, [isLoadingDialog, messages, isActiveRef]);

   return {
      handlePlayAudio,
      handleStopAudio,
      addFile,
      deleteFile,
      filesLimitModal,
      setFilesLimitModal,
      getRootProps,
      getInputProps,
      isDragActive,
      uploadFileOpen: open,
      handlePlayMedia,
      firstUnreadRef,
      allowScroll,
   };
};
