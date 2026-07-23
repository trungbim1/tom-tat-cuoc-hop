import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Clock, Sparkles, MessageSquare, HelpCircle, Loader2 } from 'lucide-react';
import { aiSummarizerService } from '../services/aiSummarizerService';

export default function NotebookChat({ meetingData, onTimestampClick, settings }) {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'bot',
      text: 'Xin chào! Tôi là Trợ lý AI NotebookLM của cuộc họp. Bạn có thể hỏi bất kỳ chi tiết nào trong cuộc họp, tôi sẽ trả lời và trích dẫn mốc thời gian (timestamp) tương ứng.',
      citations: []
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const chatEndRef = useRef(null);

  const suggestedQuestions = [
    '📌 Những quyết định quan trọng nhất là gì?',
    '🔒 Giải pháp bảo mật dữ liệu được chốt ra sao?',
    '✅ Công việc được giao cho ai và hạn chót?',
    '📅 Khi nào đẩy mã nguồn lên GitHub và Cloudflare?'
  ];

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isThinking]);

  const handleSend = async (questionText) => {
    const textToSend = questionText || inputValue;
    if (!textToSend.trim() || isThinking) return;

    const userMsg = {
      id: Date.now(),
      sender: 'user',
      text: textToSend
    };

    setMessages(prev => [...prev, userMsg]);
    if (!questionText) setInputValue('');
    setIsThinking(true);

    try {
      const response = await aiSummarizerService.answerNotebookQuestion(
        textToSend,
        meetingData,
        messages,
        settings
      );

      const botMsg = {
        id: Date.now() + 1,
        sender: 'bot',
        text: response.answer,
        citations: response.citations || []
      };

      setMessages(prev => [...prev, botMsg]);
    } catch (err) {
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        sender: 'bot',
        text: 'Xin lỗi, không thể trả lời câu hỏi lúc này. Hãy thử lại.',
        citations: []
      }]);
    } finally {
      setIsThinking(false);
    }
  };

  return (
    <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', height: '620px' }}>
      
      {/* Chat Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-light)', paddingBottom: '1rem', marginBottom: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <div style={{ width: '34px', height: '34px', borderRadius: '10px', background: 'linear-gradient(135deg, #06b6d4, #6366f1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Bot size={20} color="#fff" />
          </div>
          <div>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700 }}>Hỏi đáp NotebookLM theo mốc thời gian</h3>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Mọi câu trả lời đều được trích dẫn chính xác từ cuộc họp</p>
          </div>
        </div>
        <span className="badge badge-emerald">Grounded Q&A</span>
      </div>

      {/* Preset Questions Chips */}
      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
        {suggestedQuestions.map((q, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(q)}
            style={{
              fontSize: '0.78rem',
              padding: '0.35rem 0.75rem',
              borderRadius: 'var(--radius-full)',
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid var(--border-light)',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
            className="btn-ghost"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Messages List Area */}
      <div style={{ flex: 1, overflowY: 'auto', paddingRight: '0.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {messages.map((msg) => (
          <div
            key={msg.id}
            style={{
              display: 'flex',
              gap: '0.75rem',
              alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
              maxWidth: msg.sender === 'user' ? '80%' : '90%'
            }}
          >
            {msg.sender === 'bot' && (
              <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'rgba(99, 102, 241, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', minWidth: '32px' }}>
                <Sparkles size={16} color="#818cf8" />
              </div>
            )}

            <div style={{
              background: msg.sender === 'user' ? 'var(--accent-primary)' : 'rgba(15, 23, 42, 0.7)',
              border: msg.sender === 'user' ? 'none' : '1px solid var(--border-light)',
              borderRadius: '14px',
              padding: '0.85rem 1.1rem',
              color: '#fff',
              fontSize: '0.92rem',
              lineHeight: 1.5
            }}>
              <p>{msg.text}</p>

              {/* Citations List if present */}
              {msg.citations && msg.citations.length > 0 && (
                <div style={{ marginTop: '0.75rem', paddingTop: '0.75rem', borderTop: '1px dashed rgba(255, 255, 255, 0.15)', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  <span style={{ fontSize: '0.75rem', color: '#a5b4fc', fontWeight: 600 }}>Trích dẫn cuộc họp:</span>
                  {msg.citations.map((c, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', background: 'rgba(255, 255, 255, 0.04)', padding: '0.3rem 0.6rem', borderRadius: '6px' }}>
                      <span 
                        className="timestamp-pill"
                        onClick={() => onTimestampClick?.(c.seconds)}
                        title="Phát lại đoạn này"
                      >
                        <Clock size={11} />
                        {c.timestamp}
                      </span>
                      <span style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>"{c.text.substring(0, 60)}..."</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {msg.sender === 'user' && (
              <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--accent-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', minWidth: '32px' }}>
                <User size={16} color="#fff" />
              </div>
            )}
          </div>
        ))}

        {isThinking && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '0.85rem', paddingLeft: '2.5rem' }}>
            <Loader2 size={16} className="spin" color="var(--accent-cyan)" />
            <span>NotebookLM đang tìm kiếm nội dung trong cuộc họp...</span>
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      {/* Input Form */}
      <form 
        onSubmit={(e) => { e.preventDefault(); handleSend(); }}
        style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--border-light)' }}
      >
        <input
          type="text"
          placeholder="Hỏi bất kỳ điều gì về cuộc họp này..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          style={{
            flex: 1,
            padding: '0.75rem 1rem',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--border-light)',
            background: 'rgba(15, 23, 42, 0.8)',
            color: '#fff',
            fontSize: '0.9rem'
          }}
        />
        <button type="submit" className="btn-primary" disabled={isThinking}>
          <Send size={16} />
          Hỏi
        </button>
      </form>

    </div>
  );
}
