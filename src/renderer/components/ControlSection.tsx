import React from 'react';
import {
  Box,
  Button,
  Paper
} from '@mui/material';
import {
  PlayArrow as PlayIcon,
  Stop as StopIcon,
  Clear as ClearIcon
} from '@mui/icons-material';

interface ControlSectionProps {
  isDownloading: boolean;
  onStartDownload: () => void;
  onStopDownload: () => void;
  onClearLogs: () => void;
}

const ControlSection: React.FC<ControlSectionProps> = ({
  isDownloading,
  onStartDownload,
  onStopDownload,
  onClearLogs
}) => {
  return (
    <Paper sx={{ p: 2 }}>
      <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
        <Button
          variant="contained"
          size="large"
          onClick={onStartDownload}
          disabled={isDownloading}
          startIcon={<PlayIcon />}
          sx={{
            minWidth: 150,
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
          sx={{ minWidth: 120 }}
        >
          정지
        </Button>

        <Button
          variant="outlined"
          size="large"
          onClick={onClearLogs}
          startIcon={<ClearIcon />}
          sx={{ minWidth: 120 }}
        >
          로그 지우기
        </Button>
      </Box>
    </Paper>
  );
};

export default ControlSection;