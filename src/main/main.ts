import { app, BrowserWindow, ipcMain, dialog, shell, Notification } from 'electron';
import * as path from 'path';
import { spawn, ChildProcess } from 'child_process';
import * as fs from 'fs';
import * as os from 'os';

// 개발 환경 확인
const isDev = process.env.NODE_ENV === 'development';

// 메인 윈도우 참조
let mainWindow: BrowserWindow | null = null;

// 다운로드 프로세스 관리
let downloadProcess: ChildProcess | null = null;
let isDownloading = false;

function createWindow(): void {
  // 메인 윈도우 생성
  mainWindow = new BrowserWindow({
    width: 900,
    height: 700,
    minWidth: 800,
    minHeight: 600,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    },
    icon: path.join(__dirname, '../../assets/icon.png'),
    show: false,
    titleBarStyle: 'default'
  });

  // 개발 환경에서는 개발 서버 로드, 프로덕션에서는 빌드된 파일 로드
  if (isDev) {
    mainWindow.loadURL('http://localhost:3000');
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path.join(__dirname, 'index.html'));
  }

  // 윈도우가 준비되면 표시
  mainWindow.once('ready-to-show', () => {
    mainWindow?.show();
  });

  // 윈도우가 닫힐 때
  mainWindow.on('closed', () => {
    mainWindow = null;
    // 다운로드 프로세스가 실행 중이면 종료
    if (downloadProcess) {
      downloadProcess.kill();
    }
  });
}

// 앱이 준비되면 윈도우 생성
app.whenReady().then(createWindow);

// 모든 윈도우가 닫히면 앱 종료 (macOS 제외)
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// macOS에서 독 아이콘 클릭 시 윈도우 재생성
app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// IPC 핸들러들

// 폴더 선택 다이얼로그
ipcMain.handle('select-folder', async () => {
  if (!mainWindow) return null;
  
  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ['openDirectory'],
    title: '다운로드 폴더 선택'
  });
  
  return result.canceled ? null : result.filePaths[0];
});

// 폴더 열기
ipcMain.handle('open-folder', async (_, folderPath: string) => {
  try {
    await shell.openPath(folderPath);
    return true;
  } catch (error) {
    console.error('폴더 열기 오류:', error);
    return false;
  }
});

// FFmpeg 상태 확인
ipcMain.handle('check-ffmpeg', async () => {
  return new Promise((resolve) => {
    const ffmpeg = spawn('ffmpeg', ['-version'], {
      windowsHide: true // Windows에서 콘솔 창 숨기기
    });
    
    let hasOutput = false;
    
    ffmpeg.stdout?.on('data', () => {
      hasOutput = true;
    });
    
    ffmpeg.on('error', (error) => {
      // FFmpeg가 PATH에 없거나 실행할 수 없는 경우
      resolve(false);
    });
    
    ffmpeg.on('close', (code) => {
      // 정상 종료되고 출력이 있었다면 FFmpeg가 설치된 것
      resolve(code === 0 && hasOutput);
    });
    
    // 5초 타임아웃
    setTimeout(() => {
      ffmpeg.kill();
      resolve(false);
    }, 5000);
  });
});

// yt-dlp 경로 찾기
function getYtDlpPath(): string {
  if (isDev) {
    return 'yt-dlp.exe'; // 개발 환경에서는 현재 디렉토리
  } else {
    // 프로덕션 환경에서는 리소스 폴더
    return path.join(process.resourcesPath, 'bin', 'yt-dlp.exe');
  }
}

// 다운로드 시작
ipcMain.handle('start-download', async (_, urls: string[], quality: string, outputPath: string) => {
  if (isDownloading) {
    return { success: false, error: '이미 다운로드가 진행 중입니다.' };
  }

  try {
    isDownloading = true;
    const ytDlpPath = getYtDlpPath();
    
    // yt-dlp 존재 확인
    if (!fs.existsSync(ytDlpPath)) {
      throw new Error('yt-dlp.exe를 찾을 수 없습니다.');
    }

    // 출력 폴더 생성
    if (!fs.existsSync(outputPath)) {
      fs.mkdirSync(outputPath, { recursive: true });
    }

    // 다운로드 시작 알림
    if (mainWindow) {
      mainWindow.webContents.send('download-started', { totalCount: urls.length });
    }

    let successCount = 0;
    let failCount = 0;

    // 각 URL을 순차적으로 다운로드
    for (let i = 0; i < urls.length; i++) {
      const url = urls[i];
      
      if (mainWindow) {
        mainWindow.webContents.send('download-progress', {
          currentIndex: i,
          totalCount: urls.length,
          currentUrl: url,
          status: 'starting'
        });
      }

      const success = await downloadSingleVideo(url, quality, outputPath, i + 1, urls.length);
      
      if (success) {
        successCount++;
        if (mainWindow) {
          mainWindow.webContents.send('download-completed', { url, success: true });
        }
      } else {
        failCount++;
        if (mainWindow) {
          mainWindow.webContents.send('download-completed', { url, success: false });
        }
      }
    }

    // 완료 알림
    if (mainWindow) {
      mainWindow.webContents.send('all-downloads-completed', {
        successCount,
        failCount,
        totalCount: urls.length
      });
    }

    // 시스템 알림
    if (Notification.isSupported()) {
      new Notification({
        title: 'YouTube Downloader',
        body: `다운로드 완료! 성공: ${successCount}개, 실패: ${failCount}개`
      }).show();
    }

    isDownloading = false;
    return { success: true, successCount, failCount };

  } catch (error) {
    isDownloading = false;
    return { success: false, error: error instanceof Error ? error.message : '알 수 없는 오류' };
  }
});

// 단일 비디오 다운로드
function downloadSingleVideo(url: string, quality: string, outputPath: string, current: number, total: number): Promise<boolean> {
  return new Promise((resolve) => {
    const ytDlpPath = getYtDlpPath();
    
    const args = [
      '--progress',
      '--progress-template', '%(progress.percentage)s;%(progress.speed)s;%(progress.eta)s',
      '-o', path.join(outputPath, '%(uploader)s - %(title)s.%(ext)s'),
      '--no-warnings',
      '--encoding', 'utf-8',
      '--no-check-certificate'
    ];

    // 품질 설정
    if (quality === 'bestaudio/best') {
      args.push('-x', '--audio-format', 'mp3', '--audio-quality', '192');
    } else {
      args.push('-f', quality);
    }

    args.push(url);

    downloadProcess = spawn(ytDlpPath, args);

    downloadProcess.stdout?.on('data', (data) => {
      const output = data.toString();
      
      if (output.includes('%')) {
        try {
          const parts = output.trim().split(';');
          if (parts.length >= 1) {
            const percentage = parseFloat(parts[0].replace('%', ''));
            const speed = parts[1] || '';
            const eta = parts[2] || '';

            if (mainWindow) {
              mainWindow.webContents.send('download-progress', {
                currentIndex: current - 1,
                totalCount: total,
                currentUrl: url,
                status: 'downloading',
                percentage,
                speed,
                eta
              });
            }
          }
        } catch (error) {
          // 파싱 오류 무시
        }
      }
      
      if (mainWindow) {
        mainWindow.webContents.send('download-log', output);
      }
    });

    downloadProcess.stderr?.on('data', (data) => {
      if (mainWindow) {
        mainWindow.webContents.send('download-log', `[오류] ${data.toString()}`);
      }
    });

    downloadProcess.on('close', (code) => {
      downloadProcess = null;
      resolve(code === 0);
    });

    downloadProcess.on('error', (error) => {
      if (mainWindow) {
        mainWindow.webContents.send('download-log', `[오류] ${error.message}`);
      }
      downloadProcess = null;
      resolve(false);
    });
  });
}

// 다운로드 중단
ipcMain.handle('stop-download', async () => {
  if (downloadProcess) {
    downloadProcess.kill();
    downloadProcess = null;
  }
  isDownloading = false;
  return true;
});

// 다운로드 상태 확인
ipcMain.handle('get-download-status', async () => {
  return isDownloading;
});

// 기본 다운로드 경로 가져오기
ipcMain.handle('get-default-path', async () => {
  return path.join(os.homedir(), 'Downloads', 'YouTube');
});