import React, { useEffect, useState } from 'react';
import { useVideoClientContext } from '../Contexts/VideoClientContext';
import { Spinner } from '@chakra-ui/react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { StreamCall } from '@stream-io/video-react-sdk';
import CustomVideoCallUI from '../components/VideoCallComponents/CustomVideoCallUI';
import IncomingCallUI from '../components/VideoCallComponents/IncomingCallUI';
import { useChatContext } from 'stream-chat-react';

const VideoCallScreen = () => {
  const { videoClient, isClientReady, error } = useVideoClientContext();
  const { client } = useChatContext();
  const { callID } = useParams();
  const { state } = useLocation();
  const memberstate = state?.videoCallMembers || [];
  const memberIDs = Object.values(memberstate).map((user) => user.user_id);
  const navigate = useNavigate();

  const [call, setCall] = useState(null);
  const [callError, setCallError] = useState(null);
  const [accepted, setAccepted] = useState(false);
  const [declined, setDeclined] = useState(false);
  const [memberDetails, setMemberDetails] = useState([]);

  useEffect(() => {
    if (!isClientReady || !videoClient || !callID) return;

    const initializeCall = async () => {
      try {
        const callType = 'default';
        const newCall = videoClient.call(callType, callID);

        // Correctly format members with required `user_id`
        const formattedMembers = memberIDs.map((id) => ({ user_id: id }));

        await newCall.getOrCreate({
          ring: true,
          data: { members: formattedMembers },
          role: 'user'
        });
        setCall(newCall);
      } catch (err) {
        console.error('Error initializing video call:', err);
        setCallError('Unable to start video call');
      }
    };

    const fetchMemberDetails = async () => {
      try {
        // Fetch user details for the members
        const members = await Promise.all(
          memberIDs.map(async (id) => {
            const user = await client.queryUsers({ id }, { timeout: 5000 }); // Set timeout to 5000ms
            return user.users[0];
          })
        );
        setMemberDetails(members);
      } catch (err) {
        console.error('Error fetching member details:', err);
      }
    };

    initializeCall();
    fetchMemberDetails();
  }, [isClientReady, videoClient, callID, memberIDs, client]);

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
        <CustomVideoCallUI members={memberDetails} />
      ) : null}
    </StreamCall>
  );
};

export default VideoCallScreen;
