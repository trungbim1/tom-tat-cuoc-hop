import React from 'react';
import { X, FileText, Download, Copy, Printer, CheckCircle2 } from 'lucide-react';
import { jsPDF } from 'jspdf';

export default function ExportModal({ isOpen, onClose, meetingData, summary }) {
  if (!isOpen || !meetingData) return null;

  const generateMarkdown = () => {
    const transcriptText = meetingData.transcript?.map(t => `[${t.timestamp}] ${t.speaker}: ${t.text}`).join('\n');
    return `# 🎙️ ${meetingData.title}
**Ngày:** ${meetingData.date} | **Thời lượng:** ${meetingData.duration}

---

## 📌 Tóm tắt Tổng quan
${summary?.executiveSummary || ''}

## 🎯 Chủ đề Thảo luận (Agenda)
${summary?.agenda?.map(a => `- ${a}`).join('\n')}

## 💡 Quyết định Quan trọng
${summary?.decisions?.map(d => `- ${d}`).join('\n')}

## ✅ Danh sách Việc cần làm (Action Items)
${summary?.actionItems?.map(a => `- [${a.status === 'Completed' ? 'x' : ' '}] **${a.task}** | Người làm: ${a.assignee} | Hạn: ${a.dueDate}`).join('\n')}

---

## 📝 Chi tiết Nguồn Thoại (Transcript)
${transcriptText}
`;
  };

  const handleDownloadMarkdown = () => {
    const content = generateMarkdown();
    const blob = new Blob([content], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Bien_ban_cuoc_hop_${meetingData.id}.md`;
    link.click();
  };

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text(meetingData.title || 'Bien ban cuoc hop', 14, 20);
    
    doc.setFontSize(10);
    doc.text(`Ngay: ${meetingData.date || ''} | Thoi luong: ${meetingData.duration || ''}`, 14, 28);
    
    doc.setFontSize(12);
    doc.text('Tom tat Tong quan:', 14, 38);
    doc.setFontSize(10);
    const splitText = doc.splitTextToSize(summary?.executiveSummary || 'No summary available', 180);
    doc.text(splitText, 14, 46);

    doc.save(`Bien_ban_cuoc_hop_${meetingData.id}.pdf`);
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(0, 0, 0, 0.75)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '1rem'
    }}>
      <div className="glass-panel" style={{ width: '100%', maxWidth: '650px', padding: '2rem', borderRadius: '20px', position: 'relative' }}>
        
        <button onClick={onClose} className="btn-ghost" style={{ position: 'absolute', top: '1.25rem', right: '1.25rem', padding: '0.4rem' }}>
          <X size={20} />
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'rgba(99, 102, 241, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <FileText size={24} color="#818cf8" />
          </div>
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Xuất Báo cáo & Biên bản Cuộc họp</h2>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Lựa chọn định dạng xuất file mong muốn</p>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
          
          <div 
            onClick={handleDownloadMarkdown}
            style={{ padding: '1.2rem', borderRadius: '14px', border: '1px solid var(--border-light)', background: 'rgba(255, 255, 255, 0.03)', cursor: 'pointer' }}
            className="glass-panel-interactive"
          >
            <Download size={24} color="#38bdf8" style={{ marginBottom: '0.5rem' }} />
            <h4 style={{ fontSize: '1rem', color: '#fff' }}>Xuất Markdown (.md)</h4>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>Thích hợp lưu vào Notion, Obsidian hoặc GitHub</p>
          </div>

          <div 
            onClick={handleDownloadPDF}
            style={{ padding: '1.2rem', borderRadius: '14px', border: '1px solid var(--border-light)', background: 'rgba(255, 255, 255, 0.03)', cursor: 'pointer' }}
            className="glass-panel-interactive"
          >
            <FileText size={24} color="#a5b4fc" style={{ marginBottom: '0.5rem' }} />
            <h4 style={{ fontSize: '1rem', color: '#fff' }}>Xuất Báo cáo PDF</h4>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>Định dạng tài liệu chính thức gửi cho đối tác/sếp</p>
          </div>

        </div>

      </div>
    </div>
  );
}
