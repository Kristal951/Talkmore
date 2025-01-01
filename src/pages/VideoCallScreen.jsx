import React, { useEffect, useState } from "react";
import { useVideoClientContext } from "../Contexts/VideoClientContext";
import { Spinner } from "@chakra-ui/react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { StreamCall } from "@stream-io/video-react-sdk";
import CustomVideoCallUI from "../components/VideoCallComponents/CustomVideoCallUI";
import IncomingCallUI from "../components/VideoCallComponents/IncomingCallUI";
import { useChatContext } from "stream-chat-react";

const VideoCallScreen = () => {
  const { videoClient, isClientReady, error } = useVideoClientContext();
  const { client } = useChatContext();
  const { callID } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();

  const memberstate = state?.videoCallMembers || [];
  const memberIDs = Object.values(memberstate).map((user) => ({
    user_id: user.user_id,
  }));

  const [call, setCall] = useState(null);
  const [callError, setCallError] = useState(null);
  const [accepted, setAccepted] = useState(false);
  const [declined, setDeclined] = useState(false);
  const [isInitializing, setIsInitializing] = useState(false);

  useEffect(() => {
    if (!isClientReady || !videoClient || !callID) return;

    const initializeCall = async (attempts = 4, delay = 1000) => {
      try {
        setIsInitializing(true);
        const callType = "default";
        const newCall = videoClient.call(callType, callID);

        await newCall.getOrCreate({
          data: { members: memberIDs },
        });
        setCall(newCall);
      } catch (err) {
        if (err.message.includes("Too many requests") && attempts > 0) {
          console.warn(`Rate limit reached. Retrying in ${delay}ms...`);
          setTimeout(() => initializeCall(attempts - 1, delay * 2), delay);
        } else {
          console.error("Error initializing video call:", err);
          setCallError("Unable to start video call. Please try again later.");
        }
      } finally {
        setIsInitializing(false);
      }
    };

    initializeCall();
  }, [isClientReady, videoClient, callID, memberIDs]);

  const acceptCall = async () => {
    if (call) {
      try {
        await call.join();
        setAccepted(true);
      } catch (err) {
        console.error("Error joining call:", err);
        setCallError("Unable to join video call. Please try again.");
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
        console.error("Error declining call:", err);
        setCallError("Unable to decline the video call.");
      }
    }
  };

  if (error || callError) {
    return (
      <div className="w-full h-screen flex justify-center items-center flex-col">
        <h2 className="font-bold text-xl">
          Something went wrong. Your Video Call could not be started.
        </h2>
        <p>{callError || "Please check your internet connection and try again."}</p>
      </div>
    );
  }

  if (isInitializing || !call) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <StreamCall call={call}>
      {!accepted && !declined ? (
        <IncomingCallUI AcceptCall={acceptCall} DeclineCall={declineCall} />
      ) : accepted ? (
        <CustomVideoCallUI />
      ) : null}
    </StreamCall>
  );
};

export default VideoCallScreen;
