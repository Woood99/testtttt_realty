import { useEffect, useState } from 'react';
import ControlsVideoCreate from '../../../components/ControlsVideo/ControlsVideoCreate';
import { DragDropElements } from '../../../components/DragDrop/DragDropItems';
import Button from '../../../uiForm/Button';
import { getVideos } from '../../../api/other/getVideos';
import VideoCard from '../../../ui/VideoCard';
import { sendPostRequest } from '../../../api/requestsApi';
import ControlsVideoEdit from '../../../components/ControlsVideo/ControlsVideoEdit';
import ModalWrapper from '../../../ui/Modal/ModalWrapper';

const StructureTabVideo = ({ options = {}, onSubmitVideo = () => {}, onUpdate = () => {}, id }) => {
   const [videosData, setVideosData] = useState([]);
   const [modalVideoEdit, setModalVideoEdit] = useState(false);

   useEffect(() => {
      getVideos(options.data || []).then(res => {
         setVideosData(res);
      });
   }, [options.data]);

   const deleteCard = data => {
      sendPostRequest(`/admin-api/building/${options.dataObject.id}/unlink-video/${data.id}`).then(res => {
         onUpdate({
            videos: options.dataObject.videos.filter(item => item !== data.url),
            shorts: options.dataObject.shorts.filter(item => item !== data.url),
            videos_apartRenov: options.dataObject.videos_apartRenov.filter(item => item !== data.url),
            videos_ecologyParks: options.dataObject.videos_ecologyParks.filter(item => item !== data.url),
            videos_gallery: options.dataObject.videos_gallery.filter(item => item !== data.url),
         });
      });
   };

   return {
      required: true,
      structureTab: {
         id,
         name: 'Видео',
         body: (
            <div>
               {Boolean(videosData.length) ? (
                  <div className="grid grid-cols-4 gap-4">
                     {videosData.map((item, index) => (
                        <VideoCard
                           key={index + 1}
                           data={item}
                           developer={options.dataObject.developer}
                           controlsAdmin
                           deleteCard={data => deleteCard(data)}
                           edit={data => setModalVideoEdit(data)}
                        />
                     ))}
                  </div>
               ) : (
                  <span className="text-primary400">Вы пока не добавили ни одного видео</span>
               )}

               <Button
                  type="button"
                  className="w-full mt-8"
                  onClick={() => {
                     options.setModal(true);
                  }}>
                  Создать Видео
               </Button>
               <ControlsVideoCreate
                  conditionModal={options.conditionModal}
                  setModal={options.setModal}
                  options={{
                     onSubmitForm: async data => {
                        if (!data.url) return;
                        onSubmitVideo(data);
                     },
                     frames: options.frames,
                     tags: options.tags,
                     specialists: options.specialists,
                     building_id: options.dataObject?.id,
                     developer: options.dataObject?.developer,
                     is_short: false,
                  }}
                  sending={onUpdate}
               />
               <ModalWrapper condition={modalVideoEdit}>
                  <ControlsVideoEdit
                     conditionModal={Boolean(modalVideoEdit)}
                     setModal={setModalVideoEdit}
                     options={{
                        onSubmitForm: onSubmitVideo,
                        frames: options.frames,
                        tags: options.tags,
                        is_short: false,
                        specialists: options.specialists,
                        building_id: options.dataObject?.id,
                        developer: options.dataObject?.developer,
                        currentVideoData: {
                           url: modalVideoEdit.video_url,
                        },
                     }}
                     sending={onUpdate}
                  />
               </ModalWrapper>
            </div>
         ),
      },
   };
};

export default StructureTabVideo;
