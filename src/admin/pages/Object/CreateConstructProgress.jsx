import React, { useEffect, useState } from 'react';
import Modal from '../../../ui/Modal';
import { useForm } from 'react-hook-form';
import Button from '../../../uiForm/Button';
import { ControllerFieldTextarea } from '../../../uiForm/ControllerFields/ControllerFieldTextarea';
import { ControllerFieldSelect } from '../../../uiForm/ControllerFields/ControllerFieldSelect';
import { DragDropItems } from '../../../components/DragDrop/DragDropItems';
import { FileDropZone } from '../../../components/DragDrop/FileDropZone';
import ModalHeader from '../../../ui/Modal/ModalHeader';
import Tabs from '../../../ui/Tabs';
import getImagesObj from '../../../unifComponents/getImagesObj';
import { sendPostRequest } from '../../../api/requestsApi';
import { nearestYearsOptions, quartersOptions } from '../../../data/selectsField';
import { refactPhotoStageAppend, refactPhotoStageOne, refactPhotoStageTwo } from '../../../helpers/photosRefact';
import VideoCard from '../../../ui/VideoCard';
import ControlsVideoCreate from '../../../components/ControlsVideo/ControlsVideoCreate';
import { getVideos } from '../../../api/other/getVideos';
import ModalWrapper from '../../../ui/Modal/ModalWrapper';
import ControlsVideoEdit from '../../../components/ControlsVideo/ControlsVideoEdit';

const CreateConstructProgress = ({ conditionModal, setModal, options, type = 'create', values = {}, sending = () => {} }) => {
   const [createVideoModal, setCreateVideoModal] = useState(false);
   const [editVideoModal, setEditVideoModal] = useState(false);

   const [currentType, setCurrentType] = useState(type);

   const {
      handleSubmit,
      control,
      formState: { errors },
   } = useForm();

   const defaultValues = {
      id: values.id,
      liter: options.frames.find(item => item.value === values.liter) || null,
      year: nearestYearsOptions.find(item => item.value === values.year) || null,
      quarter: quartersOptions.find(item => item.value === values.quarter) || null,
      description: values.description || '',
   };

   const [images, setImages] = useState([]);
   const [videoUrl, setVideoUrl] = useState(values.ytVideo || '');
   const [videoData, setVideoData] = useState(null);

   useEffect(() => {
      if (videoUrl) {
         getVideos([videoUrl]).then(res => {
            setVideoData(res[0]);
         });
      }
   }, [videoUrl]);

   useEffect(() => {
      if (currentType === 'edit') {
         setImages(
            values?.images?.map((item, index) => {
               return {
                  id: index + 1,
                  image: item,
               };
            }) || []
         );
      }
   }, [currentType]);

   const onSubmitHandler = async (data, additionalData = { video: null, modalCondition: false }) => {
      const resData = {
         year: data.year?.value,
         quarter: data.quarter?.value,
         liter: data.liter?.value,
         photos: images,
         description: data.descr,
         ytVideo: additionalData.video !== undefined ? additionalData.video : videoUrl || '',
         author_id: data.author ? data.author.value : null,
      };

      const formData = new FormData();

      resData.photos = refactPhotoStageOne(resData.photos);
      refactPhotoStageAppend(resData.photos, formData);
      resData.photos = refactPhotoStageTwo(resData.photos);

      formData.append('data', JSON.stringify(resData));

      const urlPost =
         currentType === 'create'
            ? `/admin-api/building/${options.dataObject.id}/history/create`
            : currentType === 'edit'
            ? `/admin-api/building/${options.dataObject.id}/history/${defaultValues.id}/update`
            : '';

      await sendPostRequest(urlPost, formData, { 'Content-Type': 'multipart/form-data' })
         .then(res => {
            sending().then(() => {
               if (!additionalData.modalCondition) {
                  setModal(false);
               }
            });
         })
         .catch(err => {});
      // if (resData.ytVideo) {
      //    options.onUpdate({
      //       videos: [...options.dataObject.videos, resData.ytVideo],
      //    });
      // }
   };

   const addPhoto = files => {
      const newData = getImagesObj([...images, ...files]);
      setImages(newData);
   };

   const deleteItem = (_, idImage) => {
      const newData = images
         .filter(item => item.id !== idImage)
         .map((item, index) => {
            return { ...item, id: index + 1 };
         });

      setImages(newData);
   };

   const dataTabs = [
      {
         name: 'Фото',
         body: (
            <>
               <DragDropItems items={images} deleteItem={deleteItem} />
               <FileDropZone addFiles={files => addPhoto(files)} className={`${images.length > 0 ? 'mt-6' : ''} mb-4`} />
               <ControllerFieldTextarea
                  control={control}
                  maxLength={3000}
                  defaultValue={defaultValues.description}
                  name="descr"
                  placeholder="Описание"
               />
            </>
         ),
      },
      {
         name: 'Видео',
         body: (
            <div>
               {videoUrl && videoData ? (
                  <div className="grid grid-cols-4 gap-4">
                     <VideoCard
                        data={videoData}
                        controlsAdmin
                        deleteCard={data => {
                           sendPostRequest(`/admin-api/building/${options.dataObject.id}/unlink-video/${data.id}`).then(res => {
                              setVideoUrl('');
                              options.onUpdate({
                                 videos: options.dataObject.videos.filter(item => item !== data.url),
                              });
                              handleSubmit(onSubmitHandler)({ video: '', modalCondition: true });
                           });
                        }}
                        edit={data => setEditVideoModal(data)}
                     />
                  </div>
               ) : (
                  <span className="text-primary400">Вы пока не добавили видео</span>
               )}
               {!(videoUrl && videoData) && (
                  <Button
                     type="button"
                     className="w-full mt-8"
                     onClick={() => {
                        setCreateVideoModal(true);
                     }}>
                     Создать Видео
                  </Button>
               )}
               <ControlsVideoCreate
                  conditionModal={createVideoModal}
                  setModal={setCreateVideoModal}
                  options={{
                     onSubmitForm: async data => {
                        if (!data.url) return;
                        setCurrentType('edit');
                        setVideoUrl(data.url);
                        handleSubmit(onSubmitHandler)({ video: data.url, modalCondition: true });
                     },
                     frames: options.frames,
                     tags: options.tags,
                     specialists: options.specialists,
                     building_id: options.dataObject.id,
                     developer: options.dataObject.developer,
                     is_short: false,
                  }}
                  sending={async () => {
                     setCurrentType('edit');
                     handleSubmit(onSubmitHandler)({ modalCondition: true });
                  }}
               />
               <ModalWrapper condition={editVideoModal}>
                  <ControlsVideoEdit
                     conditionModal={Boolean(editVideoModal)}
                     setModal={setEditVideoModal}
                     options={{
                        onSubmitForm: async data => {
                           if (!data.url) return;
                           setCurrentType('edit');
                           setVideoUrl(data.url);
                           handleSubmit(onSubmitHandler)({ video: data.url, modalCondition: true });
                        },
                        frames: options.frames,
                        tags: options.tags,
                        specialists: options.specialists,
                        building_id: options.dataObject.id,
                        developer: options.dataObject.developer,
                        is_short: false,
                        currentVideoData: {
                           url: editVideoModal.video_url,
                        },
                     }}
                     sending={async () => {
                        setCurrentType('edit');
                        await handleSubmit(onSubmitHandler)({ modalCondition: true });
                        await sending();
                        getVideos([videoUrl]).then(res => {
                           setVideoData(res[0]);
                        });
                     }}
                  />
               </ModalWrapper>
            </div>
         ),
      },
   ];

   return (
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
               <h2 className="title-2">{currentType === 'create' ? 'Ход строительства' : 'Редактировать ход строительства'}</h2>
            </ModalHeader>
         )}
         ModalFooter={() => (
            <div className="px-14 py-6">
               <Button onClick={handleSubmit(onSubmitHandler)} className="w-full">
                  Сохранить
               </Button>
            </div>
         )}>
         <form>
            <div className="grid grid-cols-3 gap-2 mb-4">
               <ControllerFieldSelect
                  control={control}
                  nameLabel="Корпус"
                  options={options.frames}
                  name="liter"
                  requiredValue
                  errors={errors}
                  defaultOption
                  defaultValue={defaultValues.liter || options.frames[0]}
               />
               <ControllerFieldSelect
                  control={control}
                  nameLabel="Год"
                  options={nearestYearsOptions}
                  name="year"
                  requiredValue
                  errors={errors}
                  defaultValue={defaultValues.year || nearestYearsOptions[0]}
               />
               <ControllerFieldSelect
                  control={control}
                  nameLabel="Квартал"
                  options={quartersOptions}
                  name="quarter"
                  requiredValue
                  errors={errors}
                  defaultValue={defaultValues.quarter || quartersOptions[0]}
               />
            </div>
            <div className="mb-4">
               <ControllerFieldSelect
                  control={control}
                  nameLabel="Автор"
                  defaultOption
                  placeholderName={
                     options.dataObject.developer ? `${options.dataObject.developer.pos} ${options.dataObject.developer.name}` : 'Не выбрано'
                  }
                  options={options.specialists}
                  name="author"
                  defaultValue={options.specialists.find(item => item.value === defaultValues.author?.id || item.value === options.authorDefault)}
                  disabled={options.authorDefault}
               />
            </div>
            <div>
               <Tabs data={dataTabs} />
            </div>
         </form>
      </Modal>
   );
};

export default CreateConstructProgress;
