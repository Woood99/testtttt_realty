
import React, { useEffect, useState } from 'react';
import MainLayout from '../../layouts/MainLayout';
import Header from '../../components/Header';
import { useParams } from 'react-router-dom';
import { getBuilding } from '../../api/getBuilding';
import ObjectVideo from '../../admin/pages/Object/ObjectVideo';
import { useSelector } from 'react-redux';
import ObjectRibbon from '../../admin/pages/Object/ObjectRibbon';
import { getFrames } from '../../api/other/getFrames';
import { getSpecialists } from '../../api/Building/getSpecialists';
import { capitalizeWords } from '../../helpers/changeString';
import ObjectConstructProgress from '../../admin/pages/Object/ObjectConstructProgress';
import { getDataRequest } from '../../api/requestsApi';
import { getUserInfo } from '@/redux';

const ObjectEditUser = () => {
   const params = useParams();

   const [data, setData] = useState({});
   const [frames, setFrames] = useState([]);
   const [specialists, setSpecialists] = useState([]);
   const [constructItems, setConstructItems] = useState([]);
   const [tags, setTags] = useState([]);

   const [initApp, setInitApp] = useState(false);

   const { id: currentUserId } = useSelector(getUserInfo);

   const requestData = async () => {
      await getBuilding(params.id).then(res => {
         setData({
            id: res.id,
            title: res.title,
            stock: res.stock.filter(item => item.author && item.author.id === currentUserId),
            calculations: res.calculations.filter(item => item.author && item.author.id === currentUserId),
            news: res.news.filter(item => item.author && item.author.id === currentUserId),
            videos: res.videos,
            shorts: res.shorts,
         });
         if (!initApp) {
            setInitApp(true);
         }
      });
   };

   const sendingForm = (dataForm, additionalData = {}) => {
      console.log(dataForm);
      console.log(additionalData);
   };

   useEffect(() => {
      if (!currentUserId) return;
      requestData();
      getFrames(params.id).then(res => {
         setFrames(res);
      });
      getSpecialists(params.id).then(res => {
         setSpecialists(
            res.map(item => {
               return {
                  value: item.id,
                  label: capitalizeWords(item.name, item.surname),
                  avatar: item.avatar,
               };
            })
         );
      });
      getDataRequest(`/api/building/${params.id}/history`).then(res => {
         setConstructItems(res.data.filter(item => item.author && item.author.id === currentUserId));
      });
      getDataRequest('/api/tags?type=tags').then(res => {
         setTags(res.data);
      });
   }, [currentUserId]);

   return (
      <MainLayout>
         <Header />
         <main className="main">
            <div className="main-wrapper--title">
               {initApp && (
                  <>
                     <div className="container">
                        <h2 className="title-2">Редактирование комплекса {data.title}</h2>
                        <div className="mt-8">
                           <ObjectRibbon
                              dataObject={data}
                              fetchData={requestData}
                              frames={frames}
                              specialists={specialists}
                              authorDefault={currentUserId}
                           />
                           <ObjectVideo
                              dataObject={data}
                              setData={setData}
                              sendingForm={sendingForm}
                              frames={frames}
                              specialists={specialists}
                              tags={tags}
                              authorDefault={currentUserId}
                           />
                           <ObjectConstructProgress
                              data={constructItems}
                              id={params.id}
                              frames={frames}
                              dataObject={data}
                              specialists={specialists}
                              authorDefault={currentUserId}
                           />
                        </div>
                     </div>
                  </>
               )}
            </div>
         </main>
      </MainLayout>
   );
};

export default ObjectEditUser;
