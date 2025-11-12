import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Divider,
  Link
} from '@mui/material';
import {
  Info as InfoIcon,
  Code as CodeIcon,
  GitHub as GitHubIcon
} from '@mui/icons-material';

interface AboutDialogProps {
  open: boolean;
  onClose: () => void;
}

const AboutDialog: React.FC<AboutDialogProps> = ({ open, onClose }) => {
  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: 1,
        bgcolor: 'primary.main',
        color: 'white'
      }}>
        <InfoIcon />
        <Typography variant="h6" fontWeight="bold">
          프로그램 정보
        </Typography>
      </DialogTitle>

      <DialogContent sx={{ mt: 2 }}>
        {/* 프로그램 정보 */}
        <Box sx={{ textAlign: 'center', mb: 3 }}>
          <Typography variant="h4" fontWeight="bold" color="primary" gutterBottom>
            YouTube Downloader
          </Typography>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            버전 3.0.0
          </Typography>
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* 제작자 정보 */}
        <Box sx={{ mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
            <CodeIcon color="primary" />
            <Typography variant="subtitle1" fontWeight="bold">
              제작자
            </Typography>
          </Box>
          <Typography variant="h6" color="primary.main" sx={{ ml: 4 }}>
            코드깎는 국어쌤
          </Typography>
        </Box>

        {/* 라이선스 */}
        <Box sx={{ mt: 3, p: 2, bgcolor: 'grey.100', borderRadius: 1 }}>
          <Typography variant="caption" color="text.secondary">
            © 2024 코드깎는 국어쌤. All rights reserved.
          </Typography>
          <br />
          <Typography variant="caption" color="text.secondary">
            이 소프트웨어는 MIT 라이선스 하에 배포됩니다.
          </Typography>
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose} variant="contained" color="primary">
          닫기
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AboutDialog;
