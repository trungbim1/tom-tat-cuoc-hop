import React from 'react';
import { ShieldCheck, Lock, Sparkles, FolderFolder, Settings, Github, HelpCircle } from 'lucide-react';

export default function Header({ 
  onOpenSettings, 
  onOpenSaved, 
  savedCount = 0,
  settings 
}) {
  const isLocalMode = settings?.engine === 'local';

  return (
    <header className="glass-panel" style={{ borderRadius: '0 0 16px 16px', borderTop: 'none', padding: '1rem 1.5rem', marginBottom: '2rem' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        
        {/* Brand Logo & Name */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ 
            width: '42px', 
            height: '42px', 
            borderRadius: '12px', 
            background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 20px rgba(99, 102, 241, 0.4)'
          }}>
            <Sparkles size={24} color="#ffffff" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <h1 style={{ fontSize: '1.25rem', fontWeight: 800 }} className="gradient-text">MeetMind AI</h1>
              <span className="badge badge-indigo" style={{ fontSize: '0.65rem' }}>v1.0 Privacy</span>
            </div>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Tóm tắt Cuộc họp Audio/Video chuẩn NotebookLM
            </p>
          </div>
        </div>

        {/* Center: Privacy Status Badge */}
        <div 
          onClick={onOpenSettings}
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.5rem', 
            padding: '0.4rem 0.9rem',
            borderRadius: 'var(--radius-full)',
            background: isLocalMode ? 'rgba(16, 185, 129, 0.12)' : 'rgba(99, 102, 241, 0.12)',
            border: `1px solid ${isLocalMode ? 'rgba(52, 211, 153, 0.3)' : 'rgba(165, 180, 252, 0.3)'}`,
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
          className="pulse-animation"
        >
          {isLocalMode ? (
            <>
              <ShieldCheck size={16} color="#34d399" />
              <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#34d399' }}>
                🔒 100% Offline / Client-Side Privacy
              </span>
            </>
          ) : (
            <>
              <Lock size={16} color="#a5b4fc" />
              <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#a5b4fc' }}>
                🔑 BYOK Fast API Mode ({settings?.engine?.toUpperCase()})
              </span>
            </>
          )}
        </div>

        {/* Right Navigation & Tools */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button className="btn-secondary" onClick={onOpenSaved} style={{ fontSize: '0.85rem' }}>
            <FolderFolder size={16} />
            Lịch sử ({savedCount})
          </button>

          <button className="btn-ghost" onClick={onOpenSettings} title="Cấu hình Bảo mật & API">
            <Settings size={18} />
          </button>

          <a 
            href="https://github.com" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="btn-ghost" 
            title="Mã nguồn GitHub"
            style={{ textDecoration: 'none' }}
          >
            <Github size={18} />
          </a>
        </div>

      </div>
    </header>
  );
}
