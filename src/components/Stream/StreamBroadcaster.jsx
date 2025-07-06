import React, { useState } from 'react';
import { sendPostRequest } from '../../api/requestsApi';
import { BASE_URL } from '../../constants/api';
import MainLayout from '../../layouts/MainLayout';
import Button from '../../uiForm/Button';

const StreamBroadcaster = () => {
   const [streamKey, setStreamKey] = useState('');
   const [streamInfo, setStreamInfo] = useState(null);
   const [isStreaming, setIsStreaming] = useState(false);
   const [device, setDevice] = useState('/dev/video0');
   const [resolution, setResolution] = useState('720p');
   const [error, setError] = useState(null);

   const startStream = async () => {
      try {
         setError(null);
         const response = await sendPostRequest('/api/start', {
            device,
            resolution,
         });

         setStreamKey(response.data.stream_key);
         setStreamInfo(response.data);
         setIsStreaming(true);
      } catch (err) {
         setError(err.response?.data?.error || 'Failed to start stream');
      }
   };

   const stopStream = async () => {
      try {
         await sendPostRequest('/api/stop');
         setIsStreaming(false);
         setStreamInfo(null);
      } catch (err) {
         setError(err.response?.data?.error || 'Failed to stop stream');
      }
   };

   return (
      <MainLayout>
         <main className="main mt-8">
            <div className="container">
               <div className="stream-broadcaster">
                  <h2 className='title-2-5 mb-8'>Stream Broadcaster</h2>

                  {error && <div className="error text-red">{error}</div>}

                  {!isStreaming ? (
                     <div className="stream-config mt-6">
                        <div>
                           <label>Video Device:</label>
                           <input type="text" value={device} onChange={e => setDevice(e.target.value)} />
                        </div>

                        <div className="mt-1">
                           <label>Resolution:</label>
                           <select value={resolution} onChange={e => setResolution(e.target.value)}>
                              <option value="480p">480p</option>
                              <option value="720p">720p</option>
                              <option value="1080p">1080p</option>
                           </select>
                        </div>
                        <Button onClick={startStream} size="Small" className="mt-4">
                           Start Streaming
                        </Button>
                     </div>
                  ) : (
                     <div className="stream-active mt-8">
                        <h3>Stream is live!</h3>
                        <p>Stream Key: {streamKey}</p>
                        <p>RTMP URL: {streamInfo?.rtmp_url}</p>
                        <p>HLS URL: {streamInfo?.hls_url}</p>

                        <div className="preview">
                           <h4>Preview</h4>
                           <video controls src={`${BASE_URL}/api/play/${streamKey}`} autoPlay muted />
                        </div>

                        <button onClick={stopStream}>Stop Streaming</button>
                     </div>
                  )}
               </div>
            </div>
         </main>
      </MainLayout>
   );
};

export default StreamBroadcaster;
