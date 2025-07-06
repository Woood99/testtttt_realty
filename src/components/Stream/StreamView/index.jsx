import { useEffect, useState } from 'react';
import cn from 'classnames';

import MainLayout from '../../../layouts/MainLayout';
import { VideoBlock } from '../../../ModalsMain/VideoModal';
import Header from '../../Header';
import { TEST_DATA, TEST_DATA_COMMENTS } from './TEST_DATA';

import styles from './StreamView.module.scss';
import { IconArrow, IconShareArrow } from '../../../ui/Icons';
import Button from '../../../uiForm/Button';
import Tag from '../../../ui/Tag';
import ShareModal from '../../../ModalsMain/ShareModal';
import { RoutesPath } from '../../../constants/RoutesPath';
import Avatar from '../../../ui/Avatar';
import { capitalizeWords } from '../../../helpers/changeString';

const StreamView = () => {
   useEffect(() => {
      document.body.classList.add('overflow-hidden');
   }, []);

   const [data, setData] = useState(TEST_DATA);
   const [comments, setComments] = useState(TEST_DATA_COMMENTS);

   const [isShareModal, setIsShareModal] = useState(false);

   return (
      <MainLayout>
         <Header />
         <main className="main mt-6">
            <section>
               <div className="container">
                  <div className={cn(styles.StreamViewContainer)}>
                     <div className={cn(styles.StreamViewLeft)}>
                        <div className="w-full h-[calc(100vh-350px-16px)]">
                           <VideoBlock data={data} className="w-full h-full rounded-xl overflow-hidden" />
                        </div>
                        <div className="mt-4">
                           <div className="flex justify-between gap-2">
                              <h2 className="title-2">{data.title}</h2>
                              <Button
                                 variant="secondary"
                                 size="32"
                                 className="flex gap-2 items-center text-blue"
                                 onClick={() => setIsShareModal(true)}>
                                 <IconShareArrow className="fill-blue" width={16} height={16} />
                                 Поделиться
                              </Button>
                           </div>
                           {data.tags.length > 0 && (
                              <div className="mt-3 flex gap-2 flex-wrap">
                                 {data.tags.map((item, index) => (
                                    <Tag size="small" color="default" key={index}>
                                       {item}
                                    </Tag>
                                 ))}
                              </div>
                           )}
                           <p className="mt-4 leading-5">{data.description}</p>
                        </div>
                        <div className="mt-8">
                           <h3 className="title-2-5">Автор</h3>
                           <div className="mt-4 flex items-center gap-4 p-6 bg-primary600 rounded-xl relative">
                              <Avatar size={110} src={data.author.image} title={data.author.name} />
                              <div>
                                 <p className="title-2-5">{capitalizeWords(data.author.name, data.author.surname)}</p>
                                 <p className='mt-1 text-primary400 text-small'>Менеджер отдела продаж</p>
                              </div>
                              <Button className="ml-auto relative z-20" size="Small" onClick={() => {}}>
                                 Задать вопрос в чат
                              </Button>
                           </div>
                        </div>
                     </div>
                     <div className={cn(styles.StreamViewRight)}>
                        {comments.map(item => {
                           return <div key={item.id}>{item.text}</div>;
                        })}
                     </div>
                  </div>
               </div>
            </section>
         </main>
         <ShareModal
            condition={isShareModal}
            set={setIsShareModal}
            title="Поделиться"
            url={window.location.origin + `${RoutesPath.stream.view}${data.id}`}
         />
      </MainLayout>
   );
};

export default StreamView;
