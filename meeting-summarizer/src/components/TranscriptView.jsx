import React, { useState } from 'react';
import { Search, User, Clock, Edit2, Check, Copy, Sparkles, Filter } from 'lucide-react';

export default function TranscriptView({ transcript = [], onTimestampClick, onUpdateTranscript }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpeaker, setSelectedSpeaker] = useState('ALL');
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState('');
  const [copied, setCopied] = useState(false);

  // Extract unique speaker names
  const speakers = ['ALL', ...new Set(transcript.map(t => t.speaker))];

  // Filter transcript lines
  const filteredLines = transcript.filter(line => {
    const matchesSearch = line.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          line.speaker.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSpeaker = selectedSpeaker === 'ALL' || line.speaker === selectedSpeaker;
    return matchesSearch && matchesSpeaker;
  });

  const handleStartEdit = (item) => {
    setEditingId(item.id);
    setEditText(item.text);
  };

  const handleSaveEdit = (id) => {
    const updated = transcript.map(t => t.id === id ? { ...t, text: editText } : t);
    onUpdateTranscript?.(updated);
    setEditingId(null);
  };

  const handleCopyAll = () => {
    const formatted = transcript.map(t => `[${t.timestamp}] ${t.speaker}: ${t.text}`).join('\n');
    navigator.clipboard.writeText(formatted);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem', height: '100%' }}>
      
      {/* Top Filter Bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <h3 style={{ fontSize: '1.1rem' }}>📝 Nội dung Thoại (Transcript)</h3>
          <span className="badge badge-indigo">{transcript.length} câu thoại</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          {/* Search Box */}
          <div style={{ position: 'relative', minWidth: '220px' }}>
            <Search size={16} color="var(--text-dim)" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              placeholder="Tìm kiếm nội dung..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '0.45rem 0.75rem 0.45rem 2.2rem',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border-light)',
                background: 'rgba(15, 23, 42, 0.6)',
                color: '#fff',
                fontSize: '0.85rem'
              }}
            />
          </div>

          {/* Speaker Filter */}
          <select
            value={selectedSpeaker}
            onChange={(e) => setSelectedSpeaker(e.target.value)}
            style={{
              padding: '0.45rem 0.75rem',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--border-light)',
              background: 'rgba(15, 23, 42, 0.6)',
              color: '#fff',
              fontSize: '0.85rem'
            }}
          >
            {speakers.map(s => (
              <option key={s} value={s}>{s === 'ALL' ? 'Tất cả người nói' : s}</option>
            ))}
          </select>

          <button className="btn-secondary" onClick={handleCopyAll} style={{ fontSize: '0.8rem', padding: '0.45rem 0.8rem' }}>
            <Copy size={14} />
            {copied ? 'Đã chép!' : 'Sao chép tất cả'}
          </button>
        </div>
      </div>

      {/* Transcript Line Items List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', maxHeight: '520px', overflowY: 'auto', paddingRight: '0.5rem' }}>
        {filteredLines.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-muted)' }}>
            Không tìm thấy từ khóa phù hợp trong transcript.
          </div>
        ) : (
          filteredLines.map((item) => (
            <div 
              key={item.id}
              style={{
                padding: '1rem',
                borderRadius: 'var(--radius-sm)',
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid var(--border-light)',
                transition: 'all 0.2s ease'
              }}
              className="glass-panel-interactive"
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  {/* Clickable Timestamp Pill */}
                  <span 
                    className="timestamp-pill"
                    onClick={() => onTimestampClick?.(item.start)}
                    title="Nhấn để phát video/audio tại thời điểm này"
                  >
                    <Clock size={12} />
                    {item.timestamp}
                  </span>

                  {/* Speaker Label */}
                  <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#c084fc', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <User size={13} />
                    {item.speaker}
                  </span>
                </div>

                <button 
                  className="btn-ghost" 
                  onClick={() => handleStartEdit(item)}
                  style={{ padding: '0.2rem 0.4rem', fontSize: '0.75rem' }}
                >
                  <Edit2 size={13} />
                </button>
              </div>

              {/* Text content or edit input */}
              {editingId === item.id ? (
                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                  <textarea
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    style={{
                      flex: 1,
                      padding: '0.5rem',
                      borderRadius: 'var(--radius-sm)',
                      border: '1px solid var(--accent-primary)',
                      background: 'rgba(15, 23, 42, 0.8)',
                      color: '#fff',
                      fontSize: '0.9rem',
                      minHeight: '60px'
                    }}
                  />
                  <button className="btn-primary" onClick={() => handleSaveEdit(item.id)} style={{ padding: '0.4rem 0.8rem' }}>
                    <Check size={16} />
                  </button>
                </div>
              ) : (
                <p style={{ fontSize: '0.92rem', color: 'var(--text-main)', lineHeight: 1.5 }}>
                  {item.text}
                </p>
              )}
            </div>
          ))
        )}
      </div>

    </div>
  );
}
