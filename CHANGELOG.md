# Changelog

All notable changes to this project will be documented in this file.

## [3.0.0] - 2024-11-07

### Added
- 🎉 **완전한 Electron + React 포팅** - Python/Tkinter에서 현대적인 웹 기술로 전환
- 🎨 **Material-UI 기반 현대적인 UI** - 세련되고 직관적인 사용자 인터페이스
- ⚡ **부드러운 애니메이션** - Framer Motion을 활용한 자연스러운 전환 효과
- 🔄 **동적 큐 시스템** - 다운로드 중에도 새로운 URL 추가 가능
- 📊 **실시간 진행률 표시** - 개별 및 전체 다운로드 진행률 실시간 모니터링
- 🎛️ **향상된 설정 옵션** - 직관적인 품질 선택 및 경로 설정
- 📝 **스마트 URL 입력** - 자동 번호 매기기 및 유효성 검증
- 🔔 **시스템 알림** - 다운로드 완료 시 데스크톱 알림
- 📁 **폴더 바로 열기** - 다운로드 완료 후 결과 폴더 즉시 접근
- 🛡️ **향상된 보안** - Context Isolation 및 안전한 IPC 통신

### Technical Improvements
- **TypeScript** - 타입 안전성 및 개발 생산성 향상
- **Webpack 5** - 최신 번들링 시스템
- **Electron 27+** - 최신 Electron 프레임워크
- **React 18** - 최신 React 기능 활용
- **크로스 플랫폼 지원** - Windows, macOS, Linux 모두 지원

### Migration from v2.x
- Python/CustomTkinter → Electron/React
- 동일한 yt-dlp 엔진 유지로 기존 기능 완전 호환
- 향상된 UI/UX로 사용성 대폭 개선
- 더 빠른 성능 및 안정성

---

## Previous Versions (Python/Tkinter)

### [2.1] - 2024-10-XX
- CustomTkinter 기반 UI 개선
- 동적 큐 시스템 추가
- FFmpeg 자동 감지 기능
- 다중 URL 동시 다운로드 지원

### [2.0] - 2024-09-XX
- CustomTkinter로 UI 전면 개편
- yt-dlp 통합
- 실시간 진행률 표시
- 로그 시스템 개선

### [1.0] - 2024-08-XX
- 초기 Python/Tkinter 버전
- 기본 YouTube 다운로드 기능
- 품질 선택 옵션
- 간단한 GUI 인터페이스