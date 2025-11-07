import React from 'react';
import {
  Box,
  Typography,
  Chip,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  YouTube as YouTubeIcon,
  CheckCircle as CheckIcon,
  Error as ErrorIcon,
  Help as HelpIcon
} from '@mui/icons-material';

interface HeaderProps {
  ffmpegInstalled: boolean;
}

const Header: React.FC<HeaderProps> = ({ ffmpegInstalled }) => {
  const handleFFmpegHelp = () => {
    // FFmpeg 도움말 다이얼로그 열기 (추후 구현)
    alert('FFmpeg 설치 도움말\n\n1. https://ffmpeg.org 에서 다운로드\n2. 시스템 PATH에 추가\n3. 프로그램 재시작');
  };

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        p: 2,
        bgcolor: 'background.paper',
        borderRadius: 2,
        boxShadow: 1
      }}
    >
      {/* 로고 및 제목 */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <YouTubeIcon sx={{ fontSize: 32, color: '#FF0000' }} />
        <Box>
          <Typography variant="h5" component="h1" fontWeight="bold">
            YouTube Downloader
          </Typography>
          <Typography variant="caption" color="text.secondary">
            v3.0.0 - Electron Edition
          </Typography>
        </Box>
      </Box>

      {/* FFmpeg 상태 및 도움말 */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Chip
          icon={ffmpegInstalled ? <CheckIcon /> : <ErrorIcon />}
          label={ffmpegInstalled ? 'FFmpeg 설치됨' : 'FFmpeg 미설치'}
          color={ffmpegInstalled ? 'success' : 'error'}
          variant="outlined"
          size="small"
        />
        
        <Tooltip title="FFmpeg 설치 도움말">
          <IconButton onClick={handleFFmpegHelp} size="small">
            <HelpIcon />
          </IconButton>
        </Tooltip>
      </Box>
    </Box>
  );
};

export default Header;