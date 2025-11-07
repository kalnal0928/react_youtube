import React, { useEffect, useRef } from 'react';
import {
  Box,
  Typography,
  Paper,
  TextField
} from '@mui/material';
import {
  Terminal as TerminalIcon
} from '@mui/icons-material';

interface LogSectionProps {
  logs: string[];
}

const LogSection: React.FC<LogSectionProps> = ({ logs }) => {
  const logEndRef = useRef<HTMLDivElement>(null);

  // 새 로그가 추가될 때마다 스크롤을 맨 아래로
  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  const formatLogMessage = (message: string) => {
    // 이모지와 메시지 분리하여 색상 적용
    if (message.includes('✅')) {
      return { color: '#4caf50', message }; // 성공 - 초록색
    } else if (message.includes('❌')) {
      return { color: '#f44336', message }; // 오류 - 빨간색
    } else if (message.includes('⚠️')) {
      return { color: '#ff9800', message }; // 경고 - 주황색
    } else if (message.includes('📥') || message.includes('📋')) {
      return { color: '#2196f3', message }; // 정보 - 파란색
    } else if (message.includes('[yt-dlp]')) {
      return { color: '#9e9e9e', message }; // yt-dlp 출력 - 회색
    } else if (message.includes('[오류]')) {
      return { color: '#f44336', message }; // 오류 - 빨간색
    } else {
      return { color: 'inherit', message }; // 기본색
    }
  };

  return (
    <Paper sx={{ 
      p: { xs: 2, sm: 3 }, 
      height: '100%', 
      display: 'flex', 
      flexDirection: 'column',
      minHeight: 0
    }}>
      {/* 헤더 */}
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: 1, 
        mb: { xs: 1, sm: 2 },
        flexWrap: 'wrap'
      }}>
        <TerminalIcon color="primary" />
        <Typography 
          variant="h6" 
          fontWeight="bold"
          sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }}
        >
          로그
        </Typography>
        <Typography variant="caption" color="text.secondary">
          ({logs.length}개 메시지)
        </Typography>
      </Box>

      {/* 로그 내용 */}
      <Box
        sx={{
          flex: 1,
          bgcolor: '#1e1e1e',
          borderRadius: 1,
          p: { xs: 1, sm: 2 },
          overflow: 'auto',
          fontFamily: 'Consolas, Monaco, "Courier New", monospace',
          fontSize: { xs: '0.75rem', sm: '0.875rem' },
          lineHeight: 1.4,
          color: '#ffffff',
          minHeight: { xs: 150, sm: 200 },
          border: '1px solid #333',
        }}
      >
        {logs.length === 0 ? (
          <Typography
            variant="body2"
            sx={{
              color: '#888',
              fontStyle: 'italic',
              textAlign: 'center',
              mt: 4
            }}
          >
            로그가 여기에 표시됩니다...
          </Typography>
        ) : (
          logs.map((log, index) => {
            const { color, message } = formatLogMessage(log);
            return (
              <Box
                key={index}
                sx={{
                  color,
                  mb: 0.5,
                  wordBreak: 'break-word',
                  whiteSpace: 'pre-wrap',
                  '&:hover': {
                    bgcolor: 'rgba(255, 255, 255, 0.05)',
                  },
                }}
              >
                {message}
              </Box>
            );
          })
        )}
        <div ref={logEndRef} />
      </Box>

      {/* 로그 안내 */}
      <Typography
        variant="caption"
        color="text.secondary"
        sx={{ mt: 1, textAlign: 'center' }}
      >
        💡 로그는 실시간으로 업데이트되며, 자동으로 스크롤됩니다.
      </Typography>
    </Paper>
  );
};

export default LogSection;