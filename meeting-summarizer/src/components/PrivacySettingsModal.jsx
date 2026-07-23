import React, { useState } from 'react';
import { X, ShieldCheck, Key, Cpu, Zap, Lock, Trash2, CheckCircle2 } from 'lucide-react';

export default function PrivacySettingsModal({ isOpen, onClose, settings, onSaveSettings, onClearData }) {
  if (!isOpen) return null;

  const [engine, setEngine] = useState(settings?.engine || 'local');
  const [apiKey, setApiKey] = useState(settings?.apiKey || '');
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    onSaveSettings({ engine, apiKey });
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      onClose();
    }, 1200);
  };

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
      <div className="glass-panel" style={{ width: '100%', maxWidth: '580px', padding: '2rem', borderRadius: '20px', position: 'relative' }}>
        
        {/* Close Button */}
        <button 
          onClick={onClose} 
          className="btn-ghost" 
          style={{ position: 'absolute', top: '1.25rem', right: '1.25rem', padding: '0.4rem' }}
        >
          <X size={20} />
        </button>

        {/* Modal Title */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'rgba(16, 185, 129, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ShieldCheck size={24} color="#34d399" />
          </div>
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Cấu hình Bảo mật & Động cơ AI</h2>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Quản lý quyền riêng tư và chìa khóa API cá nhân</p>
          </div>
        </div>

        {/* Processing Engine Choice */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
          <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)' }}>
            CHỌN ĐỘNG CƠ XỬ LÝ ÂM THANH & TÓM TẮT:
          </label>

          {/* Option 1: 100% Offline Local */}
          <div 
            onClick={() => setEngine('local')}
            style={{
              padding: '1rem',
              borderRadius: 'var(--radius-md)',
              border: engine === 'local' ? '2px solid var(--accent-emerald)' : '1px solid var(--border-light)',
              background: engine === 'local' ? 'rgba(16, 185, 129, 0.08)' : 'rgba(255, 255, 255, 0.03)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '0.85rem',
              transition: 'all 0.2s ease'
            }}
          >
            <Cpu size={22} color="#34d399" style={{ marginTop: '2px' }} />
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ fontWeight: 700, fontSize: '0.95rem', color: '#34d399' }}>Chế độ 100% Offline (Local Client-Side)</span>
                <span className="badge badge-emerald">Khuyên dùng</span>
              </div>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                Chạy hoàn toàn trong trình duyệt (WebAssembly / WebGPU). Âm thanh, video và văn bản KHÔNG BAO GIỜ bị đẩy khỏi thiết bị.
              </p>
            </div>
          </div>

          {/* Option 2: BYOK Groq / OpenAI */}
          <div 
            onClick={() => setEngine('groq')}
            style={{
              padding: '1rem',
              borderRadius: 'var(--radius-md)',
              border: engine === 'groq' ? '2px solid var(--accent-primary)' : '1px solid var(--border-light)',
              background: engine === 'groq' ? 'rgba(99, 102, 241, 0.08)' : 'rgba(255, 255, 255, 0.03)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '0.85rem',
              transition: 'all 0.2s ease'
            }}
          >
            <Zap size={22} color="#818cf8" style={{ marginTop: '2px' }} />
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ fontWeight: 700, fontSize: '0.95rem', color: '#a5b4fc' }}>Chế độ BYOK Fast API (Groq / OpenAI Whisper-v3)</span>
                <span className="badge badge-indigo">Siêu tốc</span>
              </div>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                Sử dụng API Key cá nhân của bạn để trích xuất âm thanh chỉ trong vài giây. Key chỉ lưu duy nhất ở LocalStorage thiết bị của bạn.
              </p>
            </div>
          </div>
        </div>

        {/* API Key Input if BYOK Engine selected */}
        {engine !== 'local' && (
          <div style={{ marginBottom: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Key size={14} color="#fbbf24" />
              NHẬP API KEY CỦA BẠN (GROQ / OPENAI):
            </label>
            <input
              type="password"
              placeholder="gsk_... hoặc sk-..."
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              style={{
                width: '100%',
                padding: '0.7rem 1rem',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border-light)',
                background: 'rgba(15, 23, 42, 0.8)',
                color: '#fff',
                fontSize: '0.9rem'
              }}
            />
            <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
              🔒 Key được mã hóa và lưu tại `localStorage` trình duyệt cá nhân.
            </span>
          </div>
        )}

        {/* Action Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '2rem', paddingTop: '1rem', borderTop: '1px solid var(--border-light)' }}>
          <button 
            className="btn-ghost" 
            onClick={() => {
              if (confirm('Bạn có chắc muốn xóa tất cả dữ liệu biên bản cuộc họp đã lưu cục bộ?')) {
                onClearData();
                onClose();
              }
            }}
            style={{ color: 'var(--accent-rose)', fontSize: '0.85rem' }}
          >
            <Trash2 size={16} />
            Xóa Toàn bộ Dữ liệu Lịch sử
          </button>

          <button className="btn-primary" onClick={handleSave}>
            {saved ? <CheckCircle2 size={18} /> : <Lock size={16} />}
            {saved ? 'Đã Lưu!' : 'Lưu Cấu Hình'}
          </button>
        </div>

      </div>
    </div>
  );
}
