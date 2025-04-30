import React, { useEffect, useRef, useState } from 'react';
import {
  StreamVideo,
  StreamTheme,
  StreamCall,
  SpeakerLayout,
  CallControls,
} from '@stream-io/video-react-sdk';
import '@stream-io/video-react-sdk/dist/css/styles.css';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { ImPhoneHangUp } from "react-icons/im";
import { useVideoClientContext } from '../../Contexts/VideoClientContext';
import './index.css';

const CustomCallControls = ({ call }) => {
  const navigate = useNavigate();

  const handleLeaveCall = async () => {
    try {
      const localParticipant = call?.state?.localParticipant;

      if (localParticipant?.audioTrack) {
        await localParticipant.audioTrack.stop();
      }
      if (localParticipant?.videoTrack) {
        await localParticipant.videoTrack.stop();
      }

      await call.leave();
    } catch (error) {
      console.error("Error stopping media or leaving call:", error);
    } finally {
      navigate(-1);
    }
  };

  return (
    <div className="w-max">
      <button
        onClick={handleLeaveCall}
        title='Leave call'
        className='px-3 py-2 rounded-full bg-red-500 w-[50px] h-[50px] items-center justify-center flex'
      >
        <ImPhoneHangUp className='w-full h-full text-white' />
      </button>
    </div>
  );
};

const CustomVideoCallUI = () => {
  const { videoClient } = useVideoClientContext();
  const { callID } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const [call, setCall] = useState(null);
  const callRef = useRef(null);
  const { videoCallMembers, channelType } = location.state || {};

  useEffect(() => {
    const joinCall = async () => {
      if (!videoClient || !callID || callRef.current) return;

      try {
        const newCall = videoClient.call('default', callID);
        await newCall.join();
        callRef.current = newCall;
        setCall(newCall);
      } catch (err) {
        console.error("Failed to join call:", err);
      }
    };

    joinCall();
  }, [videoClient, callID]);

  if (!videoClient || !call) {
    return <div className="text-center p-6">Connecting to call...</div>;
  }

  return (
    <div className='w-full h-full'>
      <StreamVideo client={videoClient}>
        <StreamTheme>
          <StreamCall call={call}>
            <SpeakerLayout />
            <div className="flex w-full h-[70px] ml-[70px] border-[1px] flex-row fixed border-t-blue-600 items-center justify-center bg-white bottom-0 right-0 left-0">
              <CallControls />
              <div className="absolute right-[5em]">
                <CustomCallControls call={call} />
              </div>
            </div>
          </StreamCall>
        </StreamTheme>
      </StreamVideo>
    </div>
  );
};

export default CustomVideoCallUI;
