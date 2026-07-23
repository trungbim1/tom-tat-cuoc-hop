import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import FileUpload from './components/FileUpload';
import MediaPlayer from './components/MediaPlayer';
import TranscriptView from './components/TranscriptView';
import SummaryDashboard from './components/SummaryDashboard';
import NotebookChat from './components/NotebookChat';
import PrivacySettingsModal from './components/PrivacySettingsModal';
import SavedMeetingsModal from './components/SavedMeetingsModal';
import ExportModal from './components/ExportModal';

import { whisperService, DEMO_MEETING } from './services/whisperService';
import { aiSummarizerService } from './services/aiSummarizerService';
import { dbService } from './services/dbService';

import { FileText, MessageSquare, ListFilter, Sparkles, Shield, UploadCloud, RefreshCw } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function App() {
  const [meetingData, setMeetingData] = useState(null);
  const [summaryData, setSummaryData] = useState(null);
  const [mediaUrl, setMediaUrl] = useState(null);
  const [currentTime, setCurrentTime] = useState(0);

  const [activeTab, setActiveTab] = useState('summary'); // 'summary' | 'transcript' | 'chat'
  const [isProcessing, setIsProcessing] = useState(false);
  const [progressState, setProgressState] = useState(null);

  const [savedMeetings, setSavedMeetings] = useState([]);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isSavedOpen, setIsSavedOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);

  const [settings, setSettings] = useState(() => {
    return JSON.parse(localStorage.getItem('meetmind_settings') || '{"engine":"local","apiKey":""}');
  });

  // Load saved meetings list on mount
  useEffect(() => {
    loadSavedMeetings();
  }, []);

  const loadSavedMeetings = async () => {
    const list = await dbService.getAllMeetings();
    setSavedMeetings(list);
  };

  // Load Demo Meeting instantly
  const handleLoadDemo = async () => {
    setIsProcessing(true);
    setProgressState({ stage: 'Đang tải dữ liệu cuộc họp mẫu...', progress: 30 });
    await new Promise(r => setTimeout(r, 600));

    setProgressState({ stage: 'Phân tích danh sách công việc & mốc thời gian...', progress: 75 });
    await new Promise(r => setTimeout(r, 500));

    const summary = await aiSummarizerService.generateMeetingSummary(DEMO_MEETING, settings);

    setMeetingData(DEMO_MEETING);
    setSummaryData(summary);
    setMediaUrl('https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4'); // High speed sample video track
    setIsProcessing(false);
    setActiveTab('summary');

    await dbService.saveMeeting(DEMO_MEETING);
    loadSavedMeetings();
    triggerConfetti();
  };

  // Handle uploaded Audio/Video file
  const handleFileSelect = async (file) => {
    setIsProcessing(true);
    const objectUrl = URL.createObjectURL(file);
    setMediaUrl(objectUrl);

    try {
      const transcribed = await whisperService.transcribeFile(file, settings, (p) => setProgressState(p));
      const summary = await aiSummarizerService.generateMeetingSummary(transcribed, settings);

      setMeetingData(transcribed);
      setSummaryData(summary);
      setActiveTab('summary');

      await dbService.saveMeeting(transcribed);
      loadSavedMeetings();
      triggerConfetti();
    } catch (err) {
      alert('Đã xảy ra lỗi khi xử lý tệp: ' + err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const triggerConfetti = () => {
    try {
      confetti({ particleCount: 60, spread: 70, origin: { y: 0.6 } });
    } catch (e) {}
  };

  const handleSaveSettings = (newSettings) => {
    setSettings(newSettings);
    localStorage.setItem('meetmind_settings', JSON.stringify(newSettings));
  };

  const handleClearData = async () => {
    await dbService.clearAll();
    setSavedMeetings([]);
    setMeetingData(null);
    setSummaryData(null);
    setMediaUrl(null);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      
      {/* Header */}
      <Header
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenSaved={() => setIsSavedOpen(true)}
        savedCount={savedMeetings.length}
        settings={settings}
      />

      {/* Main Content Body */}
      <main style={{ flex: 1, maxWidth: '1400px', width: '100%', margin: '0 auto', padding: '0 1.5rem 3rem 1.5rem' }}>
        
        {!meetingData ? (
          /* File Uploader Landing State */
          <FileUpload
            onFileSelect={handleFileSelect}
            onLoadDemo={handleLoadDemo}
            isProcessing={isProcessing}
            progressState={progressState}
          />
        ) : (
          /* Meeting Workspace Dashboard */
          <div>
            
            {/* Top Workspace Navigation Bar */}
            <div className="glass-panel" style={{ padding: '0.85rem 1.25rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <h2 style={{ fontSize: '1.2rem', fontWeight: 800 }}>{meetingData.title}</h2>
                  {meetingData.isDemo && <span className="badge badge-amber">Demo</span>}
                </div>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  Ngày họp: {meetingData.date} | Thời lượng: {meetingData.duration} | Tệp: {meetingData.fileName}
                </p>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <button 
                  className="btn-secondary" 
                  onClick={() => { setMeetingData(null); setMediaUrl(null); }}
                  style={{ fontSize: '0.82rem' }}
                >
                  <UploadCloud size={16} />
                  Tải Cuộc họp Mới
                </button>
              </div>
            </div>

            {/* Media Player */}
            {mediaUrl && (
              <MediaPlayer
                mediaUrl={mediaUrl}
                fileType={meetingData.fileType}
                currentTime={currentTime}
                onSeek={(time) => setCurrentTime(time)}
              />
            )}

            {/* Navigation Tabs (Summary | Transcript | Grounded Q&A Chat) */}
            <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-light)', paddingBottom: '0.75rem' }}>
              <button
                onClick={() => setActiveTab('summary')}
                style={{
                  padding: '0.65rem 1.25rem',
                  borderRadius: 'var(--radius-sm)',
                  border: 'none',
                  background: activeTab === 'summary' ? 'var(--accent-primary)' : 'transparent',
                  color: activeTab === 'summary' ? '#fff' : 'var(--text-muted)',
                  fontWeight: 600,
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  transition: 'all 0.2s ease'
                }}
              >
                <FileText size={16} />
                Biên bản & Tóm tắt
              </button>

              <button
                onClick={() => setActiveTab('transcript')}
                style={{
                  padding: '0.65rem 1.25rem',
                  borderRadius: 'var(--radius-sm)',
                  border: 'none',
                  background: activeTab === 'transcript' ? 'var(--accent-primary)' : 'transparent',
                  color: activeTab === 'transcript' ? '#fff' : 'var(--text-muted)',
                  fontWeight: 600,
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  transition: 'all 0.2s ease'
                }}
              >
                <ListFilter size={16} />
                Nội dung Thoại (Transcript)
              </button>

              <button
                onClick={() => setActiveTab('chat')}
                style={{
                  padding: '0.65rem 1.25rem',
                  borderRadius: 'var(--radius-sm)',
                  border: 'none',
                  background: activeTab === 'chat' ? 'linear-gradient(135deg, #06b6d4, #6366f1)' : 'transparent',
                  color: activeTab === 'chat' ? '#fff' : 'var(--text-muted)',
                  fontWeight: 600,
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  transition: 'all 0.2s ease'
                }}
              >
                <Sparkles size={16} />
                Hỏi đáp NotebookLM
              </button>
            </div>

            {/* Tab Views */}
            {activeTab === 'summary' && (
              <SummaryDashboard
                summary={summaryData}
                onExportPDF={() => setIsExportOpen(true)}
                onExportMarkdown={() => setIsExportOpen(true)}
              />
            )}

            {activeTab === 'transcript' && (
              <TranscriptView
                transcript={meetingData.transcript}
                onTimestampClick={(secs) => setCurrentTime(secs)}
                onUpdateTranscript={(updated) => setMeetingData({ ...meetingData, transcript: updated })}
              />
            )}

            {activeTab === 'chat' && (
              <NotebookChat
                meetingData={meetingData}
                onTimestampClick={(secs) => setCurrentTime(secs)}
                settings={settings}
              />
            )}

          </div>
        )}

      </main>

      {/* Modals */}
      <PrivacySettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onSaveSettings={handleSaveSettings}
        onClearData={handleClearData}
      />

      <SavedMeetingsModal
        isOpen={isSavedOpen}
        onClose={() => setIsSavedOpen(false)}
        meetings={savedMeetings}
        onSelectMeeting={(m) => {
          setMeetingData(m);
          setSummaryData(aiSummarizerService.buildLocalSmartSummary(m));
          setActiveTab('summary');
        }}
        onDeleteMeeting={async (id) => {
          await dbService.deleteMeeting(id);
          loadSavedMeetings();
        }}
      />

      <ExportModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        meetingData={meetingData}
        summary={summaryData}
      />

    </div>
  );
}
