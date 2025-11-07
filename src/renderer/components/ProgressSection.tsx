import React from 'react';
import {
  Box,
  Typography,
  LinearProgress,
  Paper,
  Chip
} from '@mui/material';
import {
  Download as DownloadIcon,
  Speed as SpeedIcon,
  Schedule as ScheduleIcon
} from '@mui/icons-material';
import { motion } from 'framer-motion';

interface DownloadProgress {
  currentIndex: number;
  totalCount: number;
  currentUrl: string;
  status: 'starting' | 'downloading' | 'completed' | 'failed';
  percentage?: number;
  speed?: string;
  eta?: string;
}

interface ProgressSectionProps {
  downloadProgress: DownloadProgress | null;
  isDownloading: boolean;
}

const ProgressSection: React.FC<ProgressSectionProps> = ({
  downloadProgress,
  isDownloading
}) => {
  if (!isDownloading && !downloadProgress) {
    return null;
  }

  const getOverallProgress = () => {
    if (!downloadProgress) return 0;
    return ((downloadProgress.currentIndex) / downloadProgress.totalCount) * 100;
  };

  const getCurrentProgress = () => {
    if (!downloadProgress || !downloadProgress.percentage) return 0;
    return downloadProgress.percentage;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'starting': return 'info';
      case 'downloading': return 'primary';
      case 'completed': return 'success';
      case 'failed': return 'error';
      default: return 'default';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'starting': return '시작 중...';
      case 'downloading': return '다운로드 중...';
      case 'completed': return '완료';
      case 'failed': return '실패';
      default: return '대기 중...';
    }
  };

  const truncateUrl = (url: string, maxLength: number = 50) => {
    if (url.length <= maxLength) return url;
    return url.substring(0, maxLength) + '...';
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3 }}
    >
      <Paper sx={{ p: 3 }}>
        {/* 헤더 */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
          <DownloadIcon color="primary" />
          <Typography variant="h6" fontWeight="bold">
            다운로드 진행률
          </Typography>
        </Box>

        {/* 전체 진행률 */}
        <Box sx={{ mb: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
            <Typography variant="subtitle1" fontWeight="medium">
              전체 진행률
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {downloadProgress ? `${downloadProgress.currentIndex}/${downloadProgress.totalCount}` : '0/0'}
            </Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={getOverallProgress()}
            sx={{
              height: 8,
              borderRadius: 4,
              bgcolor: 'grey.200',
              '& .MuiLinearProgress-bar': {
                borderRadius: 4,
              },
            }}
          />
          <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
            {getOverallProgress().toFixed(1)}% 완료
          </Typography>
        </Box>

        {/* 현재 다운로드 정보 */}
        {downloadProgress && (
          <Box>
            <Typography variant="subtitle1" fontWeight="medium" sx={{ mb: 2 }}>
              현재 다운로드
            </Typography>
            
            {/* URL 및 상태 */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <Typography variant="body2" sx={{ flex: 1 }}>
                {truncateUrl(downloadProgress.currentUrl)}
              </Typography>
              <Chip
                label={getStatusText(downloadProgress.status)}
                color={getStatusColor(downloadProgress.status) as any}
                size="small"
              />
            </Box>

            {/* 개별 진행률 */}
            {downloadProgress.status === 'downloading' && (
              <Box sx={{ mb: 2 }}>
                <LinearProgress
                  variant="determinate"
                  value={getCurrentProgress()}
                  sx={{
                    height: 6,
                    borderRadius: 3,
                    bgcolor: 'grey.200',
                    '& .MuiLinearProgress-bar': {
                      borderRadius: 3,
                    },
                  }}
                />
                <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                  {getCurrentProgress().toFixed(1)}%
                </Typography>
              </Box>
            )}

            {/* 다운로드 정보 */}
            {downloadProgress.status === 'downloading' && (downloadProgress.speed || downloadProgress.eta) && (
              <Box sx={{ display: 'flex', gap: 2 }}>
                {downloadProgress.speed && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <SpeedIcon fontSize="small" color="action" />
                    <Typography variant="caption" color="text.secondary">
                      {downloadProgress.speed}
                    </Typography>
                  </Box>
                )}
                {downloadProgress.eta && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <ScheduleIcon fontSize="small" color="action" />
                    <Typography variant="caption" color="text.secondary">
                      남은 시간: {downloadProgress.eta}
                    </Typography>
                  </Box>
                )}
              </Box>
            )}
          </Box>
        )}

        {/* 로딩 상태 (진행률 정보가 없을 때) */}
        {isDownloading && !downloadProgress && (
          <Box sx={{ textAlign: 'center', py: 2 }}>
            <LinearProgress sx={{ mb: 2 }} />
            <Typography variant="body2" color="text.secondary">
              다운로드 준비 중...
            </Typography>
          </Box>
        )}
      </Paper>
    </motion.div>
  );
};

export default ProgressSection;