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
import StreamControlsBasic from '../../features/Stream/StreamControlsBasic';
import StreamControls from '../../features/Stream/StreamControls';

const StreamBroadcaster = () => {
   const { streamId } = useParams();
   const options = useStream(streamId);
   const { streamParams } = options;

   const isVisibleControlsBasic = Boolean(!options.isLoading && options.data);
   const isVisibleControls = Boolean(!streamParams.isLoading && streamParams.mediaStream);

   return (
      <MainLayout
         helmet={
            <Helmet>
               <title>Настройка стрима</title>
               <meta name="description" content="Добро пожаловать на сайт inrut.ru" />;
               <meta name="description" content="На inrut.ru вы можете решить любой вопрос с недвижимостью" />;
            </Helmet>
         }>
         <Header />
         <StreamContext.Provider value={{ ...options, isVisibleControlsBasic, isVisibleControls }}>
            <main className="main relative">
               <div className="main-wrapper !bg-[transparent]">
                  {options.isLoading && (
                     <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                        <Spinner style={{ '--size': '65px' }} />
                     </div>
                  )}
                  {isVisibleControlsBasic && (
                     <section className={cn('container', streamParams.isLoading && 'pointer-events-none opacity-50')}>
                        <div className={cn(styles.StreamViewContainer)}>
                           <div className={cn(styles.StreamViewLeft)}>
                              <StreamPlayer playerRef={options.videoRef} muted />
                              <div className="mt-4 flex items-start justify-between gap-3">
                                 <StreamControlsBasic />
                                 <StreamControls />
                              </div>
                              <StreamInfo />
                           </div>
                        </div>

                        {/* <h3>Viewers: {options.connections.length}</h3>
                           <ul>
                              {connections.map((conn, idx) => (
                                 <li key={idx}>{conn}</li>
                              ))}
                           </ul> */}
                     </section>
                  )}
               </div>
            </main>
         </StreamContext.Provider>
      </MainLayout>
   );
};

export default StreamBroadcaster;
