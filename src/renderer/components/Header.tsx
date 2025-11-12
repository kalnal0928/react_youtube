import React, { useState } from 'react';
import {
  Box,
  Typography,
  Chip,
  IconButton,
  Tooltip,
  Button,
  CircularProgress
} from '@mui/material';
import {
  YouTube as YouTubeIcon,
  CheckCircle as CheckIcon,
  Error as ErrorIcon,
  Help as HelpIcon,
  Update as UpdateIcon,
  Info as InfoIcon
} from '@mui/icons-material';
import FFmpegHelpDialog from './FFmpegHelpDialog';
import AboutDialog from './AboutDialog';

interface HeaderProps {
  ffmpegInstalled: boolean;
  onRefreshFFmpegStatus: () => void;
}

const Header: React.FC<HeaderProps> = ({ ffmpegInstalled, onRefreshFFmpegStatus }) => {
  const [isUpdating, setIsUpdating] = useState(false);
  const [showFFmpegHelp, setShowFFmpegHelp] = useState(false);
  const [showAbout, setShowAbout] = useState(false);

  const handleFFmpegHelp = () => {
    setShowFFmpegHelp(true);
  };

  const handleCloseFFmpegHelp = () => {
    setShowFFmpegHelp(false);
  };

  const handleYtDlpUpdate = async () => {
    setIsUpdating(true);
    try {
      const result = await window.electronAPI.updateYtDlp();
      if (result.success) {
        if (result.updated) {
          alert('✨ yt-dlp.exe가 성공적으로 업데이트되었습니다!');
        } else {
          alert('✅ yt-dlp.exe가 이미 최신 버전입니다.');
        }
      } else {
        alert(`❌ 업데이트 실패: ${result.error}`);
      }
    } catch (error) {
      alert('❌ 업데이트 중 오류가 발생했습니다.');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleOpenReleases = async () => {
    try {
      await window.electronAPI.openYtDlpReleases();
    } catch (error) {
      alert('❌ 브라우저를 여는 중 오류가 발생했습니다.');
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        p: { xs: 1.5, sm: 2 },
        bgcolor: 'background.paper',
        borderRadius: 2,
        boxShadow: 1,
        flexWrap: { xs: 'wrap', md: 'nowrap' },
        gap: { xs: 1, sm: 0 }
      }}
    >
      {/* 로고 및 제목 */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, sm: 2 }, minWidth: 0 }}>
        <YouTubeIcon sx={{ fontSize: { xs: 24, sm: 32 }, color: '#FF0000', flexShrink: 0 }} />
        <Box sx={{ minWidth: 0 }}>
          <Typography 
            variant="h5"
            component="h1" 
            fontWeight="bold"
            sx={{ 
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              fontSize: { xs: '1.25rem', sm: '1.5rem' }
            }}
          >
            YouTube Downloader
          </Typography>
          <Typography 
            variant="caption" 
            color="text.secondary"
            sx={{ display: { xs: 'none', sm: 'block' } }}
          >
            v3.0.0 - Electron Edition
          </Typography>
        </Box>
      </Box>

      {/* 상태 및 버튼들 */}
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: 1,
        flexShrink: 0,
        width: { xs: '100%', md: 'auto' },
        justifyContent: { xs: 'flex-end', md: 'flex-start' },
        flexWrap: 'wrap'
      }}>
        {/* yt-dlp 업데이트 버튼 */}
        <Button
          size="small"
          variant="outlined"
          startIcon={isUpdating ? <CircularProgress size={16} /> : <UpdateIcon />}
          onClick={handleYtDlpUpdate}
          disabled={isUpdating}
          sx={{ 
            fontSize: { xs: '0.7rem', sm: '0.8rem' },
            minWidth: { xs: 'auto', sm: 100 },
            px: { xs: 1, sm: 2 }
          }}
        >
          {isUpdating ? '업데이트 중...' : 'yt-dlp 업데이트'}
        </Button>

        {/* FFmpeg 상태 */}
        <Chip
          icon={ffmpegInstalled ? <CheckIcon /> : <ErrorIcon />}
          label={ffmpegInstalled ? 'FFmpeg 설치됨' : 'FFmpeg 미설치'}
          color={ffmpegInstalled ? 'success' : 'error'}
          variant="outlined"
          size="small"
          sx={{ 
            fontSize: { xs: '0.7rem', sm: '0.8rem' },
            '& .MuiChip-label': {
              display: { xs: 'none', sm: 'block' }
            }
          }}
        />
        
        <Tooltip title="FFmpeg 설치 도움말">
          <IconButton onClick={handleFFmpegHelp} size="small">
            <HelpIcon />
          </IconButton>
        </Tooltip>

        <Tooltip title="프로그램 정보">
          <IconButton onClick={() => setShowAbout(true)} size="small" color="primary">
            <InfoIcon />
          </IconButton>
        </Tooltip>
      </Box>

      {/* FFmpeg 도움말 다이얼로그 */}
      <FFmpegHelpDialog
        open={showFFmpegHelp}
        onClose={handleCloseFFmpegHelp}
        onRefreshStatus={onRefreshFFmpegStatus}
      />

      {/* About 다이얼로그 */}
      <AboutDialog
        open={showAbout}
        onClose={() => setShowAbout(false)}
      />
    </Box>
  );
};

export default Header;