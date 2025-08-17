import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useParams } from 'react-router-dom';

import Tabs from '../../../ui/Tabs';
import Button from '../../../uiForm/Button';
import { getDataRequest, sendPostRequest } from '../../../api/requestsApi';
import VideoCard from '../../../ui/VideoCard';
import ModalWrapper from '../../../ui/Modal/ModalWrapper';
import { DragDropElements } from '../../../components/DragDrop/DragDropItems';
import ControlsVideoCreate from '../../../components/ControlsVideo/ControlsVideoCreate';
import ControlsVideoEdit from '../../../components/ControlsVideo/ControlsVideoEdit';
import { NotificationTimer } from '../../../ui/Tooltip';

const ObjectVideo = ({ dataObject, sendingForm, frames = [], specialists = [], tags = [], setData, authorDefault }) => {
   const params = useParams();

   const [modalVideo, setModalVideo] = useState(false);
   const [modalVideoEdit, setModalVideoEdit] = useState(false);

   const [modalShort, setModalShort] = useState(false);
   const [modalShortEdit, setModalShortEdit] = useState(false);

   const [showNotificationError, setShowNotificationError] = useState(false);

   const [dataCards, setDataCards] = useState({
      videos: [],
      shorts: [],
   });

   useEffect(() => {
      const fetch = async () => {
         const videos = dataObject.videos.length ? await getDataRequest(`/api/video-url`, { url: dataObject.videos }).then(res => res.data) : [];
         const shorts = dataObject.shorts.length ? await getDataRequest(`/api/video-url`, { url: dataObject.shorts }).then(res => res.data) : [];
         if (authorDefault) {
            setDataCards({
               videos: videos.filter(item => item.author && item.author.id === authorDefault),
               shorts: shorts.filter(item => item.author && item.author.id === authorDefault),
            });
         } else {
            setDataCards({
               videos,
               shorts,
            });
         }
      };
      fetch();
   }, [dataObject.videos, dataObject.shorts]);

   const onSubmitVideo = async data => {
      if (!data.url) return;
      if (data.is_short) {
         await sendingForm({ shorts: [data.url, ...(dataObject.shorts || [])] });
      } else {
         await sendingForm({ videos: [data.url, ...(dataObject.videos || [])] });
      }
   };

   const updateItems = (data, items, type) => {
      const newItems = [...items].map(item => {
         return data.find(dataItem => dataItem.id === item.id);
      });

      const map = {};
      newItems.forEach((obj, index) => {
         map[obj.item] = index;
      });

      setDataCards(prev => ({
         ...prev,
         [type]: [...dataCards[type]].sort((a, b) => map[a.video_url] - map[b.video_url]),
      }));

      setData(prev => ({
         ...prev,
         [type]: newItems.map(item => item.item),
      }));
   };

   const deleteCard = data => {
      sendPostRequest(`/admin-api/building/${dataObject.id}/unlink-video/${data.id}`).then(res => {
         sendingForm({
            videos: dataObject.videos.filter(item => item !== data.url),
            shorts: dataObject.shorts.filter(item => item !== data.url),
            videos_apartRenov: dataObject.videos_apartRenov.filter(item => item !== data.url),
            videos_ecologyParks: dataObject.videos_ecologyParks.filter(item => item !== data.url),
            videos_gallery: dataObject.videos_gallery.filter(item => item !== data.url),
         });
      });
   };

   return (
      <div className="white-block mt-4">
         <h2 className="title-2 mb-6">Видео</h2>
         <Tabs
            data={[
               {
                  name: 'Видео',
                  body: (
                     <div>
                        {Boolean(dataCards.videos.length) ? (
                           <DragDropElements
                              items={dataCards.videos.map((item, index) => (
                                 <VideoCard
                                    key={index + 1}
                                    data={item}
                                    developer={dataObject.developer}
                                    controlsAdmin
                                    deleteCard={data => deleteCard(data)}
                                    edit={data => setModalVideoEdit(data)}
                                 />
                              ))}
                              className="grid grid-cols-4 gap-4"
                              onChange={value =>
                                 updateItems(
                                    dataObject.videos.map((item, index) => ({
                                       id: index + 1,
                                       item,
                                    })),
                                    value,
                                    'videos'
                                 )
                              }
                           />
                        ) : (
                           <span className="text-primary400">Вы пока не добавили ни одного видео</span>
                        )}
                        <Button type="button" className="w-full mt-8" onClick={() => setModalVideo(true)}>
                           Создать Видео
                        </Button>
                     </div>
                  ),
                  count: dataCards.videos.length,
               },
               {
                  name: 'Клипы',
                  body: (
                     <div>
                        {Boolean(dataCards.shorts.length) ? (
                           <DragDropElements
                              items={dataCards.shorts.map((item, index) => (
                                 <VideoCard
                                    key={index + 1}
                                    data={item}
                                    developer={dataObject.developer}
                                    controlsAdmin
                                    deleteCard={id => deleteCard(id)}
                                    edit={data => setModalShortEdit(data)}
                                 />
                              ))}
                              className="grid grid-cols-4 gap-4"
                              onChange={value =>
                                 updateItems(
                                    dataObject.shorts.map((item, index) => ({
                                       id: index + 1,
                                       item,
                                    })),
                                    value,
                                    'shorts'
                                 )
                              }
                           />
                        ) : (
                           <span className="text-primary400">Вы пока не добавили ни одного Клипа</span>
                        )}
                        <Button type="button" className="w-full mt-8" onClick={() => setModalShort(true)}>
                           Создать Клип
                        </Button>
                     </div>
                  ),
                  count: dataCards.shorts.length,
               },
            ]}
         />
         <ControlsVideoCreate
            conditionModal={modalVideo}
            setModal={setModalVideo}
            options={{
               onSubmitForm: onSubmitVideo,
               frames: frames,
               tags,
               authorDefault,
               is_short: false,
               specialists,
               building_id: params.id,
               developer: dataObject.developer,
            }}
            sending={sendingForm}
            sendingError={() => {
               setShowNotificationError(true);
            }}
         />
         <ControlsVideoCreate
            conditionModal={modalShort}
            setModal={setModalShort}
            options={{
               onSubmitForm: onSubmitVideo,
               frames: frames,
               tags,
               authorDefault,
               is_short: true,
               specialists,
               building_id: params.id,
               developer: dataObject.developer,
            }}
            sending={sendingForm}
            sendingError={() => {
               setShowNotificationError(true);
            }}
         />
         <ModalWrapper condition={modalVideoEdit}>
            <ControlsVideoEdit
               conditionModal={Boolean(modalVideoEdit)}
               setModal={setModalVideoEdit}
               options={{
                  onSubmitForm: onSubmitVideo,
                  frames: frames,
                  tags,
                  authorDefault,
                  is_short: false,
                  specialists,
                  building_id: params.id,
                  developer: dataObject.developer,
                  currentVideoData: {
                     url: modalVideoEdit.video_url,
                  },
               }}
               sending={sendingForm}
               sendingError={() => {
                  setShowNotificationError(true);
               }}
            />
         </ModalWrapper>
         <ModalWrapper condition={modalShortEdit}>
            <ControlsVideoEdit
               conditionModal={Boolean(modalShortEdit)}
               setModal={setModalShortEdit}
               options={{
                  onSubmitForm: onSubmitVideo,
                  frames: frames,
                  tags,
                  authorDefault,
                  is_short: true,
                  specialists,
                  building_id: params.id,
                  developer: dataObject.developer,
                  currentVideoData: {
                     url: modalShortEdit.video_url,
                  },
               }}
               sending={sendingForm}
               sendingError={() => {
                  setShowNotificationError(true);
               }}
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
      </div>
   );
};

export default ObjectVideo;
