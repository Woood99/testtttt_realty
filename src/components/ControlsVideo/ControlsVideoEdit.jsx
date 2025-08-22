import React, { useEffect, useState } from 'react';
import Modal from '../../ui/Modal';
import { v4 as uuidv4 } from 'uuid';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import Button from '../../uiForm/Button';
import { SpinnerOverlay } from '../../ui/Spinner';
import ModalHeader from '../../ui/Modal/ModalHeader';
import getImagesObj from '../../unifComponents/getImagesObj';
import { refactPhotoStageAppend, refactPhotoStageOne, refactPhotoStageTwo } from '../../helpers/photosRefact';
import { getDataRequest, sendPostRequest } from '../../api/requestsApi';
import { ControllerFieldInput } from '../../uiForm/ControllerFields/ControllerFieldInput';
import { ControllerFieldSelect } from '../../uiForm/ControllerFields/ControllerFieldSelect';
import { useForm } from 'react-hook-form';
import Select from '../../uiForm/Select';
import isEmptyArrObj from '../../helpers/isEmptyArrObj';
import Input from '../../uiForm/Input';
import ChoiceApartmentsFilter from '../ChoiceApartmentsFilter';
import { BtnActionDelete } from '../../ui/ActionBtns';
import ControllerFieldTags from '../../uiForm/ControllerFields/ControllerFieldTags';
import { ControllerFieldCheckbox } from '../../uiForm/ControllerFields/ControllerFieldCheckbox';

import DragDropImageSolo from '../DragDrop/DragDropImageSolo';
import { IconImage } from '../../ui/Icons';
import Sidebar from '../Sidebar';
import BodyAndSidebar from '../BodyAndSidebar';
import { BASE_URL } from '../../constants/api';
import downloadImage from '../../helpers/downloadImage';
import Checkbox from '../../uiForm/Checkbox';
import { NavBtnNext, NavBtnPrev } from '../../ui/NavBtns';
import { VideoPlayer } from '../../ModalsMain/VideoModal';
import getSrcImage from '../../helpers/getSrcImage';
import { choiceApartmentsFilterOptions } from '../../data/selectsField';
import { ControllerFieldTextarea } from '../../uiForm/ControllerFields/ControllerFieldTextarea';

function formatTime(time) {
   let parts = time.split(':');

   for (let i = 0; i < parts.length; i++) {
      if (parts[i].length < 2) {
         parts[i] = parts[i].padStart(2, '0');
      }
   }

   return parts.join(':');
}

const ControlsVideoEdit = ({ conditionModal, setModal, options, sending = () => {}, sendingError = () => {} }) => {
   const {
      handleSubmit,
      control,
      formState: { errors },
   } = useForm();
   const [videoIsLoading, setVideoIsLoading] = useState(false);

   const [currentData, setCurrentData] = useState({});
   const [interactiveEl, setInteractiveEl] = useState({});
   const [selectedApartments, setSelectedApartments] = useState([]);
   const [defaultApartmentsIds, setDefaultApartmentsIds] = useState([]);
   const [timeCodes, setTimeCodes] = useState([]);

   const [image, setImage] = useState(null);

   const [cover, setCover] = useState(null);

   const [filterFields, setFilterFields] = useState(choiceApartmentsFilterOptions);

   useEffect(() => {
      if (!options.currentVideoData?.url) return;

      getDataRequest(`/api/video-url`, { url: [options.currentVideoData.url] }).then(res => {
         const data = res.data[0];
         setCurrentData(data);
         if (!isEmptyArrObj(data.interactiveEl)) {
            setInteractiveEl(data.interactiveEl);
         }
         if (!isEmptyArrObj(data.timeCodes)) {
            setTimeCodes(data.timeCodes);
         }
         if (data.image_url) {
            setTimeout(() => {
               setImage({ id: 1, image: getSrcImage(data.image_url) });
            }, 100);
         }
         if (data.filters_info) {
            setFilterFields(JSON.parse(data.filters_info));
         }
         getDataRequest(`/api/video/${data.id}/apartments`).then(res => {
            setDefaultApartmentsIds(res.data);
         });
      });
   }, [options.currentVideoData?.url]);

   const addedTimeCode = () => {
      setTimeCodes(prev => [
         ...prev,
         {
            id: uuidv4(),
            time: '',
            title: '',
         },
      ]);
   };

   const onSubmitHandler = async data => {
      setVideoIsLoading(true);
      const resData = {
         ...data,
         building_id: options.building_id,
         timeCodes,
         interactiveEl: interactiveEl,
         is_short: options.is_short,
         cards: selectedApartments.map(item => item.value),
         author: data.author && !isEmptyArrObj(data.author) ? data.author.value : '',
         video: [
            {
               new_video: false,
               video: currentData.video_url,
               id: 1,
            },
         ],
         image: image ? [image] : null,
         tags: data.tags || [],
         filtersInfo: JSON.stringify(filterFields),
      };

      if (cover) {
         await downloadImage(cover).then(res => {
            resData.image = [getImagesObj([res])[0]];
         });
      }

      const formData = new FormData();

      resData.video = refactPhotoStageOne(resData.video, 'video', 'video');
      refactPhotoStageAppend(resData.video, formData, 'video', 'video');
      resData.video = refactPhotoStageTwo(resData.video, 'video', 'video');
      resData.video = resData.video[0];
      if (!resData.interactiveEl?.type?.value) {
         resData.interactiveEl = {};
      }
      if (resData.interactiveEl?.time) {
         resData.interactiveEl.time = formatTime(resData.interactiveEl.time);
      }
      if (resData.image) {
         resData.image = refactPhotoStageOne(resData.image);
         refactPhotoStageAppend(resData.image, formData);
         resData.image = refactPhotoStageTwo(resData.image);
         resData.image = {
            ...resData.image[0],
            image: resData.image[0].image.replace(BASE_URL, ''),
         };
      }

      formData.append('data', JSON.stringify(resData));

      sendPostRequest(`/admin-api/edit/video/${currentData.id}`, formData, { 'Content-Type': 'multipart/form-data' })
         .then(() => {
            sendPostRequest(`/admin-api/assign/video/${currentData.id}/apartments`, { apartments_ids: resData.cards }).then(() => {
               setModal(false);
               sending();
            });
         })
         .catch(err => {
            setModal(false);
            sendingError();
         });
   };

   return (
      <Modal
         set={setModal}
         options={{ modalClassNames: 'HeaderSticky', modalContentClassNames: 'flex flex-col !py-0 !px-10 md1:!px-4' }}
         condition={conditionModal}
         style={{
            '--modal-space': '40px',
            '--modal-height': 'calc(var(--vh) - 80px)',
            '--modal-width': '1250px',
         }}
         closeBtn={false}
         ModalHeader={() => (
            <ModalHeader set={setModal} className="px-10 py-6 mb-8">
               <h2 className="title-2">{options.is_short ? 'Редактировать Клип' : 'Редактировать видео'}</h2>
            </ModalHeader>
         )}
         ModalFooter={() => (
            <div className="px-14 py-6">
               <Button onClick={handleSubmit(onSubmitHandler)} className="w-full">
                  Сохранить
               </Button>
            </div>
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
         {!isEmptyArrObj(currentData) && (
            <BodyAndSidebar className="grid-cols-[70%_1fr] !gap-6">
               <div className="min-w-0">
                  <div className="grid grid-cols-2 gap-2"></div>
                  <div>
                     <h3 className="title-3 mb-4">Обложка</h3>
                     <Swiper
                        modules={[Navigation]}
                        slidesPerView={6.5}
                        navigation={{
                           prevEl: '.slider-btn-prev',
                           nextEl: '.slider-btn-next',
                        }}
                        spaceBetween={12}
                        className="md1:px-4 md1:-mx-4">
                        <SwiperSlide>
                           <DragDropImageSolo
                              className={`!w-full !h-[200px] block-hover-overlay ${
                                 Boolean(image?.image) && cover === null ? 'block-hover-overlay-active' : ''
                              }`}
                              effect={false}
                              defaultLayout={() => (
                                 <div className="bg-dark w-full h-full flex items-center justify-center">
                                    <IconImage width={32} height={32} className="stroke-blue" />
                                 </div>
                              )}
                              image={image?.image}
                              onChange={file => {
                                 setImage(file ? getImagesObj(file)[0] : null);
                                 setCover(null);
                              }}>
                              <Checkbox
                                 readOnly
                                 className={`!absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 group-hover:opacity-100 transition-all ${
                                    !(image && image?.image) ? 'opacity-0' : ''
                                 } ${cover !== null ? 'opacity-0' : ''}`}
                                 checked={cover === null}
                              />
                           </DragDropImageSolo>
                        </SwiperSlide>
                        {Array.from({ length: 10 }, (_, index) =>
                           ((index * (currentData.video_duration ? currentData.video_duration - 0.5 : 10)) / (10 - 1)).toFixed(1)
                        ).map((item, index) => {
                           const imageUrl = `${BASE_URL}/api/video/${currentData.id}/preview/${item}`;
                           return (
                              <SwiperSlide
                                 key={index}
                                 onClick={() => {
                                    setCover(imageUrl);
                                 }}
                                 className={`block-hover-overlay rounded-xl group ${cover === imageUrl ? 'block-hover-overlay-active' : ''}`}>
                                 <Checkbox
                                    readOnly
                                    className={`!absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 group-hover:opacity-100 transition-all ${
                                       cover !== imageUrl ? 'opacity-0' : ''
                                    }`}
                                    checked={cover === imageUrl}
                                 />
                                 <img src={imageUrl} className="!h-[200px]" />
                              </SwiperSlide>
                           );
                        })}
                        <NavBtnPrev centery="true" disabled className="slider-btn-prev !left-1.5 !w-8 !h-8" />
                        <NavBtnNext centery="true" className="slider-btn-next !right-1.5 !w-8 !h-8" />
                     </Swiper>
                  </div>

                  <div className="mt-8">
                     <h3 className="title-3 mb-4">Введите название или описание</h3>
                     <ControllerFieldTextarea
                        control={control}
                        maxLength={3000}
                        name="name"
                        placeholder="Напишите что-нибудь..."
                        defaultValue={currentData.name}
                        requiredValue
                        errors={errors}
                     />
                  </div>
                  <div className="mt-3 w-1/2">
                     <ControllerFieldSelect
                        control={control}
                        nameLabel="Автор"
                        defaultOption
                        placeholderName={options.developer ? `${options.developer.pos} ${options.developer.name}` : 'Не выбрано'}
                        options={options.specialists}
                        name="author"
                        defaultValue={options.specialists?.find(item => item.value === currentData.author?.id || item.value === options.authorDefault)}
                        disabled={options.authorDefault}
                     />
                  </div>
                  <div className="mt-8">
                     <ControllerFieldCheckbox
                        variant="toggle"
                        control={control}
                        option={{ value: 'show_on_homepage', label: 'Показать на главной' }}
                        name="show_on_homepage"
                        defaultValue={currentData.show_on_homepage}
                     />
                  </div>
                  <div className="mt-8">
                     <h3 className="title-3 mb-4">Интерактивный элемент</h3>
                     <div className="grid grid-cols-[400px_320px] gap-4">
                        <div className="flex items-center gap-2">
                           <Select
                              className="flex-grow"
                              nameLabel="Тип"
                              options={[
                                 {
                                    label: 'Записаться на просмотр',
                                    value: 'record-viewing',
                                 },
                                 // {
                                 //    label: 'Заказ звонка',
                                 //    value: 'consultation',
                                 // },
                              ]}
                              onChange={option =>
                                 setInteractiveEl(prev => {
                                    return {
                                       ...prev,
                                       type: option,
                                    };
                                 })
                              }
                              value={interactiveEl.type}
                              defaultOption
                           />
                        </div>
                        {interactiveEl.type?.value && (
                           <Input
                              before="Появляется на"
                              after="(чч.мм.сс)"
                              mask="hhmmssMask"
                              value={interactiveEl.time || '00:00:00'}
                              onChange={value =>
                                 setInteractiveEl(prev => {
                                    return {
                                       ...prev,
                                       time: value,
                                    };
                                 })
                              }
                           />
                        )}
                     </div>
                  </div>
                  <div className="mt-8">
                     <ChoiceApartmentsFilter
                        className="!flex !flex-col"
                        building_id={options.building_id}
                        frames={options.frames}
                        setData={setSelectedApartments}
                        defaultValue={defaultApartmentsIds}
                        filterFields={filterFields}
                        setFilterFields={setFilterFields}
                     />
                  </div>
                  <div className="mt-8">
                     <h3 className="title-3 mb-4">Таймкоды</h3>
                     {timeCodes.length > 0 && (
                        <div className="flex flex-col gap-4 mb-4">
                           {timeCodes.map(item => {
                              return (
                                 <div key={item.id} className="grid grid-cols-[250px_300px_max-content] gap-2">
                                    <Input
                                       before="Время"
                                       after="(чч.мм.сс)"
                                       mask="hhmmssMask"
                                       value={timeCodes.find(timeCode => timeCode.id === item.id).time || '00:00:00'}
                                       onChange={value => {
                                          setTimeCodes(prev =>
                                             prev.map(timeCode => {
                                                if (timeCode.id === item.id) {
                                                   return {
                                                      ...timeCode,
                                                      time: value,
                                                   };
                                                } else {
                                                   return timeCode;
                                                }
                                             })
                                          );
                                       }}
                                    />
                                    <Input
                                       before="Название"
                                       value={timeCodes.find(timeCode => timeCode.id === item.id).title}
                                       onChange={value => {
                                          setTimeCodes(prev =>
                                             prev.map(timeCode => {
                                                if (timeCode.id === item.id) {
                                                   return {
                                                      ...timeCode,
                                                      title: value,
                                                   };
                                                } else {
                                                   return timeCode;
                                                }
                                             })
                                          );
                                       }}
                                    />
                                    <BtnActionDelete
                                       className="ml-2"
                                       onClick={() => {
                                          setTimeCodes(prev => prev.filter(currentItem => currentItem.id !== item.id));
                                       }}
                                    />
                                 </div>
                              );
                           })}
                        </div>
                     )}
                     <Button type="button" size="Small" onClick={addedTimeCode}>
                        Добавить
                     </Button>
                  </div>
                  {Boolean(options.tags?.length) && (
                     <div className="mt-8">
                        <h3 className="title-3 mb-4">Теги</h3>
                        <ControllerFieldTags
                           className="w-full"
                           control={control}
                           options={options.tags}
                           name="tags"
                           type="multiple"
                           defaultValue={currentData.tags.map(item => item.id)}
                        />
                     </div>
                  )}
               </div>
               <Sidebar className="!top-0">
                  <div className="h-[415px]">
                     <VideoPlayer
                        data={currentData}
                        variant="default"
                        className="h-full"
                        autoplay={false}
                        poster={cover || (image?.image ? image.image : `${BASE_URL}/api/video/${currentData.id}/preview/0`)}
                     />
                  </div>
               </Sidebar>
            </BodyAndSidebar>
         )}
      </Modal>
   );
};

export default ControlsVideoEdit;
