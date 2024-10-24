import React, { useState, useEffect } from 'react';
import { MessageList, MessageInput, Thread, Window, useChannelActionContext } from 'stream-chat-react';
import TeamChannelHeader from './TeamChannelHeader';
import { FaMicrophone } from "react-icons/fa";
import { IoSend } from "react-icons/io5";
import { MdDelete } from "react-icons/md";
import { AudioRecorder } from 'react-audio-voice-recorder'; // Import react-audio-voice-recorder

export const GiphyContext = React.createContext({});

const ChannelInner = ({ setIsEditing }) => {
  const [giphyState, setGiphyState] = useState(false);
  const { sendMessage } = useChannelActionContext();
  const [audioBlob, setAudioBlob] = useState(null);
  const [audioUrl, setAudioUrl] = useState(null);
  const [recordingTime, setRecordingTime] = useState(0);
  const [isRecording, setIsRecording] = useState(false);

  useEffect(() => {
    // Check microphone permissions on component mount
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then(() => {
        console.log("Microphone permission granted.");
      })
      .catch((error) => {
        console.error("Microphone permission denied:", error);
      });
  }, []);

  // Function to handle the audio recording completion
  const addAudioElement = (blob) => {
    console.log("Recording complete:", blob); // Debugging log
    const url = URL.createObjectURL(blob);
    setAudioBlob(blob);
    setAudioUrl(url); // Set URL for immediate playback
  };

  const overrideSubmitHandler = async (message) => {
    let updatedMessage = {
      attachments: message.attachments || [],
      mentioned_users: message.mentioned_users || [],
      parent_id: message.parent?.id,
      parent: message.parent,
      text: message.text || "Audio message", // Ensure there's a default text
    };

    // Attach audio recording if available
    if (audioBlob) {
      const audioFile = new File([audioBlob], "audio.wav", { type: "audio/wav" });
      const audioAttachment = {
        type: 'audio',
        file: audioFile,
      };
      updatedMessage.attachments.push(audioAttachment); // Add audio attachment
      setAudioBlob(null); // Clear the audio blob after sending
      setAudioUrl(null); // Reset audio URL after sending
    }

    // Send the message
    if (sendMessage) {
      console.log("Sending message:", updatedMessage); // Debugging log
      await sendMessage(updatedMessage);
      setGiphyState(false);
    }
  };

  const handleDeleteAudio = () => {
    setAudioBlob(null);
    setAudioUrl(null);
    setRecordingTime(0);
    setIsRecording(false);
  };

  return (
    <GiphyContext.Provider value={{ giphyState, setGiphyState }}>
      <div style={{ display: 'flex', width: '100%' }}>
        <Window>
          <TeamChannelHeader setIsEditing={setIsEditing} />
          <MessageList /> {/* Stream will automatically render an audio player for audio attachments */}
          {
            !isRecording ? (
              <div className='flex flex-row items-center'>
                <MessageInput overrideSubmitHandler={overrideSubmitHandler} />
                <div className="flex items-center mr-2 justify-center p-2 rounded-full bg-blue-600">
                  {/* Use ReactAudioRecorder for recording */}
                  <AudioRecorder
                    onRecordingComplete={addAudioElement} // When recording finishes, add the audio element
                    className="cursor-pointer w-[30px] h-[30px] text-white"
                    recorderControls={{
                      setRecording: setIsRecording,
                      recordingTime: recordingTime
                    }}
                  />
                </div>
              </div>
            ) : (
              <div className='flex flex-row w-full shadow-md bg-[#4b5563] bg-opacity-15 border-[1px] z-40 relative h-[60px] items-center'>
                <div className="flex absolute right-4 items-center justify-center flex-row gap-2">
                  <MdDelete 
                    onClick={handleDeleteAudio}
                    className={`cursor-pointer text-blue-600 ml-2 w-[50px] h-[50px] ${!audioBlob ? 'opacity-50 cursor-not-allowed' : ''}`}
                    disabled={!audioBlob}
                  />
                  <span className="">{`${Math.floor(recordingTime / 60)}:${recordingTime % 60 < 10 ? '0' : ''}${recordingTime % 60}`}</span>
                  <IoSend 
                    onClick={async () => {
                      await overrideSubmitHandler({ text: '' }); // Send the message with audio
                      setIsRecording(false);
                    }} 
                    className="cursor-pointer text-blue-600 w-[50px] h-[50px]"
                  />
                </div>
              </div>
            )
          }
          {audioUrl && (
            <div className="mt-2">
              <audio controls src={audioUrl}>
                Your browser does not support the audio element.
              </audio>
            </div>
          )}
        </Window>
        <Thread />
      </div>
    </GiphyContext.Provider>
  );
};

export default ChannelInner;
