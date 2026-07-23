import React, { useState } from 'react';
import { 
  CheckCircle2, AlertCircle, Calendar, User, ListTodo, FileText, 
  Share2, Download, Copy, Sparkles, Target, Award 
} from 'lucide-react';

export default function SummaryDashboard({ summary, onExportPDF, onExportMarkdown }) {
  const [actionItems, setActionItems] = useState(summary?.actionItems || []);
  const [copied, setCopied] = useState(false);

  const toggleTask = (id) => {
    setActionItems(items => items.map(item => 
      item.id === id 
        ? { ...item, status: item.status === 'Completed' ? 'Pending' : 'Completed' } 
        : item
    ));
  };

  const handleCopySummary = () => {
    const text = `📌 TÓM TẮT CUỘC HỌP
${summary?.executiveSummary}

🎯 CHỦ ĐỀ THẢO LUẬN:
${summary?.agenda?.map(a => `- ${a}`).join('\n')}

💡 QUYẾT ĐỊNH CHÍNH:
${summary?.decisions?.map(d => `- ${d}`).join('\n')}

✅ DANH SÁCH VIỆC CẦN LÀM (ACTION ITEMS):
${actionItems.map(a => `[${a.status === 'Completed' ? 'x' : ' '}] ${a.task} - Người làm: ${a.assignee} (Hạn: ${a.dueDate})`).join('\n')}`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      {/* Top Action Bar & Export Header */}
      <div className="glass-panel" style={{ padding: '1rem 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(99, 102, 241, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <FileText size={20} color="#818cf8" />
          </div>
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Biên bản Cuộc họp & Báo cáo Tóm tắt</h3>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Tự động phân tích bởi AI chuẩn NotebookLM</p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <button className="btn-secondary" onClick={handleCopySummary}>
            <Copy size={15} />
            {copied ? 'Đã sao chép!' : 'Sao chép văn bản'}
          </button>
          <button className="btn-secondary" onClick={onExportMarkdown}>
            <Download size={15} />
            Xuất Markdown
          </button>
          <button className="btn-primary" onClick={onExportPDF}>
            <Share2 size={15} />
            Tải PDF Báo cáo
          </button>
        </div>
      </div>

      {/* Executive Summary Card */}
      <div className="glass-panel" style={{ padding: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
          <Sparkles size={20} color="var(--accent-cyan)" />
          <h4 style={{ fontSize: '1.1rem', color: '#38bdf8' }}>Tóm tắt Tổng quan (Executive Brief)</h4>
        </div>
        <p style={{ fontSize: '0.98rem', lineHeight: 1.6, color: 'var(--text-main)' }}>
          {summary?.executiveSummary || 'Chưa có thông tin tóm tắt.'}
        </p>
      </div>

      {/* Grid: Agenda & Decisions */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '1.5rem' }}>
        
        {/* Discussion Agenda */}
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
            <Target size={18} color="#c084fc" />
            <h4 style={{ fontSize: '1rem', color: '#c084fc' }}>Chủ đề Thảo luận (Agenda)</h4>
          </div>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
            {summary?.agenda?.map((item, idx) => (
              <li key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem', fontSize: '0.9rem', color: 'var(--text-main)' }}>
                <span style={{ minWidth: '22px', height: '22px', borderRadius: '50%', background: 'rgba(192, 132, 252, 0.15)', color: '#c084fc', fontSize: '0.75rem', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {idx + 1}
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Key Decisions */}
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
            <Award size={18} color="#34d399" />
            <h4 style={{ fontSize: '1rem', color: '#34d399' }}>Quyết định Quan trọng đã Chốt</h4>
          </div>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
            {summary?.decisions?.map((item, idx) => (
              <li key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem', fontSize: '0.9rem', color: 'var(--text-main)' }}>
                <CheckCircle2 size={16} color="#34d399" style={{ marginTop: '2px', minWidth: '16px' }} />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

      </div>

      {/* Action Items Table */}
      <div className="glass-panel" style={{ padding: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <ListTodo size={20} color="var(--accent-amber)" />
            <h4 style={{ fontSize: '1.1rem', color: '#fbbf24' }}>Danh sách Việc cần làm (Action Items)</h4>
          </div>
          <span className="badge badge-amber">{actionItems.length} công việc</span>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-light)', color: 'var(--text-muted)' }}>
                <th style={{ padding: '0.75rem', width: '40px' }}>Trạng thái</th>
                <th style={{ padding: '0.75rem' }}>Nhiệm vụ</th>
                <th style={{ padding: '0.75rem' }}>Người phụ trách</th>
                <th style={{ padding: '0.75rem' }}>Độ ưu tiên</th>
                <th style={{ padding: '0.75rem' }}>Thời hạn (Due Date)</th>
              </tr>
            </thead>
            <tbody>
              {actionItems.map((item) => (
                <tr 
                  key={item.id} 
                  style={{ 
                    borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                    opacity: item.status === 'Completed' ? 0.6 : 1,
                    textDecoration: item.status === 'Completed' ? 'line-through' : 'none'
                  }}
                >
                  <td style={{ padding: '0.75rem' }}>
                    <input
                      type="checkbox"
                      checked={item.status === 'Completed'}
                      onChange={() => toggleTask(item.id)}
                      style={{ width: '18px', height: '18px', cursor: 'pointer', accentColor: 'var(--accent-emerald)' }}
                    />
                  </td>
                  <td style={{ padding: '0.75rem', fontWeight: 500, color: 'var(--text-main)' }}>
                    {item.task}
                  </td>
                  <td style={{ padding: '0.75rem' }}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', background: 'rgba(255, 255, 255, 0.08)', padding: '0.2rem 0.55rem', borderRadius: 'var(--radius-sm)', fontSize: '0.8rem' }}>
                      <User size={12} color="#a5b4fc" />
                      {item.assignee}
                    </span>
                  </td>
                  <td style={{ padding: '0.75rem' }}>
                    <span className={`badge ${item.priority === 'Cao' ? 'badge-rose' : item.priority === 'Trung bình' ? 'badge-amber' : 'badge-indigo'}`}>
                      {item.priority}
                    </span>
                  </td>
                  <td style={{ padding: '0.75rem', color: 'var(--text-muted)' }}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.82rem' }}>
                      <Calendar size={13} />
                      {item.dueDate}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
