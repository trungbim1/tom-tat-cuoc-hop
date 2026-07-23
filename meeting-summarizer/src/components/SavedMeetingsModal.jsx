import React from 'react';
import { X, Calendar, Clock, Trash2, ArrowRight, FolderFolder, FileText } from 'lucide-react';

export default function SavedMeetingsModal({ isOpen, onClose, meetings = [], onSelectMeeting, onDeleteMeeting }) {
  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.75)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '1rem'
    }}>
      <div className="glass-panel" style={{ width: '100%', maxWidth: '680px', maxHeight: '80vh', display: 'flex', flexDirection: 'column', padding: '2rem', borderRadius: '20px', position: 'relative' }}>
        
        {/* Close Button */}
        <button 
          onClick={onClose} 
          className="btn-ghost" 
          style={{ position: 'absolute', top: '1.25rem', right: '1.25rem', padding: '0.4rem' }}
        >
          <X size={20} />
        </button>

        {/* Title */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'rgba(99, 102, 241, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <FolderFolder size={24} color="#818cf8" />
          </div>
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Lịch sử Biên bản Cuộc họp đã Lưu</h2>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Lưu trữ bảo mật cục bộ trong IndexedDB trình duyệt của bạn</p>
          </div>
        </div>

        {/* List of Meetings */}
        <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.85rem', paddingRight: '0.5rem' }}>
          {meetings.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-muted)' }}>
              Chưa có biên bản cuộc họp nào được lưu. Hãy tải lên tệp audio/video để bắt đầu!
            </div>
          ) : (
            meetings.map((m) => (
              <div
                key={m.id}
                style={{
                  padding: '1.2rem',
                  borderRadius: 'var(--radius-md)',
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid var(--border-light)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '1rem',
                  transition: 'all 0.2s ease'
                }}
                className="glass-panel-interactive"
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.85rem', flex: 1 }}>
                  <FileText size={22} color="#c084fc" style={{ marginTop: '2px' }} />
                  <div>
                    <h4 style={{ fontSize: '0.98rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.3rem' }}>
                      {m.title}
                    </h4>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                        <Calendar size={13} />
                        {m.date}
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                        <Clock size={13} />
                        {m.duration}
                      </span>
                      <span className="badge badge-indigo" style={{ fontSize: '0.65rem' }}>
                        {m.transcript?.length || 0} lượt phát biểu
                      </span>
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <button 
                    className="btn-primary"
                    onClick={() => { onSelectMeeting(m); onClose(); }}
                    style={{ fontSize: '0.8rem', padding: '0.45rem 0.9rem' }}
                  >
                    Xem
                    <ArrowRight size={14} />
                  </button>

                  <button 
                    className="btn-ghost"
                    onClick={() => onDeleteMeeting(m.id)}
                    style={{ color: 'var(--accent-rose)', padding: '0.45rem' }}
                    title="Xóa cuộc họp"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
}
