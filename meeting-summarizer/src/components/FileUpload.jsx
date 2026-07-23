import React, { useState, useRef } from 'react';
import { UploadCloud, FileAudio, FileVideo, Sparkles, ShieldCheck, Loader2 } from 'lucide-react';

export default function FileUpload({ onFilesSelect, onLoadDemo, isProcessing, progressState }) {
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
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onFilesSelect(e.dataTransfer.files);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      onFilesSelect(e.target.files);
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
          padding: '3.5rem 2rem',
          textAlign: 'center',
          border: isDragging ? '2px dashed var(--accent-primary)' : '2px dashed var(--border-light)',
          background: isDragging ? 'rgba(99, 102, 241, 0.12)' : 'var(--bg-card)',
          transition: 'all 0.3s ease'
        }}
      >
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleFileChange} 
          multiple
          accept="audio/*,video/*,.m4a,.mp3,.wav,.ogg,.mp4,.webm" 
          style={{ display: 'none' }} 
        />

        {isProcessing ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.25rem' }}>
            <Loader2 size={48} color="var(--accent-primary)" className="spin" />
            <div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '0.4rem' }} className="gradient-text">
                {progressState?.stage || 'Đang xử lý các tệp âm thanh (Multi-file)...'}
              </h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                Bảo mật 100% Client-Side - Không tải file lên server lạ
              </p>
            </div>
          </div>
        ) : (
          <>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginBottom: '1.25rem' }}>
              <div style={{ width: '56px', height: '56px', borderRadius: '16px', background: 'rgba(99, 102, 241, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <FileAudio size={28} color="#818cf8" />
              </div>
              <div style={{ width: '56px', height: '56px', borderRadius: '16px', background: 'rgba(6, 182, 212, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <FileVideo size={28} color="#38bdf8" />
              </div>
            </div>

            <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.5rem' }}>
              Chọn hoặc Kéo Thả <span style={{ color: '#38bdf8' }}>NHIỀU TỆP GHI ÂM (Audio/Video)</span> cùng lúc
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.75rem', maxWidth: '650px', margin: '0 auto 1.75rem auto' }}>
              Chuẩn NotebookLM: Hỗ trợ chọn đồng thời nhiều tệp MP3, M4A, WAV, MP4. Ứng dụng sẽ tự động tổng hợp biên bản chung cho tất cả các tệp.
            </p>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
              <button 
                className="btn-primary" 
                onClick={() => fileInputRef.current?.click()}
                style={{ padding: '0.85rem 2rem', fontSize: '1rem' }}
              >
                <UploadCloud size={20} />
                Tải Lên Nhiều Tệp Audio / Video
              </button>

              <button 
                className="btn-secondary" 
                onClick={onLoadDemo}
                style={{ padding: '0.85rem 1.4rem', background: 'rgba(139, 92, 246, 0.15)', borderColor: 'rgba(139, 92, 246, 0.3)' }}
              >
                <Sparkles size={18} color="#c084fc" />
                💡 Thử Dự án Mẫu (Demo 2 Tệp)
              </button>
            </div>

            <div style={{ marginTop: '2rem', display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(16, 185, 129, 0.1)', padding: '0.4rem 0.9rem', borderRadius: 'var(--radius-full)', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
              <ShieldCheck size={16} color="#34d399" />
              <span style={{ fontSize: '0.75rem', color: '#a7f3d0' }}>
                Bảo mật dữ liệu 100% Client-Side: Không có âm thanh/video nào bị lưu ngoài thiết bị của bạn
              </span>
            </div>
          </>
        )}
      </div>

    </div>
  );
}
