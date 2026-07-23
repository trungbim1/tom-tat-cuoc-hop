import React, { useRef, useEffect, useState } from 'react';
import { Play, Pause, Volume2, VolumeX, RotateCcw, FastForward, Film, Music } from 'lucide-react';

export default function MediaPlayer({ mediaUrl, fileType, currentTime, onSeek, onDurationChange }) {
  const mediaRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [duration, setDuration] = useState(0);
  const [localTime, setLocalTime] = useState(0);
  const [isMuted, setIsMuted] = useState(false);

  const isVideo = fileType?.startsWith('video/') || mediaUrl?.includes('.mp4') || mediaUrl?.includes('.webm');

  // React to seek requests from parent (timestamp clicks in transcript/chat)
  useEffect(() => {
    if (currentTime !== undefined && mediaRef.current) {
      if (Math.abs(mediaRef.current.currentTime - currentTime) > 0.5) {
        mediaRef.current.currentTime = currentTime;
        mediaRef.current.play().catch(() => {});
        setIsPlaying(true);
      }
    }
  }, [currentTime]);

  const handleTimeUpdate = () => {
    if (mediaRef.current) {
      setLocalTime(mediaRef.current.currentTime);
      onSeek?.(mediaRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (mediaRef.current) {
      setDuration(mediaRef.current.duration);
      onDurationChange?.(mediaRef.current.duration);
    }
  };

  const togglePlay = () => {
    if (!mediaRef.current) return;
    if (isPlaying) {
      mediaRef.current.pause();
      setIsPlaying(false);
    } else {
      mediaRef.current.play().catch(() => {});
      setIsPlaying(true);
    }
  };

  const handleSpeedChange = (speed) => {
    setPlaybackSpeed(speed);
    if (mediaRef.current) {
      mediaRef.current.playbackRate = speed;
    }
  };

  const handleSliderChange = (e) => {
    const val = parseFloat(e.target.value);
    setLocalTime(val);
    if (mediaRef.current) {
      mediaRef.current.currentTime = val;
    }
  };

  const formatTime = (secs) => {
    if (isNaN(secs)) return '00:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="glass-panel" style={{ padding: '1.25rem', marginBottom: '1.5rem' }}>
      
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          {isVideo ? <Film size={18} color="#38bdf8" /> : <Music size={18} color="#818cf8" />}
          <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)' }}>
            {isVideo ? 'Trình phát Video Đồng bộ' : 'Trình phát Âm thanh Đồng bộ'}
          </span>
        </div>

        {/* Speed Controls */}
        <div style={{ display: 'flex', gap: '0.35rem' }}>
          {[0.75, 1, 1.25, 1.5, 2].map((s) => (
            <button
              key={s}
              onClick={() => handleSpeedChange(s)}
              style={{
                fontSize: '0.75rem',
                padding: '0.2rem 0.5rem',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border-light)',
                background: playbackSpeed === s ? 'var(--accent-primary)' : 'transparent',
                color: playbackSpeed === s ? '#fff' : 'var(--text-muted)',
                cursor: 'pointer'
              }}
            >
              {s}x
            </button>
          ))}
        </div>
      </div>

      {/* Video Element if Video File */}
      {isVideo && mediaUrl && (
        <div style={{ marginBottom: '1rem', borderRadius: '12px', overflow: 'hidden', background: '#000', textAlign: 'center' }}>
          <video
            ref={mediaRef}
            src={mediaUrl}
            onTimeUpdate={handleTimeUpdate}
            onLoadedMetadata={handleLoadedMetadata}
            style={{ width: '100%', maxHeight: '360px', objectFit: 'contain' }}
            onClick={togglePlay}
          />
        </div>
      )}

      {/* Hidden Audio element if purely audio */}
      {!isVideo && (
        <audio
          ref={mediaRef}
          src={mediaUrl}
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
        />
      )}

      {/* Controls Bar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <button 
          className="btn-primary" 
          onClick={togglePlay}
          style={{ width: '40px', height: '40px', padding: 0, borderRadius: '50%', justifyContent: 'center' }}
        >
          {isPlaying ? <Pause size={18} /> : <Play size={18} style={{ marginLeft: '2px' }} />}
        </button>

        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: '#a5b4fc', minWidth: '85px' }}>
          {formatTime(localTime)} / {formatTime(duration)}
        </span>

        {/* Seek Slider */}
        <input
          type="range"
          min="0"
          max={duration || 100}
          value={localTime}
          onChange={handleSliderChange}
          style={{
            flex: 1,
            accentColor: 'var(--accent-primary)',
            cursor: 'pointer'
          }}
        />

        <button 
          className="btn-ghost" 
          onClick={() => {
            if (mediaRef.current) {
              mediaRef.current.muted = !isMuted;
              setIsMuted(!isMuted);
            }
          }}
          style={{ padding: '0.4rem' }}
        >
          {isMuted ? <VolumeX size={18} color="var(--accent-rose)" /> : <Volume2 size={18} />}
        </button>
      </div>

    </div>
  );
}
