import React, { useState, useRef } from 'react';
import { UploadCloud, FileAudio, FileVideo, Sparkles, AlertCircle, ShieldCheck, Loader2 } from 'lucide-react';

export default function FileUpload({ onFileSelect, onLoadDemo, isProcessing, progressState }) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndProcess(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      validateAndProcess(e.target.files[0]);
    }
  };

  const validateAndProcess = (file) => {
    const validTypes = ['audio/mp3', 'audio/wav', 'audio/mpeg', 'audio/m4a', 'audio/ogg', 'video/mp4', 'video/webm', 'video/quicktime'];
    const isAudioOrVideo = file.type.startsWith('audio/') || file.type.startsWith('video/') || validTypes.includes(file.type);
    
    if (isAudioOrVideo) {
      onFileSelect(file);
    } else {
      alert('Vui lòng chọn tệp định dạng Âm thanh (MP3, WAV, M4A, OGG) hoặc Video (MP4, WEBM, MOV).');
    }
  };

  return (
    <div style={{ maxWidth: '850px', margin: '0 auto 2.5rem auto' }}>
      
      {/* Main Upload Dropzone */}
      <div 
        className="glass-panel"
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        style={{
          padding: '3rem 2rem',
          textAlign: 'center',
          border: isDragging ? '2px dashed var(--accent-primary)' : '2px dashed var(--border-light)',
          background: isDragging ? 'rgba(99, 102, 241, 0.12)' : 'var(--bg-card)',
          transition: 'all 0.3s ease',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleFileChange} 
          accept="audio/*,video/*" 
          style={{ display: 'none' }} 
        />

        {isProcessing ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.25rem' }}>
            <div style={{ position: 'relative' }}>
              <Loader2 size={48} color="var(--accent-primary)" className="spin" />
              <Sparkles size={20} color="var(--accent-cyan)" style={{ position: 'absolute', top: '-5px', right: '-5px' }} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '0.4rem' }} className="gradient-text">
                {progressState?.stage || 'Đang xử lý âm thanh & trích xuất nội dung...'}
              </h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                Đang bảo mật dữ liệu & tạo mốc thời gian...
              </p>
            </div>

            {/* Progress Bar */}
            <div style={{ width: '80%', maxWidth: '400px', height: '8px', background: 'rgba(255, 255, 255, 0.1)', borderRadius: '4px', overflow: 'hidden', marginTop: '0.5rem' }}>
              <div 
                style={{ 
                  width: `${progressState?.progress || 30}%`, 
                  height: '100%', 
                  background: 'linear-gradient(90deg, #6366f1, #06b6d4)',
                  transition: 'width 0.4s ease'
                }} 
              />
            </div>
          </div>
        ) : (
          <>
            {/* Upload Icon Group */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginBottom: '1.25rem' }}>
              <div style={{ width: '56px', height: '56px', borderRadius: '16px', background: 'rgba(99, 102, 241, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <FileAudio size={28} color="#818cf8" />
              </div>
              <div style={{ width: '56px', height: '56px', borderRadius: '16px', background: 'rgba(6, 182, 212, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <FileVideo size={28} color="#38bdf8" />
              </div>
            </div>

            <h2 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '0.5rem' }}>
              Kéo & Thả Tệp Ghi Âm hoặc Video Cuộc họp vào đây
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
              Hỗ trợ MP3, WAV, M4A, OGG, MP4, WEBM, MOV (Tối đa bảo mật - Không tải file lên server lạ)
            </p>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
              <button 
                className="btn-primary" 
                onClick={() => fileInputRef.current?.click()}
                style={{ padding: '0.75rem 1.8rem' }}
              >
                <UploadCloud size={20} />
                Tải Tệp Lên Ngay
              </button>

              <button 
                className="btn-secondary" 
                onClick={onLoadDemo}
                style={{ padding: '0.75rem 1.4rem', background: 'rgba(139, 92, 246, 0.15)', borderColor: 'rgba(139, 92, 246, 0.3)' }}
              >
                <Sparkles size={18} color="#c084fc" />
                💡 Thử Cuộc họp Mẫu (Demo)
              </button>
            </div>

            {/* Safety Banner Footer */}
            <div style={{ marginTop: '2rem', display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(16, 185, 129, 0.1)', padding: '0.4rem 0.9rem', borderRadius: 'var(--radius-full)', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
              <ShieldCheck size={16} color="#34d399" />
              <span style={{ fontSize: '0.75rem', color: '#a7f3d0' }}>
                Cam kết 100% An toàn Thông tin: Dữ liệu được xử lý cục bộ trên trình duyệt của bạn
              </span>
            </div>
          </>
        )}
      </div>

    </div>
  );
}
