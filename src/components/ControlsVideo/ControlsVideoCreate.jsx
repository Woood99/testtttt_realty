import React, { useState } from 'react';
import { createPortal } from 'react-dom';

import Modal from '../../ui/Modal';
import { SpinnerOverlay } from '../../ui/Spinner';
import ModalHeader from '../../ui/Modal/ModalHeader';
import { VideoDropZone } from '../DragDrop/VideoDropZone';
import { getVideoObj } from '../../unifComponents/getImagesObj';
import { refactPhotoStageAppend, refactPhotoStageOne, refactPhotoStageTwo } from '../../helpers/photosRefact';
import { sendPostRequest } from '../../api/requestsApi';
import ModalWrapper from '../../ui/Modal/ModalWrapper';
import ControlsVideoEdit from './ControlsVideoEdit';
import { NotificationTimer } from '../../ui/Tooltip';

const ControlsVideoCreate = ({ conditionModal, setModal, options, sending = () => {}, sendingError = () => {} }) => {
   const [videoIsLoading, setVideoIsLoading] = useState(false);

   const [modalEditData, setModalEditData] = useState(false);
   const [showNotificationError, setShowNotificationError] = useState(false);

   const onSubmitHandler = data => {
      const resData = {
         name: data[0].file.name.replace(/\.[^/.]+$/, ''),
         video: data,
         building_id: options.building_id,
         is_short: options.is_short,

         timeCodes: [],
         cards: [],
         interactiveEl: {},
         tags: [],
         show_on_homepage: false,
         author: '',
         image: null,
      };

      const formData = new FormData();

      resData.video = refactPhotoStageOne(resData.video, 'video', 'video');
      refactPhotoStageAppend(resData.video, formData, 'video', 'video');
      resData.video = refactPhotoStageTwo(resData.video, 'video', 'video');
      resData.video = resData.video[0];

      formData.append('data', JSON.stringify(resData));

      sendPostRequest('/api/upload/video', formData, { 'Content-Type': 'multipart/form-data' })
         .then(resVideo => {
            options.onSubmitForm({ ...resVideo.data, is_short: options.is_short }).then(async () => {
               await new Promise(resolve => setTimeout(resolve, 750));
               setVideoIsLoading(false);
               setModal(false);
               setModalEditData(resVideo.data);
            });
         })
         .catch(err => {
            setShowNotificationError(true);
            setVideoIsLoading(false);
            setModal(false);
         });
   };

   return (
      <>
         <ModalWrapper condition={conditionModal}>
            <Modal
               set={setModal}
               options={{ modalClassNames: 'HeaderSticky', modalContentClassNames: 'flex flex-col !py-0 !px-10 md1:!px-4' }}
               condition={conditionModal}
               style={{
                  '--modal-space': '40px',
                  '--modal-height': 'calc(var(--vh) - 80px)',
                  '--modal-width': '1070px',
               }}
               closeBtn={false}
               ModalHeader={() => (
                  <ModalHeader set={setModal} className="px-10 py-6 mb-8">
                     <h2 className="title-2">{options.is_short ? 'Создать Клип' : 'Создать видео'}</h2>
                  </ModalHeader>
               )}
               ModalChildren={
                  videoIsLoading
                     ? () => (
                          <SpinnerOverlay
                             className="absolute inset-0 z-[100] flex flex-col items-center justify-center"
                             classNameSpinner="!w-[60px] !h-[60px]">
                             <span className="mt-8 text-bigSmall">Видео загружается...</span>
                          </SpinnerOverlay>
                       )
                     : null
               }>
               <VideoDropZone
                  multiple={false}
                  addFiles={files => {
                     setVideoIsLoading(true);
                     onSubmitHandler(getVideoObj([...files]));
                  }}
               />
            </Modal>
         </ModalWrapper>
         <ModalWrapper condition={modalEditData}>
            <ControlsVideoEdit
               conditionModal={Boolean(modalEditData)}
               setModal={setModalEditData}
               options={{ ...options, currentVideoData: modalEditData }}
               sending={sending}
               sendingError={sendingError}
            />
         </ModalWrapper>

         {showNotificationError &&
            createPortal(
               <NotificationTimer
                  show={showNotificationError}
                  set={setShowNotificationError}
                  onClose={() => setShowNotificationError(false)}
                  classListRoot="min-w-[300px] !pt-6">
                  <p className="font-medium text-defaultMax">Произошла ошибка.</p>
                  <p className="mt-0.5">Повторите попытку позже или напишите нам</p>
               </NotificationTimer>,
               document.getElementById('overlay-wrapper')
            )}
      </>
   );
};

export default ControlsVideoCreate;
