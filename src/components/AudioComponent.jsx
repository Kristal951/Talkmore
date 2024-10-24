import React, { useState, useRef, useEffect } from 'react';
import { FaPlay, FaPause, FaVolumeUp, FaVolumeDown } from 'react-icons/fa';
import './index.css'

const CustomAudioPlayer = ({ src }) => {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1); // Volume ranges from 0.0 to 1.0
  const [currentTime, setCurrentTime] = useState(0);

  useEffect(() => {
    const audio = audioRef.current;

    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
    };

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
      setProgress((audio.currentTime / audio.duration) * 100);
    };

    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('timeupdate', handleTimeUpdate);

    return () => {
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
    };
  }, []);

  const togglePlayPause = () => {
    const audio = audioRef.current;
    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleProgressChange = (e) => {
    const audio = audioRef.current;
    const newProgress = e.target.value;
    setProgress(newProgress);
    audio.currentTime = (newProgress / 100) * audio.duration;
  };

  const handleVolumeChange = (e) => {
    const audio = audioRef.current;
    const newVolume = e.target.value;
    setVolume(newVolume);
    audio.volume = newVolume;
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  return (
    <div className="custom-audio-player w-full p-4 bg-gray-100 rounded-lg flex flex-col items-center">
      {/* Play/Pause Button */}
      <div className="controls flex items-center space-x-4">
        <button
          className="play-pause-button p-2 text-blue-600 hover:text-blue-800"
          onClick={togglePlayPause}
        >
          {isPlaying ? <FaPause size={24} /> : <FaPlay size={24} />}
        </button>

        {/* Progress Bar */}
        <input
          type="range"
          value={progress}
          onChange={handleProgressChange}
          className="progress-bar w-full h-1 bg-blue-600 rounded-lg"
        />

        {/* Timer */}
        <div className="time text-sm text-gray-600">
          {formatTime(currentTime)} / {formatTime(duration)}
        </div>
      </div>

      {/* Volume Control */}
      <div className="volume-control mt-4 flex items-center space-x-2">
        <FaVolumeDown size={18} />
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={volume}
          onChange={handleVolumeChange}
          className="volume-slider w-24 h-1 bg-blue-600 rounded-lg"
        />
        <FaVolumeUp size={18} />
      </div>

      {/* Audio Element */}
      <audio ref={audioRef} src={src} />
    </div>
  );
};

export default CustomAudioPlayer;
