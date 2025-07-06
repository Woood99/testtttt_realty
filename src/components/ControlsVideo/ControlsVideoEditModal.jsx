import { useEffect, useState } from 'react';
import { getCardBuildingsById } from '../../api/getCardsBuildings';
import { getFrames } from '../../api/other/getFrames';
import { getSpecialists } from '../../api/Building/getSpecialists';
import ControlsVideoEdit from './ControlsVideoEdit';

const ControlsVideoEditModal = ({ data, set, is_short = false, refetchData }) => {
   const [videoData, setVideoData] = useState({});

   useEffect(() => {
      if (!data) return;

      const fetchData = async () => {
         const building = await getCardBuildingsById(data.building_id);
         const frames = await getFrames(data.building_id);
         const specialists = await getSpecialists(data.building_id);

         const resData = {
            frames,
            tags: building.tags.map(item => ({
               value: item.id,
               label: item.name,
            })),
            specialists: specialists.map(item => ({
               avatar: item.avatar,
               label: item.name,
               value: item.id,
            })),
            building_id: data.building_id,
            developer: building.user,
            is_short,
            video_url: data.video_url,
         };

         setVideoData(resData);
      };

      fetchData();
   }, [data]);

   return (
      <ControlsVideoEdit
         conditionModal={Boolean(data)}
         setModal={set}
         options={{
            frames: videoData.frames,
            tags: videoData.tags,
            is_short,
            specialists: videoData.specialists,
            building_id: videoData.building_id,
            developer: videoData.developer,
            currentVideoData: {
               url: videoData.video_url,
            },
         }}
         sending={() => {
            if (refetchData) {
               refetchData();
            }
         }}
      />
   );
};

export default ControlsVideoEditModal;
