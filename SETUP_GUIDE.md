# 🚀 YouTube Downloader 실행 가이드

## 1단계: 필수 파일 다운로드

### yt-dlp.exe (필수)
1. https://github.com/yt-dlp/yt-dlp/releases/latest 방문
2. **yt-dlp.exe** 파일 다운로드
3. `bin/` 폴더에 저장

### FFmpeg (선택사항 - 고급 기능용)

**방법 1: 시스템 PATH에 설치 (권장)**
1. https://www.gyan.dev/ffmpeg/builds/ 방문
2. **release builds** → **ffmpeg-release-essentials.zip** 다운로드
3. 압축 해제 (예: `C:\ffmpeg\`)
4. 시스템 환경변수 PATH에 `C:\ffmpeg\bin` 추가
   - Windows 검색 → "환경 변수" → "시스템 환경 변수 편집"
   - "환경 변수" → "시스템 변수" → "Path" 선택 → "편집"
   - "새로 만들기" → `C:\ffmpeg\bin` 입력
5. 명령 프롬프트에서 `ffmpeg -version` 실행하여 확인

**방법 2: 간단 설치 (winget 사용)**
```bash
# PowerShell 관리자 권한으로 실행
winget install FFmpeg
```

**방법 3: 프로젝트 폴더에 직접 배치**
1. FFmpeg 다운로드 후 압축 해제
2. `bin/` 폴더에 다음 파일들 복사:
   - `ffmpeg.exe`
   - `ffprobe.exe`
   - 모든 `.dll` 파일들

## 2단계: 실행 방법

### 개발 모드 (권장)
```bash
npm run dev
```
- React 개발 서버 + Electron이 동시에 실행됩니다
- 코드 변경 시 자동으로 새로고침됩니다

### 프로덕션 모드
```bash
# 1. 빌드
npm run build

# 2. 실행
npm run electron
```

## 3단계: 배포용 패키지 생성

```bash
# Windows 실행 파일 생성
npm run dist:win

# 생성된 파일 위치: release/ 폴더
```

## 문제 해결

### "yt-dlp.exe를 찾을 수 없습니다" 오류
- `bin/yt-dlp.exe` 파일이 있는지 확인
- 파일 이름이 정확한지 확인 (대소문자 구분)

### FFmpeg 관련 오류
- **FFmpeg는 선택사항**입니다
- **FFmpeg 없이 사용 가능한 옵션:**
  - ✅ 최고 품질 (단일 파일) - 권장
  - ✅ 720p HD
  - ✅ 480p
- **FFmpeg 필요한 옵션:**
  - ⚠️ 최고 품질 (병합)
  - ⚠️ 음성만 (MP3)

### FFmpeg 설치 확인 방법
```bash
# 명령 프롬프트에서 실행
ffmpeg -version
```
- 버전 정보가 표시되면 정상 설치
- "'ffmpeg'은(는) 내부 또는 외부 명령..." 오류 시 설치 필요