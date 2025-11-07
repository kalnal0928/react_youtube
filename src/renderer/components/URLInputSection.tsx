import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  Chip,
  Paper,
  Alert,
  Button
} from '@mui/material';
import {
  Link as LinkIcon,
  ContentPaste as PasteIcon,
  PlayArrow as PlayIcon,
  Stop as StopIcon,
  Clear as ClearIcon,
  VisibilityOff as HideIcon,
  Visibility as ShowIcon,
  FolderOpen as FolderOpenIcon
} from '@mui/icons-material';

interface URLInputSectionProps {
  urls: string[];
  onURLsChange: (urls: string[]) => void;
  disabled?: boolean;
  isDownloading?: boolean;
  onAddToQueue?: (urls: string[]) => void;
  onStartDownload?: () => void;
  onStopDownload?: () => void;
  onToggleLogs?: () => void;
  onClearLogs?: () => void;
  showLogs?: boolean;
  outputPath?: string;
}

const URLInputSection: React.FC<URLInputSectionProps> = ({
  urls,
  onURLsChange,
  disabled = false,
  isDownloading = false,
  onAddToQueue,
  onStartDownload,
  onStopDownload,
  onToggleLogs,
  onClearLogs,
  showLogs = false,
  outputPath = ''
}) => {
  const [inputValue, setInputValue] = useState('');
  const [urlCount, setUrlCount] = useState(0);

  useEffect(() => {
    setUrlCount(urls.length);
  }, [urls]);

  // urls가 변경되면 inputValue도 업데이트 (다운로드 완료 시 URL 제거)
  useEffect(() => {
    if (urls.length === 0) {
      // 모든 URL이 제거되면 입력창도 비우기
      setInputValue('');
    } else {
      // 현재 입력창의 URL과 상태의 URL을 비교하여 동기화
      const currentUrls = parseURLs(inputValue);
      
      // 상태에 없는 URL은 입력창에서도 제거
      const remainingUrls = currentUrls.filter(url => urls.includes(url));
      
      if (remainingUrls.length !== currentUrls.length) {
        // URL이 제거되었으면 입력창 업데이트
        const newText = remainingUrls.join('\n');
        setInputValue(newText);
        
        // 번호 추가
        setTimeout(() => {
          const numberedText = addNumbersToText(newText);
          setInputValue(numberedText);
        }, 100);
      }
    }
  }, [urls]);

  const isValidYouTubeURL = (url: string): boolean => {
    const patterns = [
      /^https?:\/\/(?:www\.)?youtube\.com\/watch\?v=[\w-]{11}/,
      /^https?:\/\/(?:www\.)?youtu\.be\/[\w-]{11}/,
      /^https?:\/\/(?:www\.)?youtube\.com\/playlist\?list=[\w-]+/,
      /^https?:\/\/(?:www\.)?youtube\.com\/shorts\/[\w-]{11}/,
      /^https?:\/\/(?:m\.)?youtube\.com\/watch\?v=[\w-]{11}/
    ];
    
    return patterns.some(pattern => pattern.test(url));
  };

  const parseURLs = (text: string): string[] => {
    const lines = text.split('\n');
    const validUrls: string[] = [];
    
    lines.forEach(line => {
      const trimmed = line.trim();
      // 번호 제거 (1. 2. 3. 등)
      const cleaned = trimmed.replace(/^\d+\.\s*/, '');
      
      if (cleaned && isValidYouTubeURL(cleaned)) {
        validUrls.push(cleaned);
      }
    });
    
    return validUrls;
  };

  const addNumbersToText = (text: string): string => {
    const lines = text.split('\n');
    const numberedLines: string[] = [];
    let urlNumber = 1;
    
    lines.forEach(line => {
      const trimmed = line.trim();
      if (!trimmed) {
        numberedLines.push('');
        return;
      }
      
      // 기존 번호 제거
      const cleaned = trimmed.replace(/^\d+\.\s*/, '');
      
      if (isValidYouTubeURL(cleaned)) {
        numberedLines.push(`${urlNumber}. ${cleaned}`);
        urlNumber++;
      } else {
        numberedLines.push(trimmed);
      }
    });
    
    return numberedLines.join('\n');
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = event.target.value;
    setInputValue(newValue);
    
    // URL 파싱 및 번호 추가
    const parsedUrls = parseURLs(newValue);
    onURLsChange(parsedUrls);
    
    // 입력 텍스트에 번호 추가 (딜레이를 두어 타이핑 방해 방지)
    setTimeout(() => {
      const numberedText = addNumbersToText(newValue);
      if (numberedText !== newValue) {
        setInputValue(numberedText);
      }
    }, 500);
  };

  // 키보드 이벤트 처리 (Ctrl+V 감지)
  const handleKeyDown = (event: React.KeyboardEvent) => {
    if ((event.ctrlKey || event.metaKey) && event.key === 'v') {
      // Ctrl+V 또는 Cmd+V 감지 시 자동 붙여넣기 처리
      setTimeout(() => {
        handleSmartPaste();
      }, 10);
    }
  };

  // 스마트 붙여넣기 (Python 버전의 동적 큐 기능)
  const handleSmartPaste = async () => {
    try {
      const clipboardText = await navigator.clipboard.readText();
      if (!clipboardText.trim()) return;

      // 여러 줄 처리
      const lines = clipboardText.split('\n');
      const validUrls = lines
        .map(line => line.trim())
        .filter(line => line && isValidYouTubeURL(line));

      if (validUrls.length > 0) {
        // 기존 텍스트에 새 URL들 추가
        const currentLines = inputValue.split('\n').filter(line => line.trim());
        const newLines = [...currentLines, ...validUrls];
        const newText = newLines.join('\n');
        
        setInputValue(newText);
        
        // URL 파싱 및 업데이트
        const allParsedUrls = parseURLs(newText);
        onURLsChange(allParsedUrls);
        
        // 번호 추가
        setTimeout(() => {
          const numberedText = addNumbersToText(newText);
          setInputValue(numberedText);
        }, 100);

        // 다운로드 중이면 큐에 직접 추가
        if (isDownloading && onAddToQueue) {
          onAddToQueue(validUrls);
        }
      }
    } catch (error) {
      console.error('스마트 붙여넣기 실패:', error);
    }
  };



  const getUrlCountColor = () => {
    if (urlCount === 0) return 'default';
    if (urlCount > 10) return 'error';
    return 'success';
  };

  const handleOpenFolder = async () => {
    try {
      await window.electronAPI.openFolder(outputPath);
    } catch (error) {
      console.error('폴더 열기 오류:', error);
    }
  };

  return (
    <Paper sx={{ p: { xs: 2, sm: 3 }, mb: { xs: 1, sm: 2 } }}>
      {/* 헤더 */}
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between', 
        mb: 2,
        flexWrap: { xs: 'wrap', sm: 'nowrap' },
        gap: 1
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, minWidth: 0 }}>
          <LinkIcon color="primary" />
          <Typography 
            variant="h6"
            fontWeight="bold"
            sx={{ 
              fontSize: { xs: '1rem', sm: '1.25rem' },
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap'
            }}
          >
            📋 YouTube URL 입력 (최대 10개)
          </Typography>
        </Box>
        
        <Chip
          label={`${urlCount}/10`}
          color={getUrlCountColor()}
          size="small"
          sx={{ flexShrink: 0 }}
        />
      </Box>

      {/* 안내 메시지 */}
      <Alert severity={isDownloading ? "success" : "info"} sx={{ mb: 2 }}>
        {isDownloading ? (
          <>
            🚀 <strong>다운로드 진행 중!</strong> URL 복사 후 Ctrl+V로 실시간 큐 추가 가능
          </>
        ) : (
          <>
            💡 URL 복사 후 Ctrl+V만 하면 다운로드 큐에 자동 추가됩니다.
          </>
        )}
      </Alert>

      {/* URL 입력 필드 */}
      <TextField
        multiline
        rows={5}
        fullWidth
        value={inputValue}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        label="YouTube URL 입력"
        placeholder={`여기에 YouTube URL을 입력하세요...
URL 복사 후 Ctrl+V만 누르면 자동으로 큐에 추가됩니다!

예시:
https://www.youtube.com/watch?v=VIDEO_ID
https://youtu.be/VIDEO_ID`}
        variant="outlined"
        sx={{
          '& .MuiOutlinedInput-root': {
            fontFamily: 'monospace',
            fontSize: { xs: '0.8rem', sm: '0.9rem' },
            minHeight: { xs: '120px', sm: '140px' },
            '&:hover fieldset': {
              borderColor: 'primary.main',
            },
            '&.Mui-focused fieldset': {
              borderColor: 'primary.main',
              borderWidth: 2,
            },
          },
        }}
        InputProps={{
          endAdornment: (
            <Box sx={{ 
              position: 'absolute', 
              top: { xs: 4, sm: 8 }, 
              right: { xs: 4, sm: 8 }
            }}>
              <Chip
                icon={<PasteIcon />}
                label="스마트 붙여넣기"
                onClick={handleSmartPaste}
                size="small"
                clickable
                disabled={disabled}
                color="primary"
                variant="outlined"
                sx={{ 
                  fontSize: { xs: '0.7rem', sm: '0.8rem' },
                  '& .MuiChip-label': {
                    display: { xs: 'none', sm: 'block' }
                  }
                }}
              />
            </Box>
          ),
        }}
      />

      {/* URL 개수 경고 */}
      {urlCount > 10 && (
        <Alert severity="error" sx={{ mt: 2 }}>
          최대 10개의 URL만 입력할 수 있습니다. 현재 {urlCount}개가 입력되었습니다.
        </Alert>
      )}

      {/* 컨트롤 버튼들 */}
      <Box sx={{ 
        display: 'flex', 
        gap: { xs: 1, sm: 2 }, 
        justifyContent: 'center',
        flexDirection: { xs: 'column', sm: 'row' },
        mt: 2,
        pt: 2,
        borderTop: '1px solid',
        borderColor: 'divider'
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
            whiteSpace: 'nowrap',
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
            padding: { xs: '8px 16px', sm: '12px 24px' },
            whiteSpace: 'nowrap'
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
            padding: { xs: '8px 16px', sm: '12px 24px' },
            whiteSpace: 'nowrap'
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
            padding: { xs: '8px 16px', sm: '12px 24px' },
            whiteSpace: 'nowrap'
          }}
        >
          로그 지우기
        </Button>

        <Button
          variant="outlined"
          size="large"
          onClick={handleOpenFolder}
          startIcon={<FolderOpenIcon />}
          color="primary"
          sx={{ 
            minWidth: { xs: 'auto', sm: 120 },
            fontSize: { xs: '0.875rem', sm: '1rem' },
            padding: { xs: '8px 16px', sm: '12px 24px' },
            whiteSpace: 'nowrap'
          }}
        >
          폴더 열기
        </Button>
      </Box>
    </Paper>
  );
};

export default URLInputSection;