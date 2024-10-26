import React, { useEffect, useRef, useState } from 'react';
import { MessageList, MessageInput, Thread, Window, useChannelActionContext } from 'stream-chat-react';
import TeamChannelHeader from './TeamChannelHeader';
import { FaMicrophone } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { IoSend } from "react-icons/io5";
import { ReactMic } from 'react-mic';
import { AudioVisualizer } from 'react-audio-visualize';
import { ReactMediaRecorder } from "react-media-recorder";

export const GiphyContext = React.createContext({});

const ChannelInner = ({ setIsEditing }) => {
  const [giphyState, setGiphyState] = useState(false);
  const { sendMessage } = useChannelActionContext();
  const [audioBlob, setAudioBlob] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioChunks, setAudioChunks] = useState([]); // Store chunks for visualization
  const visualizerRef = useRef(null);

  useEffect(() => {
    let interval;
    if (isRecording) {
      interval = setInterval(() => setRecordingTime((prev) => prev + 1), 1000);
    } else {
      clearInterval(interval);
      setRecordingTime(0);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  const overrideSubmitHandler = async (message) => {
    let updatedMessage = {
      attachments: message.attachments || [],
      mentioned_users: message.mentioned_users || [],
      parent_id: message.parent?.id,
      parent: message.parent,
      text: message.text || "Audio message",
    };

    if (audioBlob) {
      const audioFile = new File([audioBlob], "audio.wav", { type: "audio/wav" });
      const audioAttachment = { type: 'audio', file: audioFile };
      updatedMessage.attachments.push(audioAttachment);
      setAudioBlob(null);
    }

    if (sendMessage) await sendMessage(updatedMessage);
    setGiphyState(false);
    setRecordingTime(0);
    setIsRecording(false);
    setAudioChunks([]); // Clear audio chunks after sending
  };

  // Clear audio recording
  const handleDeleteAudio = () => {
    setAudioBlob(null);
    setAudioChunks([]); // Clear the chunks
    setRecordingTime(0);
    setIsRecording(false);
  };

  return (
    <GiphyContext.Provider value={{ giphyState, setGiphyState }}>
      <div style={{ display: 'flex', width: '100%' }}>
        <Window>
          <TeamChannelHeader setIsEditing={setIsEditing} />
          <MessageList />
          {
            !isRecording ? (
              <div className='flex flex-row items-center'>
                <MessageInput overrideSubmitHandler={overrideSubmitHandler} />
                <div className="flex w-[50px] cursor-pointer h-[50px] items-center justify-center rounded-full hover:bg-gray-400 hover:bg-opacity-20 p-2">
                  <FaMicrophone
                    className='h-full w-full text-blue-600'
                    onClick={() => setIsRecording(true)} // Start recording
                  />
                </div>
              </div>
            ) : (
              <ReactMediaRecorder
              audio
              blobPropertyBag={{type: "audio/wav"}}
              askPermissionOnMount
              render={({ status, startRecording, stopRecording, mediaBlobUrl }) => (
                <div className="w-full bg-white h-[70px] z-50 border-t-[1px] border-blue-600 items-center flex justify-end">
                <div className="flex flex-row h-full w-max items-center justify-center">
                  <div className="flex w-[50px] h-[50px] hover:bg-gray-400 hover:bg-opacity-20 rounded-full p-2">
                    <MdDelete
                      onClick={handleDeleteAudio}
                      className="cursor-pointer text-red-500 h-full w-full"
                    />
                  </div>
                  <span>{`${Math.floor(recordingTime / 60)}:${String(recordingTime % 60).padStart(2, '0')}`}</span>

                    <AudioVisualizer
                      blob={mediaBlobUrl} 
                      width={500}
                      height={75}
                      barWidth={1}
                      gap={0}
                      barColor={'#f76565'}
                    />
                  {/* )} */}
                  <div className="flex w-[50px] h-[50px] hover:bg-gray-400 hover:bg-opacity-20 rounded-full p-2">
                    <IoSend
                      onClick={overrideSubmitHandler}
                      className="cursor-pointer text-blue-500 h-full w-full"
                    />
                  </div>
                </div>
              </div>

              )}
            />  
            )
          }
        </Window>
        <Thread />
      </div>
    </GiphyContext.Provider>
  );
};

export default ChannelInner;
