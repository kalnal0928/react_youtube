import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Divider,
  Alert,
  IconButton
} from '@mui/material';
import {
  Close as CloseIcon,
  Launch as LaunchIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';

interface FFmpegHelpDialogProps {
  open: boolean;
  onClose: () => void;
  onRefreshStatus: () => void;
}

const FFmpegHelpDialog: React.FC<FFmpegHelpDialogProps> = ({
  open,
  onClose,
  onRefreshStatus
}) => {
  const handleOpenFFmpegSite = () => {
    window.open('https://ffmpeg.org/download.html', '_blank');
  };

  const handleOpenGyanSite = () => {
    window.open('https://www.gyan.dev/ffmpeg/builds/', '_blank');
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: { borderRadius: 2 }
      }}
    >
      <DialogTitle sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        pb: 1
      }}>
        <Typography variant="h6" fontWeight="bold">
          🎬 FFmpeg 설치 안내
        </Typography>
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ py: 2 }}>
        {/* 소개 */}
        <Alert severity="info" sx={{ mb: 3 }}>
          <Typography variant="body2">
            <strong>FFmpeg</strong>는 비디오와 오디오를 처리하는 강력한 오픈소스 프로그램입니다.<br />
            고품질 영상/음성 병합이나 음성 추출(MP3 변환)을 위해 필요합니다.
          </Typography>
        </Alert>

        {/* 설치 방법 */}
        <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
          🔹 Windows 설치 방법
        </Typography>

        <Box sx={{ mb: 3 }}>
          {/* 방법 1: winget */}
          <Box sx={{ mb: 2, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
            <Typography variant="subtitle2" fontWeight="bold" color="primary" sx={{ mb: 1 }}>
              방법 1: winget (권장) - Windows 10/11 내장
            </Typography>
            <Typography variant="body2" sx={{ mb: 1 }}>
              1. Windows PowerShell 또는 명령 프롬프트를 <strong>관리자 권한</strong>으로 실행
            </Typography>
            <Typography variant="body2" sx={{ mb: 1 }}>
              2. 다음 명령어 입력 후 실행:
            </Typography>
            <Box sx={{ 
              bgcolor: 'black', 
              color: 'white', 
              p: 1, 
              borderRadius: 1, 
              fontFamily: 'monospace',
              fontSize: '0.9rem'
            }}>
              winget install FFmpeg
            </Box>
          </Box>

          {/* 방법 2: Chocolatey */}
          <Box sx={{ mb: 2, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
            <Typography variant="subtitle2" fontWeight="bold" color="primary" sx={{ mb: 1 }}>
              방법 2: Chocolatey (패키지 관리자)
            </Typography>
            <Typography variant="body2" sx={{ mb: 1 }}>
              Chocolatey가 설치되어 있다면 다음 명령어 실행:
            </Typography>
            <Box sx={{ 
              bgcolor: 'black', 
              color: 'white', 
              p: 1, 
              borderRadius: 1, 
              fontFamily: 'monospace',
              fontSize: '0.9rem'
            }}>
              choco install ffmpeg
            </Box>
          </Box>

          {/* 방법 3: 수동 설치 */}
          <Box sx={{ mb: 2, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
            <Typography variant="subtitle2" fontWeight="bold" color="primary" sx={{ mb: 1 }}>
              방법 3: 수동 설치
            </Typography>
            <Typography variant="body2" sx={{ mb: 1 }}>
              1. FFmpeg 공식 사이트 방문 또는 Gyan 빌드 다운로드
            </Typography>
            <Typography variant="body2" sx={{ mb: 1 }}>
              2. Windows용 빌드 다운로드 및 압축 해제
            </Typography>
            <Typography variant="body2" sx={{ mb: 1 }}>
              3. bin 폴더를 시스템 환경 변수 'Path'에 추가
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
              <Button
                size="small"
                variant="outlined"
                startIcon={<LaunchIcon />}
                onClick={handleOpenFFmpegSite}
              >
                FFmpeg 공식 사이트
              </Button>
              <Button
                size="small"
                variant="outlined"
                startIcon={<LaunchIcon />}
                onClick={handleOpenGyanSite}
              >
                Gyan 빌드 (권장)
              </Button>
            </Box>
          </Box>
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* 설치 확인 */}
        <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
          🔹 설치 확인
        </Typography>
        <Typography variant="body2" sx={{ mb: 1 }}>
          명령 프롬프트에서 다음 명령어를 실행하여 확인:
        </Typography>
        <Box sx={{ 
          bgcolor: 'black', 
          color: 'white', 
          p: 1, 
          borderRadius: 1, 
          fontFamily: 'monospace',
          fontSize: '0.9rem',
          mb: 2
        }}>
          ffmpeg -version
        </Box>
        <Typography variant="body2" color="text.secondary">
          버전 정보가 표시되면 설치 성공입니다.
        </Typography>

        <Divider sx={{ my: 2 }} />

        {/* 기능 안내 */}
        <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
          🔹 기능 안내
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
          <Box sx={{ flex: 1 }}>
            <Typography variant="subtitle2" fontWeight="bold" color="success.main" sx={{ mb: 1 }}>
              ✅ FFmpeg 없이 사용 가능
            </Typography>
            <Typography variant="body2" color="text.secondary">
              • 최고 품질 (단일 파일)<br />
              • 720p HD<br />
              • 480p
            </Typography>
          </Box>
          <Box sx={{ flex: 1 }}>
            <Typography variant="subtitle2" fontWeight="bold" color="warning.main" sx={{ mb: 1 }}>
              ⚠️ FFmpeg 필요
            </Typography>
            <Typography variant="body2" color="text.secondary">
              • 최고 품질 (병합)<br />
              • 음성만 추출 (MP3)
            </Typography>
          </Box>
        </Box>

        <Alert severity="warning" sx={{ mt: 2 }}>
          <Typography variant="body2">
            <strong>중요:</strong> FFmpeg 설치 후에는 프로그램을 재시작해야 적용됩니다.
          </Typography>
        </Alert>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button
          variant="outlined"
          startIcon={<RefreshIcon />}
          onClick={onRefreshStatus}
        >
          설치 상태 새로고침
        </Button>
        <Button
          variant="contained"
          onClick={onClose}
        >
          닫기
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default FFmpegHelpDialog;