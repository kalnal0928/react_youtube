# YouTube Downloader - 빌드 및 배포 가이드

## 📦 배포 준비사항

### 1. 필수 파일 확인
- `bin/yt-dlp.exe` - yt-dlp 실행 파일이 bin 폴더에 있어야 합니다
- `assets/icon.ico` (Windows용 아이콘)
- `assets/icon.png` (Linux용 아이콘)
- `assets/icon.icns` (Mac용 아이콘)

### 2. FFmpeg 안내
- FFmpeg는 사용자가 직접 설치해야 합니다
- 앱 내에서 FFmpeg 설치 안내 제공

## 🔨 빌드 명령어

### Windows 실행 파일 빌드
```bash
npm run dist:win
```
- 결과물: `release/YouTube Downloader Setup 3.0.0.exe`
- NSIS 인스톨러 생성

### Mac 앱 빌드
```bash
npm run dist:mac
```
- 결과물: `release/YouTube Downloader-3.0.0.dmg`

### Linux 앱 빌드
```bash
npm run dist:linux
```
- 결과물: `release/YouTube Downloader-3.0.0.AppImage`

### 모든 플랫폼 빌드
```bash
npm run dist
```

## 📋 빌드 전 체크리스트

1. ✅ 모든 기능 테스트 완료
2. ✅ `bin/yt-dlp.exe` 파일 존재 확인
3. ✅ package.json의 버전 업데이트
4. ✅ 아이콘 파일 준비 (선택사항)
5. ✅ 의존성 설치 확인: `npm install`
6. ✅ 프로덕션 빌드 테스트: `npm run build`

## 🚀 빌드 과정

### 1단계: 프로젝트 빌드
```bash
npm run build
```
- TypeScript → JavaScript 컴파일
- React 앱 번들링
- dist 폴더에 결과물 생성

### 2단계: Electron 앱 패키징
```bash
npm run dist:win
```
- Electron 앱 패키징
- 인스톨러 생성
- release 폴더에 배포 파일 생성

## 📁 빌드 결과물

```
release/
├── YouTube Downloader Setup 3.0.0.exe  (Windows 인스톨러)
├── win-unpacked/                        (압축 해제된 앱)
└── builder-debug.yml                    (디버그 정보)
```

## 🎯 배포 방법

### 방법 1: 직접 배포
1. `release/YouTube Downloader Setup 3.0.0.exe` 파일을 사용자에게 전달
2. 사용자가 실행하여 설치

### 방법 2: GitHub Releases
1. GitHub 저장소에 릴리스 생성
2. 빌드된 파일 업로드
3. 릴리스 노트 작성

### 방법 3: 자동 업데이트 (고급)
- electron-updater 설정 필요
- 서버에 업데이트 파일 호스팅

## ⚙️ 빌드 설정 커스터마이징

### package.json의 build 섹션 수정

```json
"build": {
  "appId": "com.youtube-downloader.electron",
  "productName": "YouTube Downloader",
  "win": {
    "target": "nsis",
    "icon": "assets/icon.ico"
  }
}
```

### 인스톨러 옵션 추가
- 시작 메뉴 바로가기
- 데스크톱 바로가기
- 자동 실행 옵션

## 🐛 문제 해결

### 빌드 실패 시
```bash
# 캐시 정리
npm run clean

# 의존성 재설치
rm -rf node_modules
npm install

# 다시 빌드
npm run build
npm run dist:win
```

### yt-dlp.exe 경로 오류
- `bin/yt-dlp.exe` 파일이 있는지 확인
- extraResources 설정 확인

### 아이콘이 표시되지 않음
- `assets/icon.ico` 파일 확인
- 256x256 크기 권장

## 📝 버전 관리

### 버전 업데이트
```bash
# package.json의 version 수정
"version": "3.0.1"
```

### 변경 사항 기록
- CHANGELOG.md 파일 작성
- 릴리스 노트 준비

## 🔐 코드 서명 (선택사항)

Windows 앱에 디지털 서명을 추가하면 SmartScreen 경고를 줄일 수 있습니다.

```json
"win": {
  "certificateFile": "path/to/certificate.pfx",
  "certificatePassword": "password"
}
```

## 📊 빌드 크기 최적화

### 불필요한 파일 제외
```json
"files": [
  "dist/**/*",
  "!dist/**/*.map",
  "!**/*.ts"
]
```

### node_modules 최적화
- 프로덕션 의존성만 포함
- devDependencies는 자동 제외

## 🎉 배포 완료!

빌드가 완료되면:
1. `release` 폴더에서 인스톨러 확인
2. 다른 PC에서 설치 테스트
3. 모든 기능 정상 작동 확인
4. 사용자에게 배포

---

## 빠른 시작

```bash
# 1. 빌드
npm run build

# 2. Windows 배포 파일 생성
npm run dist:win

# 3. release 폴더에서 인스톨러 확인
```

완료! 🚀
