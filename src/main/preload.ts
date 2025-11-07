import { contextBridge, ipcRenderer } from 'electron';

// Electron API를 렌더러 프로세스에 안전하게 노출
contextBridge.exposeInMainWorld('electronAPI', {
  // 폴더 관련
  selectFolder: () => ipcRenderer.invoke('select-folder'),
  openFolder: (path: string) => ipcRenderer.invoke('open-folder', path),
  getDefaultPath: () => ipcRenderer.invoke('get-default-path'),

  // FFmpeg 관련
  checkFFmpeg: () => ipcRenderer.invoke('check-ffmpeg'),

  // 다운로드 관련
  startDownload: (urls: string[], quality: string, outputPath: string) => 
    ipcRenderer.invoke('start-download', urls, quality, outputPath),
  stopDownload: () => ipcRenderer.invoke('stop-download'),
  getDownloadStatus: () => ipcRenderer.invoke('get-download-status'),

  // yt-dlp 업데이트 관련
  updateYtDlp: () => ipcRenderer.invoke('update-yt-dlp'),
  openYtDlpReleases: () => ipcRenderer.invoke('open-yt-dlp-releases'),

  // 이벤트 리스너
  onDownloadStarted: (callback: (data: any) => void) => {
    ipcRenderer.on('download-started', (_, data) => callback(data));
  },
  onDownloadProgress: (callback: (data: any) => void) => {
    ipcRenderer.on('download-progress', (_, data) => callback(data));
  },
  onDownloadCompleted: (callback: (data: any) => void) => {
    ipcRenderer.on('download-completed', (_, data) => callback(data));
  },
  onAllDownloadsCompleted: (callback: (data: any) => void) => {
    ipcRenderer.on('all-downloads-completed', (_, data) => callback(data));
  },
  onDownloadLog: (callback: (message: string) => void) => {
    ipcRenderer.on('download-log', (_, message) => callback(message));
  },

  // 이벤트 리스너 제거
  removeAllListeners: (channel: string) => {
    ipcRenderer.removeAllListeners(channel);
  }
});

// TypeScript 타입 정의
export interface ElectronAPI {
  selectFolder: () => Promise<string | null>;
  openFolder: (path: string) => Promise<boolean>;
  getDefaultPath: () => Promise<string>;
  checkFFmpeg: () => Promise<boolean>;
  startDownload: (urls: string[], quality: string, outputPath: string) => Promise<{
    success: boolean;
    error?: string;
    successCount?: number;
    failCount?: number;
  }>;
  stopDownload: () => Promise<boolean>;
  getDownloadStatus: () => Promise<boolean>;
  updateYtDlp: () => Promise<{
    success: boolean;
    error?: string;
    message?: string;
    updated?: boolean;
  }>;
  openYtDlpReleases: () => Promise<{ success: boolean; error?: string }>;
  onDownloadStarted: (callback: (data: any) => void) => void;
  onDownloadProgress: (callback: (data: any) => void) => void;
  onDownloadCompleted: (callback: (data: any) => void) => void;
  onAllDownloadsCompleted: (callback: (data: any) => void) => void;
  onDownloadLog: (callback: (message: string) => void) => void;
  removeAllListeners: (channel: string) => void;
}

declare global {
  interface Window {
    electronAPI: ElectronAPI;
  }
}