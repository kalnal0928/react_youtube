# YouTube Downloader - Electron Edition

![Version](https://img.shields.io/badge/version-3.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![Platform](https://img.shields.io/badge/platform-Windows%20%7C%20macOS%20%7C%20Linux-lightgrey.svg)

기존 Python/Tkinter 기반 YouTube Downloader를 Electron + React + TypeScript로 완전히 리뉴얼한 현대적인 데스크톱 애플리케이션입니다.

## ✨ 주요 특징

### 🎨 현대적인 UI/UX
- **Material-UI 기반** 세련된 인터페이스
- **반응형 디자인** - 다양한 화면 크기 지원
- **부드러운 애니메이션** - Framer Motion 적용
- **다크/라이트 모드** 지원 (향후 추가 예정)

### 🚀 강력한 기능
- **최대 10개 URL 동시 다운로드**
- **동적 큐 시스템** - 다운로드 중에도 URL 추가 가능
- **실시간 진행률 표시** - 개별 및 전체 진행률
- **자동 URL 번호 매기기**
- **스마트 붙여넣기** - Ctrl+V로 즉시 큐 추가

### 🎛️ 다양한 품질 옵션
- 최고 품질 (단일 파일) - 권장
- 최고 품질 (병합) - FFmpeg 필요
- 720p HD
- 480p
- 음성만 (MP3) - FFmpeg 필요

### 🔧 편의 기능
- **FFmpeg 자동 감지** 및 상태 표시
- **폴더 선택** 및 **바로 열기**
- **실시간 로그** 표시
- **시스템 알림** 지원
- **다운로드 중단** 기능

## 📦 설치 및 실행

### 개발 환경 설정

1. **저장소 클론**
   ```bash
   git clone <repository-url>
   cd youtube-downloader-electron
   ```

2. **의존성 설치**
   ```bash
   npm install
   ```

3. **필수 바이너리 파일 다운로드**
   
   `bin/` 폴더에 다음 파일들을 배치하세요:
   
   - **yt-dlp.exe** (필수)
     - 다운로드: https://github.com/yt-dlp/yt-dlp/releases/latest
     - Windows용 실행 파일을 다운로드
   
   - **ffmpeg.exe** (선택사항 - 고급 기능용)
     - 다운로드: https://ffmpeg.org/download.html
     - Windows 빌드를 다운로드

4. **개발 서버 실행**
   ```bash
   npm run electron:dev
   ```

### 프로덕션 빌드

1. **빌드**
   ```bash
   npm run build
   ```

2. **Electron 앱 실행**
   ```bash
   npm run electron
   ```

3. **배포용 패키지 생성**
   ```bash
   # Windows
   npm run dist:win
   
   # macOS
   npm run dist:mac
   
   # Linux
   npm run dist:linux
   
   # 모든 플랫폼
   npm run dist
   ```

## 🛠️ 기술 스택

### 프론트엔드
- **React 18+** - UI 라이브러리
- **TypeScript** - 타입 안전성
- **Material-UI (MUI)** - UI 컴포넌트
- **Framer Motion** - 애니메이션
- **Emotion** - CSS-in-JS

### 데스크톱 프레임워크
- **Electron 27+** - 크로스 플랫폼 데스크톱 앱
- **Electron Builder** - 앱 패키징 및 배포

### 빌드 도구
- **Webpack 5** - 모듈 번들러
- **TypeScript Compiler** - 타입스크립트 컴파일
- **ts-loader** - Webpack TypeScript 로더

### 외부 도구
- **yt-dlp.exe** - YouTube 다운로드 엔진
- **FFmpeg** - 비디오/오디오 처리 (선택사항)

## 📁 프로젝트 구조

```
youtube-downloader-electron/
├── src/
│   ├── main/                 # Electron 메인 프로세스
│   │   ├── main.ts          # 메인 프로세스 엔트리포인트
│   │   └── preload.ts       # 프리로드 스크립트
│   └── renderer/            # React 렌더러 프로세스
│       ├── components/      # React 컴포넌트
│       │   ├── Header.tsx
│       │   ├── URLInputSection.tsx
│       │   ├── SettingsSection.tsx
│       │   ├── ControlSection.tsx
│       │   ├── ProgressSection.tsx
│       │   └── LogSection.tsx
│       ├── App.tsx          # 메인 앱 컴포넌트
│       ├── index.tsx        # 렌더러 엔트리포인트
│       └── index.html       # HTML 템플릿
├── assets/                  # 앱 아이콘 및 리소스
├── bin/                     # 외부 바이너리 파일
├── dist/                    # 빌드 출력
├── release/                 # 배포 패키지 출력
├── package.json
├── webpack.config.js
├── tsconfig.json
└── README.md
```

## 🎮 사용법

### 기본 다운로드
1. YouTube URL을 입력 필드에 입력 (최대 10개)
2. 품질 설정 선택
3. 다운로드 경로 설정
4. "다운로드 시작" 버튼 클릭

### 고급 기능
- **스마트 붙여넣기**: URL 복사 후 Ctrl+V로 즉시 추가
- **동적 큐**: 다운로드 중에도 새 URL 추가 가능
- **실시간 모니터링**: 진행률과 로그를 실시간으로 확인
- **폴더 바로 열기**: 다운로드 완료 후 폴더 바로 열기

## ⚙️ 설정

### FFmpeg 설치 (선택사항)
고품질 병합 및 음성 추출을 위해 FFmpeg 설치를 권장합니다:

**방법 1: 자동 설치 (권장)**
```bash
# PowerShell 관리자 권한으로 실행
winget install FFmpeg
```

**방법 2: 수동 설치**
1. https://www.gyan.dev/ffmpeg/builds/ 방문
2. **release builds** → **ffmpeg-release-essentials.zip** 다운로드
3. 압축 해제 (예: `C:\ffmpeg\`)
4. 시스템 환경변수 PATH에 `C:\ffmpeg\bin` 추가
5. 명령 프롬프트에서 `ffmpeg -version`으로 확인
6. 앱 재시작

**FFmpeg 없이도 사용 가능:**
- 최고 품질 (단일 파일), 720p, 480p 다운로드는 FFmpeg 없이도 작동합니다.

### 지원되는 URL 형식
- `https://www.youtube.com/watch?v=VIDEO_ID`
- `https://youtu.be/VIDEO_ID`
- `https://www.youtube.com/playlist?list=PLAYLIST_ID`
- `https://www.youtube.com/shorts/VIDEO_ID`
- `https://m.youtube.com/watch?v=VIDEO_ID`

## 🔒 보안

- **Context Isolation** 활성화
- **Node Integration** 비활성화
- **Preload 스크립트**를 통한 안전한 API 노출
- **IPC 통신**으로 프로세스 간 안전한 데이터 교환

## 📋 시스템 요구사항

### 최소 요구사항
- **Windows 10** 이상
- **4GB RAM**
- **500MB** 여유 디스크 공간
- **인터넷 연결**

### 권장 요구사항
- **Windows 11**
- **8GB RAM** 이상
- **SSD** 저장장치
- **고속 인터넷 연결**

## 🐛 문제 해결

### 일반적인 문제

**Q: FFmpeg 오류가 발생합니다**
A: FFmpeg를 설치하고 시스템 PATH에 추가하거나, FFmpeg가 필요하지 않은 품질 옵션을 선택하세요.

**Q: yt-dlp.exe를 찾을 수 없다는 오류**
A: `bin/` 폴더에 yt-dlp.exe 파일이 있는지 확인하세요.

**Q: 다운로드가 실패합니다**
A: URL이 유효한지 확인하고, 인터넷 연결을 확인하세요.

**Q: 앱이 시작되지 않습니다**
A: Node.js와 npm이 최신 버전인지 확인하고, `npm install`을 다시 실행하세요.

## 🤝 기여하기

1. 저장소를 포크합니다
2. 기능 브랜치를 생성합니다 (`git checkout -b feature/AmazingFeature`)
3. 변경사항을 커밋합니다 (`git commit -m 'Add some AmazingFeature'`)
4. 브랜치에 푸시합니다 (`git push origin feature/AmazingFeature`)
5. Pull Request를 생성합니다

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다. 자세한 내용은 `LICENSE` 파일을 참조하세요.

## 🙏 감사의 말

- **yt-dlp** - 강력한 YouTube 다운로드 엔진
- **FFmpeg** - 비디오/오디오 처리 라이브러리
- **Electron** - 크로스 플랫폼 데스크톱 앱 프레임워크
- **React** - 사용자 인터페이스 라이브러리
- **Material-UI** - React UI 컴포넌트 라이브러리

## 📞 지원

문제가 발생하거나 제안사항이 있으시면 GitHub Issues를 통해 연락해주세요.

---

**YouTube Downloader v3.0.0** - 현대적이고 강력한 YouTube 다운로드 솔루션