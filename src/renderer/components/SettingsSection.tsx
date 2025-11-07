import React from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Paper,
  Alert
} from '@mui/material';
import {
  Settings as SettingsIcon,
  FolderOpen as FolderIcon
} from '@mui/icons-material';

interface SettingsSectionProps {
  quality: string;
  outputPath: string;
  onQualityChange: (quality: string) => void;
  onPathChange: (path: string) => void;
  disabled?: boolean;
  ffmpegInstalled: boolean;
}

const SettingsSection: React.FC<SettingsSectionProps> = ({
  quality,
  outputPath,
  onQualityChange,
  onPathChange,
  disabled = false,
  ffmpegInstalled
}) => {
  const qualityOptions = [
    {
      value: 'best[ext=mp4]/best',
      label: '최고 품질 (단일 파일) - 권장',
      needsFFmpeg: false
    },
    {
      value: 'bestvideo[ext=mp4]+bestaudio[ext=m4a]/best[ext=mp4]/best',
      label: '최고 품질 (병합) - FFmpeg 필요',
      needsFFmpeg: true
    },
    {
      value: 'best[height<=720]',
      label: '720p HD',
      needsFFmpeg: false
    },
    {
      value: 'best[height<=480]',
      label: '480p',
      needsFFmpeg: false
    },
    {
      value: 'bestaudio/best',
      label: '음성만 (MP3) - FFmpeg 필요',
      needsFFmpeg: true
    }
  ];

  const handleBrowseFolder = async () => {
    try {
      const selectedPath = await window.electronAPI.selectFolder();
      if (selectedPath) {
        onPathChange(selectedPath);
      }
    } catch (error) {
      console.error('폴더 선택 오류:', error);
    }
  };

  return (
    <Paper sx={{ p: { xs: 2, sm: 3 } }}>
      {/* 헤더 */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: { xs: 2, sm: 3 } }}>
        <SettingsIcon color="primary" />
        <Typography 
          variant="h6" 
          fontWeight="bold"
          sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }}
        >
          다운로드 설정
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: { xs: 1.5, sm: 2 } }}>
        {/* 다운로드 경로 */}
        <Box>
          <Typography variant="subtitle1" fontWeight="medium" sx={{ mb: 1 }}>
            다운로드 경로
          </Typography>
          <Box sx={{ 
            display: 'flex', 
            gap: 1,
            flexDirection: { xs: 'column', sm: 'row' }
          }}>
            <TextField
              fullWidth
              value={outputPath}
              onChange={(e) => onPathChange(e.target.value)}
              disabled={disabled}
              variant="outlined"
              size="small"
              sx={{ flex: 1 }}
            />
            <Button
              variant="outlined"
              onClick={handleBrowseFolder}
              disabled={disabled}
              startIcon={<FolderIcon />}
              sx={{ 
                minWidth: { xs: 'auto', sm: 120 },
                flexShrink: 0
              }}
            >
              찾아보기
            </Button>
          </Box>
        </Box>

        {/* 품질 설정 */}
        <Box>
          <FormControl component="fieldset" disabled={disabled} sx={{ width: '100%' }}>
            <FormLabel component="legend">
              <Typography variant="subtitle1" fontWeight="medium">
                품질 설정
              </Typography>
            </FormLabel>
            <RadioGroup
              value={quality}
              onChange={(e) => onQualityChange(e.target.value)}
              sx={{ 
                mt: 1,
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
                gap: { xs: 0.5, sm: 1 }
              }}
            >
              {qualityOptions.map((option) => (
                <FormControlLabel
                  key={option.value}
                  value={option.value}
                  control={<Radio size="small" />}
                  label={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <Typography 
                        variant="body2"
                        sx={{ 
                          fontSize: { xs: '0.8rem', sm: '0.875rem' },
                          lineHeight: 1.2
                        }}
                      >
                        {option.label}
                      </Typography>
                      {option.needsFFmpeg && !ffmpegInstalled && (
                        <Typography
                          variant="caption"
                          color="error"
                          sx={{ fontWeight: 'bold', fontSize: '0.7rem' }}
                        >
                          ⚠️
                        </Typography>
                      )}
                    </Box>
                  }
                  disabled={disabled || (option.needsFFmpeg && !ffmpegInstalled)}
                  sx={{
                    margin: 0,
                    '& .MuiFormControlLabel-label': {
                      fontSize: { xs: '0.8rem', sm: '0.875rem' }
                    }
                  }}
                />
              ))}
            </RadioGroup>
          </FormControl>
        </Box>

        {/* 컴팩트한 안내 메시지 */}
        <Box sx={{ 
          display: 'flex', 
          flexDirection: { xs: 'column', sm: 'row' },
          gap: 1
        }}>
          {/* FFmpeg 경고 */}
          {!ffmpegInstalled && (
            <Alert 
              severity="warning" 
              sx={{ 
                flex: 1,
                py: 0.5,
                '& .MuiAlert-message': {
                  fontSize: '0.8rem'
                }
              }}
            >
              <Typography variant="caption" sx={{ fontWeight: 'bold' }}>
                FFmpeg 미설치
              </Typography>
              <br />
              <Typography variant="caption">
                고급 기능 제한됨
              </Typography>
            </Alert>
          )}

          {/* 기능 안내 */}
          <Box sx={{ 
            bgcolor: 'grey.50', 
            p: 1.5, 
            borderRadius: 1,
            flex: 1,
            minWidth: 0
          }}>
            <Typography variant="caption" fontWeight="bold" sx={{ mb: 0.5, display: 'block' }}>
              💡 기능 안내
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ lineHeight: 1.3 }}>
              <strong>FFmpeg 불필요:</strong> 단일 파일, 720p, 480p<br />
              <strong>FFmpeg 필요:</strong> 병합, MP3 추출
            </Typography>
          </Box>
        </Box>
      </Box>
    </Paper>
  );
};

export default SettingsSection;