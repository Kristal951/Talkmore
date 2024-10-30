import React, { useEffect, useState } from 'react';
import { useVideoClientContext } from '../Contexts/VideoClientContext';
import { Spinner } from '@chakra-ui/react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { StreamCall } from '@stream-io/video-react-sdk';
import CustomVideoCallUI from '../components/VideoCallComponents/CustomVideoCallUI';
import IncomingCallUI from '../components/VideoCallComponents/IncomingCallUI';

const AudioCallScreen = () => {
  const { videoClient, isClientReady, error } = useVideoClientContext();
  const { callID } = useParams();
  const { state } = useLocation();
  const members = state?.members || [];
  const navigate = useNavigate();

  const [call, setCall] = useState(null);
  const [callError, setCallError] = useState(null);
  const [accepted, setAccepted] = useState(false);
  const [declined, setDeclined] = useState(false);

  useEffect(() => {
    const initializeCall = async () => {
      if (isClientReady && videoClient) {
        try {
          const callType = 'audio_room';
          const newCall = videoClient.call(callType, callID);

          await newCall.getOrCreate({
            ring: true,
            data: { members: members },
          });
          setCall(newCall);
        } catch (err) {
          console.error('Error initializing video call:', err);
          setCallError('Unable to start video call');
        }
      }
    };

    initializeCall();
  }, [isClientReady, videoClient, callID]);

  const acceptCall = async () => {
    if (call) {
      try {
        await call.join();
        setAccepted(true);
      } catch (err) {
        console.error('Error joining call:', err);
        setCallError('Unable to join video call');
      }
    }
  };

  const declineCall = async () => {
    if (call) {
      try {
        await call.leave({ reject: true });
        setDeclined(true);
        navigate(-1);
      } catch (err) {
        console.error('Error declining call:', err);
        setCallError('Unable to decline the video call');
      }
    }
  };

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
    <StreamCall call={call}>
      {!accepted && !declined ? (
        <IncomingCallUI AcceptCall={acceptCall} DeclineCall={declineCall} />
      ) : accepted ? (
        <CustomVideoCallUI members={members} />
      ) : null}
    </StreamCall>
  );
};

export default AudioCallScreen;
