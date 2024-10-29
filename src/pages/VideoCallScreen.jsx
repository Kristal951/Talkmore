import React, { useEffect, useState } from 'react';
import { useVideoClientContext } from '../Contexts/VideoClientContext';
import { Spinner } from '@chakra-ui/react';
import { useParams, useLocation } from 'react-router-dom';
import { StreamCall } from '@stream-io/video-react-sdk';
import CustomVideoCallUI from '../components/VideoCallComponents/CustomVideoCallUI';

const VideoCallScreen = () => {
  const { videoClient, isClientReady, error } = useVideoClientContext();
  const { callID } = useParams(); // Ensure this matches the route param name
  const { state } = useLocation(); // Retrieve members from the state
  const members = state?.members || [];

  const [call, setCall] = useState(null);
  const [callError, setCallError] = useState(null);

  useEffect(() => {
    const initializeCall = async () => {
      if (isClientReady && videoClient) {
        try {
          const callType = 'default';
          const newCall = videoClient.call(callType, callID);

          await newCall.getOrCreate({
            data: {
              ring: 'true',
              members: members,
            },
          });

          // await newCall.join(); // Join the call after it’s created
          setCall(newCall);

        } catch (err) {
          console.error('Error initializing video call:', err);
          setCallError('Unable to start video call');
        }
      }
    };

    initializeCall();
  }, [isClientReady, videoClient, callID]);

  if (error || callError) {
    return (
      <div className='w-full h-screen flex justify-center items-center flex-col'>
        <h2 className='font-bold text-xl'>Something went wrong. Your Video Call could not be started.</h2>
        <p>Please check your internet connection and try again.</p>
      </div>
    );
  }

  if (!isClientReady || !call) {
    return (
      <div className='w-full h-screen flex items-center justify-center'>
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className='w-full h-screen flex items-center justify-center'>
      <StreamCall call={call}>
        <CustomVideoCallUI members={members} />
      </StreamCall>
    </div>
  );
};

export default VideoCallScreen;
