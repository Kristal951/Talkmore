import React from 'react';
import { useCall, useCallStateHooks, StreamCall, StreamTheme, StreamVideo, SpeakerLayout, PaginatedGridLayout, CallControls } from '@stream-io/video-react-sdk';
import '@stream-io/video-react-sdk/dist/css/styles.css';
import { useNavigate } from 'react-router-dom';
import { ImPhoneHangUp } from "react-icons/im";
import './index.css';
import { useVideoClientContext } from '../../Contexts/VideoClientContext';

const CustomCallControls = () => {
    const { useCallCallingState } = useCallStateHooks();

    const call = useCall();
    const callingState = useCallCallingState();
    const navigate = useNavigate();
    console.log(callingState);

    const handleLeaveCall = async () => {
        try {
            const localParticipant = call.state.localParticipant;

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
                <ImPhoneHangUp className='w-full h-full text-white'/>
            </button>
        </div>
    );
};

const CustomVideoCallUI = () => {
    const { videoClient } = useVideoClientContext();
    const call = useCall();

    return (
        <div className='w-full h-full'>
            {videoClient && (
                <StreamVideo client={videoClient}>
                    <StreamTheme>
                        <StreamCall call={call}>
                            <SpeakerLayout />
                            {/* <PaginatedGridLayout /> */}
                            <div className="flex w-full h-[70px] ml-[70px] border-[1px] flex-row fixed border-t-blue-600 items-center justify-center bg-white bottom-0 right-0 left-0">
                                <CallControls />
                                <div className="absolute right-[5em]">
                                    <CustomCallControls />
                                </div>
                            </div>
                        </StreamCall>
                    </StreamTheme>
                </StreamVideo>
            )}
        </div>
    );
};

export default CustomVideoCallUI;
