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
  Alert,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  Settings as SettingsIcon,
  FolderOpen as FolderIcon,
  Launch as LaunchIcon
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

  const handleOpenFolder = async () => {
    try {
      await window.electronAPI.openFolder(outputPath);
    } catch (error) {
      console.error('폴더 열기 오류:', error);
    }
  };

  return (
    <Paper sx={{ p: 3 }}>
      {/* 헤더 */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
        <SettingsIcon color="primary" />
        <Typography variant="h6" fontWeight="bold">
          다운로드 설정
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        {/* 다운로드 경로 */}
        <Box>
          <Typography variant="subtitle1" fontWeight="medium" sx={{ mb: 1 }}>
            다운로드 경로
          </Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <TextField
              fullWidth
              value={outputPath}
              onChange={(e) => onPathChange(e.target.value)}
              disabled={disabled}
              variant="outlined"
              size="small"
            />
            <Button
              variant="outlined"
              onClick={handleBrowseFolder}
              disabled={disabled}
              startIcon={<FolderIcon />}
              sx={{ minWidth: 120 }}
            >
              찾아보기
            </Button>
            <Tooltip title="폴더 열기">
              <IconButton
                onClick={handleOpenFolder}
                disabled={disabled}
                color="primary"
              >
                <LaunchIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>

        {/* 품질 설정 */}
        <Box>
          <FormControl component="fieldset" disabled={disabled}>
            <FormLabel component="legend">
              <Typography variant="subtitle1" fontWeight="medium">
                품질 설정
              </Typography>
            </FormLabel>
            <RadioGroup
              value={quality}
              onChange={(e) => onQualityChange(e.target.value)}
              sx={{ mt: 1 }}
            >
              {qualityOptions.map((option) => (
                <FormControlLabel
                  key={option.value}
                  value={option.value}
                  control={<Radio />}
                  label={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography>
                        {option.label}
                      </Typography>
                      {option.needsFFmpeg && !ffmpegInstalled && (
                        <Typography
                          variant="caption"
                          color="error"
                          sx={{ fontWeight: 'bold' }}
                        >
                          ⚠️
                        </Typography>
                      )}
                    </Box>
                  }
                  disabled={disabled || (option.needsFFmpeg && !ffmpegInstalled)}
                />
              ))}
            </RadioGroup>
          </FormControl>
        </Box>

        {/* FFmpeg 경고 */}
        {!ffmpegInstalled && (
          <Alert severity="warning">
            <Typography variant="body2">
              <strong>FFmpeg가 설치되지 않았습니다.</strong><br />
              고품질 병합 및 음성 추출 기능을 사용하려면 FFmpeg를 설치해주세요.
            </Typography>
          </Alert>
        )}

        {/* 사용 가능한 기능 안내 */}
        <Box sx={{ bgcolor: 'grey.50', p: 2, borderRadius: 1 }}>
          <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 1 }}>
            💡 기능 안내
          </Typography>
          <Typography variant="body2" color="text.secondary">
            <strong>FFmpeg 없이 사용 가능:</strong> 최고 품질 (단일 파일), 720p, 480p<br />
            <strong>FFmpeg 필요:</strong> 최고 품질 (병합), 음성만 추출 (MP3)
          </Typography>
        </Box>
      </Box>
    </Paper>
  );
};

export default SettingsSection;