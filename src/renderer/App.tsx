import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Alert,
  Snackbar
} from '@mui/material';
import { motion } from 'framer-motion';

// 컴포넌트 임포트
import Header from './components/Header';
import URLInputSection from './components/URLInputSection';
import SettingsSection from './components/SettingsSection';
import ProgressSection from './components/ProgressSection';
import LogSection from './components/LogSection';

// 타입 정의
interface DownloadProgress {
  currentIndex: number;
  totalCount: number;
  currentUrl: string;
  status: 'starting' | 'downloading' | 'completed' | 'failed';
  percentage?: number;
  speed?: string;
  eta?: string;
}

interface AppState {
  urls: string[];
  quality: string;
  outputPath: string;
  isDownloading: boolean;
  ffmpegInstalled: boolean;
  downloadProgress: DownloadProgress | null;
  logs: string[];
  showLogs: boolean;
  notification: {
    open: boolean;
    message: string;
    severity: 'success' | 'error' | 'warning' | 'info';
  };
}

const App: React.FC = () => {
  const [state, setState] = useState<AppState>({
    urls: [],
    quality: 'bestvideo[ext=mp4]+bestaudio[ext=m4a]/best[ext=mp4]/best', // 최고 품질 병합 (FFmpeg 필요)
    outputPath: '',
    isDownloading: false,
    ffmpegInstalled: false,
    downloadProgress: null,
    logs: [],
    showLogs: false, // 기본값을 로그 숨기기로 변경
    notification: {
      open: false,
      message: '',
      severity: 'info'
    }
  });

  // 초기화
  useEffect(() => {
    initializeApp();
    setupEventListeners();
    
    return () => {
      // 이벤트 리스너 정리
      window.electronAPI.removeAllListeners('download-started');
      window.electronAPI.removeAllListeners('download-progress');
      window.electronAPI.removeAllListeners('download-completed');
      window.electronAPI.removeAllListeners('all-downloads-completed');
      window.electronAPI.removeAllListeners('download-log');
    };
  }, []);

  const initializeApp = async () => {
    try {
      // 기본 다운로드 경로 설정
      const defaultPath = await window.electronAPI.getDefaultPath();
      
      // FFmpeg 상태 확인
      const ffmpegStatus = await window.electronAPI.checkFFmpeg();
      
      setState(prev => ({
        ...prev,
        outputPath: defaultPath,
        ffmpegInstalled: ffmpegStatus
      }));

      addLog('🚀 YouTube Downloader 준비 완료!');
      addLog('� 최대 10개의 DYouTube URL을 입력하고 다운로드 버튼을 클릭하세요.');
      
      if (!ffmpegStatus) {
        addLog('⚠️ FFmpeg가 설치되지 않았습니다. 일부 기능이 제한됩니다.');
      }
      // yt-dlp 자동 업데이트 체크 (백그라운드)
      checkYtDlpUpdate();
    } catch (error) {
      console.error('앱 초기화 오류:', error);
      showNotification('앱 초기화 중 오류가 발생했습니다.', 'error');
    }
  };

  const checkYtDlpUpdate = async () => {
    try {
      addLog('🔄 yt-dlp.exe 업데이트를 확인합니다...');
      const result = await window.electronAPI.updateYtDlp();
      
      if (result.success) {
        if (result.updated) {
          addLog('✨ yt-dlp.exe가 성공적으로 업데이트되었습니다!');
          showNotification('yt-dlp.exe가 최신 버전으로 업데이트되었습니다.', 'success');
        } else {
          addLog('✅ yt-dlp.exe가 이미 최신 버전입니다.');
        }
      } else {
        addLog(`⚠️ yt-dlp 업데이트 확인 실패: ${result.error}`);
      }
    } catch (error) {
      addLog('⚠️ yt-dlp 업데이트 확인 중 오류가 발생했습니다.');
    }
  };

  const handleRefreshFFmpegStatus = async () => {
    try {
      addLog('🔄 FFmpeg 설치 상태를 확인합니다...');
      const ffmpegStatus = await window.electronAPI.checkFFmpeg();
      
      setState(prev => ({
        ...prev,
        ffmpegInstalled: ffmpegStatus
      }));

      if (ffmpegStatus) {
        addLog('✅ FFmpeg가 설치되어 있습니다.');
        showNotification('FFmpeg가 정상적으로 설치되어 있습니다.', 'success');
      } else {
        addLog('❌ FFmpeg가 설치되지 않았습니다.');
        showNotification('FFmpeg가 설치되지 않았습니다. 설치 후 다시 확인해주세요.', 'warning');
      }
    } catch (error) {
      addLog('⚠️ FFmpeg 상태 확인 중 오류가 발생했습니다.');
      showNotification('FFmpeg 상태 확인 중 오류가 발생했습니다.', 'error');
    }
  };

  const setupEventListeners = () => {
    // 다운로드 시작 이벤트
    window.electronAPI.onDownloadStarted((data) => {
      setState(prev => ({
        ...prev,
        isDownloading: true
      }));
      addLog(`📋 총 ${data.totalCount}개의 URL 다운로드를 시작합니다.`);
    });

    // 다운로드 진행률 이벤트
    window.electronAPI.onDownloadProgress((data: DownloadProgress) => {
      setState(prev => ({
        ...prev,
        downloadProgress: data
      }));
      
      if (data.status === 'starting') {
        addLog(`📥 [${data.currentIndex + 1}/${data.totalCount}] 다운로드 시작: ${data.currentUrl}`);
      }
    });

    // 개별 다운로드 완료 이벤트
    window.electronAPI.onDownloadCompleted((data) => {
      if (data.success) {
        addLog(`✅ 다운로드 성공: ${data.url}`);
        // 성공한 URL을 목록에서 제거
        setState(prev => ({
          ...prev,
          urls: prev.urls.filter(url => url !== data.url)
        }));
      } else {
        addLog(`❌ 다운로드 실패: ${data.url}`);
      }
    });

    // 전체 다운로드 완료 이벤트
    window.electronAPI.onAllDownloadsCompleted((data) => {
      setState(prev => ({
        ...prev,
        isDownloading: false,
        downloadProgress: null
      }));
      
      addLog(`🎉 모든 다운로드 완료! 성공: ${data.successCount}개, 실패: ${data.failCount}개`);
      
      if (data.failCount === 0) {
        showNotification(`모든 비디오 다운로드가 완료되었습니다! (${data.successCount}개)`, 'success');
      } else {
        showNotification(`다운로드 완료. 성공: ${data.successCount}개, 실패: ${data.failCount}개`, 'warning');
      }
    });

    // 로그 이벤트
    window.electronAPI.onDownloadLog((message) => {
      addLog(`[yt-dlp] ${message}`);
    });
  };

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setState(prev => ({
      ...prev,
      logs: [...prev.logs, `[${timestamp}] ${message}`]
    }));
  };

  const showNotification = (message: string, severity: 'success' | 'error' | 'warning' | 'info') => {
    setState(prev => ({
      ...prev,
      notification: {
        open: true,
        message,
        severity
      }
    }));
  };

  const handleCloseNotification = () => {
    setState(prev => ({
      ...prev,
      notification: { ...prev.notification, open: false }
    }));
  };

  const handleURLsChange = (urls: string[]) => {
    setState(prev => ({ ...prev, urls }));
  };

  const handleAddToQueue = async (newUrls: string[]) => {
    // 다운로드 중일 때 새로운 URL을 기존 목록에 추가
    setState(prev => ({
      ...prev,
      urls: [...prev.urls, ...newUrls]
    }));
    
    // 로그에 추가된 URL 표시
    newUrls.forEach(url => {
      addLog(`🔄 다운로드 큐에 추가됨: ${url}`);
    });
    
    // 백엔드에 다운로드 요청 전송 (큐에 추가)
    try {
      const result = await window.electronAPI.startDownload(newUrls, state.quality, state.outputPath);
      
      if (result.success) {
        showNotification(`${newUrls.length}개의 URL이 다운로드 큐에 추가되었습니다.`, 'success');
      } else {
        showNotification(result.error || '큐 추가 중 오류가 발생했습니다.', 'error');
      }
    } catch (error) {
      console.error('큐 추가 오류:', error);
      showNotification('큐 추가 중 오류가 발생했습니다.', 'error');
    }
  };

  const handleQualityChange = (quality: string) => {
    setState(prev => ({ ...prev, quality }));
  };

  const handlePathChange = (path: string) => {
    setState(prev => ({ ...prev, outputPath: path }));
  };

  const handleStartDownload = async () => {
    if (state.urls.length === 0) {
      showNotification('먼저 YouTube URL을 입력해주세요.', 'warning');
      return;
    }

    if (state.urls.length > 10) {
      showNotification(`최대 10개의 URL만 입력할 수 있습니다. (현재: ${state.urls.length}개)`, 'error');
      return;
    }

    // FFmpeg 필요한 품질 옵션 확인
    const needsFFmpeg = state.quality.includes('bestvideo') || state.quality === 'bestaudio/best';
    if (needsFFmpeg && !state.ffmpegInstalled) {
      showNotification('선택한 품질 옵션은 FFmpeg가 필요합니다. FFmpeg를 설치해주세요.', 'warning');
    }

    try {
      const result = await window.electronAPI.startDownload(state.urls, state.quality, state.outputPath);
      
      if (!result.success) {
        showNotification(result.error || '다운로드 시작 중 오류가 발생했습니다.', 'error');
      }
    } catch (error) {
      console.error('다운로드 시작 오류:', error);
      showNotification('다운로드 시작 중 오류가 발생했습니다.', 'error');
    }
  };

  const handleStopDownload = async () => {
    try {
      await window.electronAPI.stopDownload();
      setState(prev => ({
        ...prev,
        isDownloading: false,
        downloadProgress: null
      }));
      addLog('🛑 다운로드가 중단되었습니다.');
      showNotification('다운로드가 중단되었습니다.', 'info');
    } catch (error) {
      console.error('다운로드 중단 오류:', error);
      showNotification('다운로드 중단 중 오류가 발생했습니다.', 'error');
    }
  };

  const handleClearLogs = () => {
    setState(prev => ({ ...prev, logs: [] }));
    addLog('🧹 로그가 지워졌습니다.');
  };

  const handleToggleLogs = () => {
    setState(prev => ({ ...prev, showLogs: !prev.showLogs }));
  };

  return (
    <Box sx={{ 
      height: '100vh', 
      display: 'flex', 
      flexDirection: 'column', 
      bgcolor: 'background.default'
    }}>
      <Container 
        maxWidth={false} 
        sx={{ 
          flex: 1, 
          display: 'flex', 
          flexDirection: 'column', 
          p: { xs: 1, sm: 2 },
          maxWidth: '100%',
          overflow: 'auto',
          minHeight: 0
        }}
      >
        {/* 헤더 */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Header 
            ffmpegInstalled={state.ffmpegInstalled} 
            onRefreshFFmpegStatus={handleRefreshFFmpegStatus}
          />
        </motion.div>

        {/* 메인 콘텐츠 */}
        <Box sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          gap: { xs: 1, sm: 2 }, 
          mt: { xs: 1, sm: 2 },
          flex: 1,
          minHeight: 0
        }}>
          {/* URL 입력 섹션 */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <URLInputSection
              urls={state.urls}
              onURLsChange={handleURLsChange}
              disabled={false} // 다운로드 중에도 URL 입력 가능
              isDownloading={state.isDownloading}
              onAddToQueue={handleAddToQueue}
              onStartDownload={handleStartDownload}
              onStopDownload={handleStopDownload}
              onToggleLogs={handleToggleLogs}
              onClearLogs={handleClearLogs}
              showLogs={state.showLogs}
              outputPath={state.outputPath}
            />
          </motion.div>

          {/* 설정 섹션 */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <SettingsSection
              quality={state.quality}
              outputPath={state.outputPath}
              onQualityChange={handleQualityChange}
              onPathChange={handlePathChange}
              disabled={state.isDownloading}
              ffmpegInstalled={state.ffmpegInstalled}
            />
          </motion.div>



          {/* 진행률 섹션 */}
          {(state.isDownloading || state.downloadProgress) && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <ProgressSection
                downloadProgress={state.downloadProgress}
                isDownloading={state.isDownloading}
              />
            </motion.div>
          )}

          {/* 로그 섹션 */}
          {state.showLogs && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              style={{ 
                flex: 1, 
                minHeight: '200px',
                display: 'flex',
                flexDirection: 'column'
              }}
            >
              <LogSection logs={state.logs} />
            </motion.div>
          )}
        </Box>
      </Container>

      {/* 알림 스낵바 */}
      <Snackbar
        open={state.notification.open}
        autoHideDuration={6000}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={handleCloseNotification}
          severity={state.notification.severity}
          sx={{ width: '100%' }}
        >
          {state.notification.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default App;