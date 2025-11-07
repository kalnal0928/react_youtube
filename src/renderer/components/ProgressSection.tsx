import React, { useState, useEffect } from 'react';
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
import { motion, useSpring } from 'framer-motion';

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
  const [smoothProgress, setSmoothProgress] = useState(0);
  const [smoothOverallProgress, setSmoothOverallProgress] = useState(0);
  const [estimatedProgress, setEstimatedProgress] = useState(0);
  const [downloadStartTime, setDownloadStartTime] = useState<number | null>(null);

  // 부드러운 애니메이션을 위한 스프링
  const springConfig = { stiffness: 50, damping: 20 };
  const currentProgressSpring = useSpring(0, springConfig);
  const overallProgressSpring = useSpring(0, springConfig);

  // 다운로드 시작 시간 기록
  useEffect(() => {
    if (downloadProgress?.status === 'starting') {
      setDownloadStartTime(Date.now());
      setEstimatedProgress(0);
    }
  }, [downloadProgress?.status]);

  // 개별 진행률 업데이트
  useEffect(() => {
    if (downloadProgress?.percentage !== undefined && downloadProgress.percentage > 0) {
      currentProgressSpring.set(downloadProgress.percentage);
      setEstimatedProgress(downloadProgress.percentage);
    }
  }, [downloadProgress?.percentage, currentProgressSpring]);

  // 진행률이 업데이트되지 않을 때 예상 진행률 표시
  useEffect(() => {
    if (downloadProgress?.status === 'downloading' && downloadStartTime) {
      const interval = setInterval(() => {
        const elapsed = Date.now() - downloadStartTime;
        // 30초마다 약 10% 증가하는 것으로 가정 (매우 보수적)
        const estimated = Math.min((elapsed / 30000) * 10, 95);
        
        // 실제 진행률이 없거나 예상보다 낮으면 예상 진행률 사용
        if (estimatedProgress < estimated) {
          setEstimatedProgress(estimated);
          currentProgressSpring.set(estimated);
        }
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [downloadProgress?.status, downloadStartTime, estimatedProgress, currentProgressSpring]);

  // 전체 진행률 업데이트
  useEffect(() => {
    if (downloadProgress) {
      // 현재 다운로드 중인 파일의 진행률도 포함
      const completedFiles = downloadProgress.currentIndex;
      const totalFiles = downloadProgress.totalCount;
      const currentFileProgress = (downloadProgress.percentage || 0) / 100;
      
      // 전체 진행률 = (완료된 파일 수 + 현재 파일 진행률) / 전체 파일 수
      const overallProgress = ((completedFiles + currentFileProgress) / totalFiles) * 100;
      
      overallProgressSpring.set(overallProgress);
    }
  }, [downloadProgress?.currentIndex, downloadProgress?.totalCount, downloadProgress?.percentage, overallProgressSpring]);

  // 스프링 값을 상태로 변환
  useEffect(() => {
    const unsubscribeCurrent = currentProgressSpring.on('change', (latest) => {
      setSmoothProgress(latest);
    });
    const unsubscribeOverall = overallProgressSpring.on('change', (latest) => {
      setSmoothOverallProgress(latest);
    });

    return () => {
      unsubscribeCurrent();
      unsubscribeOverall();
    };
  }, [currentProgressSpring, overallProgressSpring]);

  if (!isDownloading && !downloadProgress) {
    return null;
  }

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

        {/* 현재 다운로드 정보 */}
        {downloadProgress && (
          <Box>
            {/* 파일 카운터 */}
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center', 
              mb: 2,
              p: 2,
              bgcolor: 'primary.50',
              borderRadius: 2,
              border: '1px solid',
              borderColor: 'primary.200'
            }}>
              <Typography variant="body1" fontWeight="bold" color="primary.main">
                파일 {downloadProgress.currentIndex + 1} / {downloadProgress.totalCount}
              </Typography>
              <Chip
                label={getStatusText(downloadProgress.status)}
                color={getStatusColor(downloadProgress.status) as any}
                size="medium"
              />
            </Box>

            {/* URL */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="caption" color="text.secondary" sx={{ mb: 0.5, display: 'block' }}>
                다운로드 중인 URL:
              </Typography>
              <Typography 
                variant="body2" 
                sx={{ 
                  wordBreak: 'break-all',
                  bgcolor: 'grey.100',
                  p: 1,
                  borderRadius: 1,
                  fontFamily: 'monospace',
                  fontSize: '0.75rem'
                }}
              >
                {downloadProgress.currentUrl}
              </Typography>
            </Box>

            {/* 개별 파일 진행률 - 크고 명확하게 */}
            {(downloadProgress.status === 'downloading' || downloadProgress.status === 'starting') && (
              <Box sx={{ mb: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                  <Typography variant="h6" fontWeight="bold" color="primary.main">
                    현재 파일 진행률
                  </Typography>
                  <Typography variant="h5" fontWeight="bold" color="primary.main">
                    {smoothProgress.toFixed(1)}%
                  </Typography>
                </Box>
                <LinearProgress
                  variant={downloadProgress.status === 'starting' ? 'indeterminate' : 'determinate'}
                  value={smoothProgress}
                  sx={{
                    height: 20,
                    borderRadius: 10,
                    bgcolor: 'grey.200',
                    '& .MuiLinearProgress-bar': {
                      borderRadius: 10,
                      transition: 'transform 0.3s ease-out',
                      background: 'linear-gradient(90deg, #4caf50 0%, #81c784 100%)',
                    },
                  }}
                />
              </Box>
            )}

            {/* 다운로드 정보 */}
            {downloadProgress.status === 'downloading' && (downloadProgress.speed || downloadProgress.eta) && (
              <Box sx={{ 
                display: 'flex', 
                gap: 3,
                p: 2,
                bgcolor: 'grey.50',
                borderRadius: 2
              }}>
                {downloadProgress.speed && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <SpeedIcon fontSize="medium" color="action" />
                    <Box>
                      <Typography variant="caption" color="text.secondary" display="block">
                        다운로드 속도
                      </Typography>
                      <Typography variant="body2" fontWeight="medium">
                        {downloadProgress.speed}
                      </Typography>
                    </Box>
                  </Box>
                )}
                {downloadProgress.eta && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <ScheduleIcon fontSize="medium" color="action" />
                    <Box>
                      <Typography variant="caption" color="text.secondary" display="block">
                        남은 시간
                      </Typography>
                      <Typography variant="body2" fontWeight="medium">
                        {downloadProgress.eta}
                      </Typography>
                    </Box>
                  </Box>
                )}
              </Box>
            )}

            {/* 전체 진행률 - 작게 표시 */}
            <Box sx={{ mt: 3, pt: 3, borderTop: '1px solid', borderColor: 'divider' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                <Typography variant="caption" color="text.secondary">
                  전체 진행률
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {smoothOverallProgress.toFixed(1)}% 완료
                </Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={smoothOverallProgress}
                sx={{
                  height: 4,
                  borderRadius: 2,
                  bgcolor: 'grey.200',
                  '& .MuiLinearProgress-bar': {
                    borderRadius: 2,
                    transition: 'transform 0.3s ease-out',
                  },
                }}
              />
            </Box>
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