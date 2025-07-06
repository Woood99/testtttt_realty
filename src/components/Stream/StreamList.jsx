import { useState } from 'react';
import MainLayout from '../../layouts/MainLayout';
import { ExternalLink } from '../../ui/ExternalLink';
import { Helmet } from 'react-helmet';
import getSrcImage from '../../helpers/getSrcImage';
import { TagsMoreWidthDynamic } from '../../ui/TagsMore';
import Tag from '../../ui/Tag';
import dayjs from 'dayjs';
import { RoutesPath } from '../../constants/RoutesPath';

const StreamList = () => {
   const tags = ['#тег 1', '#тег 2', '#тег 3'];

   const [streams, setStreams] = useState([
      {
         id: 1,
         image: '/uploads/images/PPcPiIwrtjjlK4jBF9DpEY1Wm1WFLzXHENa0Dy7r.jpg',
         title: 'Как безопасно и надолго удалять волосы дома',
         tags: ['#тег 1', '#тег 2'],
         status: 'live',
         statusText: 'В эфире',
         date: '2025-12-12',
      },
      {
         id: 2,
         image: '/uploads/images/8uQO8ogzl9XjUDV6zA5xqRw2plHsZxNfqt77O9Ai.jpg',
         title: 'Работа в мобильном приложении Контур.Логистика',
         status: 'more',
         statusText: 'Через 1 день',
         date: '2025-12-12',
      },
      {
         id: 3,
         image: '/uploads/images/hItQUn8v5fA2F9yTwnuqauML5Bc4isNkY7dOZqWC.jpg',
         title: 'Название',
         tags: ['#тег 1', '#тег 2'],
         status: 'recording',
         statusText: 'Запись',
         date: '2025-12-12',
      },
      {
         id: 4,
         image: '/uploads/images/8L3lIm7NDD9oA1OwOHE9lfEsDMUDGClekWVPo3vM.jpg',
         title: 'Как безопасно и надолго удалять волосы дома',
         tags: ['#тег 1'],
      },
      {
         id: 5,
         image: '/uploads/images/AIuBlh1yKAQk441nsaC7NHwCUamJVwN0p8kmN8XH.jpg',
         title: 'Как безопасно и надолго удалять волосы дома',
         tags: ['#тег 1', '#тег 2'],
      },
      {
         id: 6,
         image: '/uploads/images/8ywZRgKOROrfW1bmBNDJ9ZqpvjX3XcYdi16mqa8m.jpg',
         title: 'Как безопасно и надолго удалять волосы дома',
      },
   ]);

   return (
      <MainLayout
         helmet={
            <Helmet>
               <title>Стримы</title>
               <meta name="description" content="Добро пожаловать на сайт inrut.ru" />;
               <meta name="description" content="На inrut.ru вы можете решить любой вопрос с недвижимостью" />;
            </Helmet>
         }>
         <main className="main">
            <div className="main-wrapper">
               <div className="container">
                  <div className="white-block mb-3">
                     <h2 className="title-2 mb-6">Стримы</h2>
                     <h3 className="title-3 mb-4">Часто ищут</h3>
                     <TagsMoreWidthDynamic
                        className="flex gap-1.5"
                        data={tags.map((item, index) => {
                           return {
                              id: index,
                              value: false,
                              label: item,
                              onClick: value => {},
                           };
                        })}
                     />
                  </div>
                  <div className="white-block mt-3">
                     <div className="grid grid-cols-3 gap-4 md1:grid-cols-2 md3:grid-cols-1">
                        {streams.slice(0, 3).map(item => {
                           return (
                              <div key={item.id} className="rounded-xl relative overflow-hidden bg-[#f5f7fa]">
                                 <ExternalLink to={`${RoutesPath.stream.view}${item.id}`} className="CardLinkElement z-20" />
                                 <div className="pb-[56%] rounded-xl overflow-hidden w-full ibg">
                                    <img src={getSrcImage(item.image)} className="rounded-xl" alt="" />
                                 </div>
                                 <div className="p-6">
                                    <ExternalLink to="" className="font-medium blue-link relative z-10 mb-4">
                                       ЖК Традиции
                                    </ExternalLink>
                                    <h2 className="title-2-5 mb-4 h-14">{item.title}</h2>
                                    <Tag size="small" color={item.status === 'live' ? 'red' : item.status === 'more' ? 'green' : 'blue'} className="">
                                       {item.statusText}
                                    </Tag>
                                    {Boolean(item.date) && <div className="mt-4 text-defaultMax">{dayjs(item.date).format('D MMMM')}</div>}

                                    {item.tags?.length && (
                                       <div className="mt-4 flex flex-wrap gap-3">
                                          {item.tags.map(item => {
                                             return (
                                                <Tag size="small" className="">
                                                   {item}
                                                </Tag>
                                             );
                                          })}
                                       </div>
                                    )}
                                 </div>
                              </div>
                           );
                        })}
                     </div>
                  </div>
               </div>
            </div>
         </main>
      </MainLayout>
   );
};

export default StreamList;
