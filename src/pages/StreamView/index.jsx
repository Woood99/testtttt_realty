import React from 'react';
import cn from 'classnames';
import { useParams } from 'react-router-dom';

import MainLayout from '../../layouts/MainLayout';
import { Helmet } from 'react-helmet';
import Header from '../../components/Header';
import Spinner from '../../ui/Spinner';
import { StreamContext } from '../../context';
import StreamPlayer from '../../features/Stream/StreamPlayer';

import styles from '../../features/Stream/Stream.module.scss';
import StreamInfo from '../../features/Stream/StreamInfo';
import { useStream } from '../../features/Stream/useStream';

const StreamView = () => {
   const { streamId } = useParams();
   const options = useStream(streamId);
   const { streamParams } = options;

   return (
      <MainLayout
         helmet={
            <Helmet>
               <title>Стрим</title>
               <meta name="description" content="Добро пожаловать на сайт inrut.ru" />;
               <meta name="description" content="На inrut.ru вы можете решить любой вопрос с недвижимостью" />;
            </Helmet>
         }>
         <Header />
         <StreamContext.Provider value={{ ...options }}>
            <main className="main relative">
               <div className="main-wrapper !bg-[transparent]">
                  {options.isLoading && (
                     <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                        <Spinner style={{ '--size': '65px' }} />
                     </div>
                  )}
                  <section
                     className={cn(
                        'container',
                        options.isLoading && 'absolute opacity-0 pointer-events-none',
                        streamParams.isLoading && 'pointer-events-none opacity-50'
                     )}>
                     <div className={cn(styles.StreamViewContainer)}>
                        <div className={cn(styles.StreamViewLeft)}>
                           <StreamPlayer playerRef={options.videoRef} />
                           <StreamInfo />
                        </div>
                     </div>
                  </section>
               </div>
            </main>
         </StreamContext.Provider>
      </MainLayout>
   );
};

export default StreamView;
