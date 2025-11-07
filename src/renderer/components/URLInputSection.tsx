import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  Chip,
  Paper,
  Alert
} from '@mui/material';
import {
  Link as LinkIcon,
  ContentPaste as PasteIcon
} from '@mui/icons-material';

interface URLInputSectionProps {
  urls: string[];
  onURLsChange: (urls: string[]) => void;
  disabled?: boolean;
}

const URLInputSection: React.FC<URLInputSectionProps> = ({
  urls,
  onURLsChange,
  disabled = false
}) => {
  const [inputValue, setInputValue] = useState('');
  const [urlCount, setUrlCount] = useState(0);

  useEffect(() => {
    setUrlCount(urls.length);
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

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      const currentText = inputValue;
      const newText = currentText ? `${currentText}\n${text}` : text;
      
      setInputValue(newText);
      
      const parsedUrls = parseURLs(newText);
      onURLsChange(parsedUrls);
      
      // 번호 추가
      setTimeout(() => {
        const numberedText = addNumbersToText(newText);
        setInputValue(numberedText);
      }, 100);
    } catch (error) {
      console.error('클립보드 읽기 실패:', error);
    }
  };

  const getUrlCountColor = () => {
    if (urlCount === 0) return 'default';
    if (urlCount > 10) return 'error';
    return 'success';
  };

  return (
    <Paper sx={{ p: 3 }}>
      {/* 헤더 */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <LinkIcon color="primary" />
          <Typography variant="h6" fontWeight="bold">
            YouTube URL 입력
          </Typography>
        </Box>
        
        <Chip
          label={`${urlCount}/10`}
          color={getUrlCountColor()}
          size="small"
        />
      </Box>

      {/* 안내 메시지 */}
      <Alert severity="info" sx={{ mb: 2 }}>
        💡 URL을 복사한 후 Ctrl+V로 붙여넣기하면 자동으로 다운로드 큐에 추가됩니다.
      </Alert>

      {/* URL 입력 필드 */}
      <TextField
        multiline
        rows={6}
        fullWidth
        value={inputValue}
        onChange={handleInputChange}
        disabled={disabled}
        placeholder="여기에 YouTube URL을 입력하세요...&#10;&#10;예시:&#10;https://www.youtube.com/watch?v=VIDEO_ID&#10;https://youtu.be/VIDEO_ID"
        variant="outlined"
        sx={{
          '& .MuiOutlinedInput-root': {
            fontFamily: 'monospace',
            fontSize: '0.9rem',
            '&:hover fieldset': {
              borderColor: 'primary.main',
            },
          },
        }}
        InputProps={{
          endAdornment: (
            <Box sx={{ position: 'absolute', top: 8, right: 8 }}>
              <Chip
                icon={<PasteIcon />}
                label="붙여넣기"
                onClick={handlePaste}
                size="small"
                clickable
                disabled={disabled}
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
    </Paper>
  );
};

export default URLInputSection;