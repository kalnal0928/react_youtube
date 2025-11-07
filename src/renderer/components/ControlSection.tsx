import React from 'react';
import {
  Box,
  Button,
  Paper
} from '@mui/material';
import {
  PlayArrow as PlayIcon,
  Stop as StopIcon,
  Clear as ClearIcon,
  VisibilityOff as HideIcon,
  Visibility as ShowIcon
} from '@mui/icons-material';

interface ControlSectionProps {
  isDownloading: boolean;
  onStartDownload: () => void;
  onStopDownload: () => void;
  onClearLogs: () => void;
  onToggleLogs: () => void;
  showLogs: boolean;
}

const ControlSection: React.FC<ControlSectionProps> = ({
  isDownloading,
  onStartDownload,
  onStopDownload,
  onClearLogs,
  onToggleLogs,
  showLogs
}) => {
  return (
    <Paper sx={{ p: { xs: 1.5, sm: 2 } }}>
      <Box sx={{ 
        display: 'flex', 
        gap: { xs: 1, sm: 2 }, 
        justifyContent: 'center',
        flexDirection: { xs: 'column', sm: 'row' }
      }}>
        <Button
          variant="contained"
          size="large"
          onClick={onStartDownload}
          disabled={isDownloading}
          startIcon={<PlayIcon />}
          sx={{
            minWidth: { xs: 'auto', sm: 150 },
            fontSize: { xs: '0.875rem', sm: '1rem' },
            padding: { xs: '8px 16px', sm: '12px 24px' },
            bgcolor: 'success.main',
            '&:hover': {
              bgcolor: 'success.dark',
            },
          }}
        >
          다운로드 시작
        </Button>

        <Button
          variant="contained"
          size="large"
          onClick={onStopDownload}
          disabled={!isDownloading}
          startIcon={<StopIcon />}
          color="error"
          sx={{ 
            minWidth: { xs: 'auto', sm: 120 },
            fontSize: { xs: '0.875rem', sm: '1rem' },
            padding: { xs: '8px 16px', sm: '12px 24px' }
          }}
        >
          정지
        </Button>

        <Button
          variant="outlined"
          size="large"
          onClick={onToggleLogs}
          startIcon={showLogs ? <HideIcon /> : <ShowIcon />}
          sx={{ 
            minWidth: { xs: 'auto', sm: 120 },
            fontSize: { xs: '0.875rem', sm: '1rem' },
            padding: { xs: '8px 16px', sm: '12px 24px' }
          }}
        >
          로그 {showLogs ? '숨기기' : '보기'}
        </Button>

        <Button
          variant="outlined"
          size="large"
          onClick={onClearLogs}
          startIcon={<ClearIcon />}
          sx={{ 
            minWidth: { xs: 'auto', sm: 120 },
            fontSize: { xs: '0.875rem', sm: '1rem' },
            padding: { xs: '8px 16px', sm: '12px 24px' }
          }}
        >
          로그 지우기
        </Button>
      </Box>
    </Paper>
  );
};

export default ControlSection;