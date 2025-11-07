# 🎬 FFmpeg 설치 가이드

FFmpeg는 YouTube Downloader의 고급 기능(고품질 병합, 음성 추출)을 위한 선택적 구성 요소입니다.

## 🤔 FFmpeg가 필요한 기능

### ✅ FFmpeg 없이 사용 가능
- **최고 품질 (단일 파일)** - 권장 ⭐
- **720p HD**
- **480p**

### ⚠️ FFmpeg 필요
- **최고 품질 (병합)** - 비디오와 오디오를 별도로 다운로드 후 병합
- **음성만 (MP3)** - 비디오에서 음성만 추출

## 🚀 설치 방법

### 방법 1: winget 사용 (가장 쉬움) ⭐

1. **PowerShell을 관리자 권한으로 실행**
   - Windows 키 + X → "Windows PowerShell(관리자)"

2. **FFmpeg 설치**
   ```powershell
   winget install FFmpeg
   ```

3. **설치 확인**
   ```powershell
   ffmpeg -version
   ```

### 방법 2: 수동 설치

1. **FFmpeg 다운로드**
   - https://www.gyan.dev/ffmpeg/builds/ 방문
   - **release builds** 섹션에서 **ffmpeg-release-essentials.zip** 다운로드

2. **압축 해제**
   - 다운로드한 파일을 `C:\ffmpeg\`에 압축 해제
   - 결과: `C:\ffmpeg\bin\ffmpeg.exe` 파일이 생성됨

3. **환경변수 PATH 설정**
   - Windows 검색 → "환경 변수" 입력
   - "시스템 환경 변수 편집" 클릭
   - "환경 변수" 버튼 클릭
   - "시스템 변수" 섹션에서 "Path" 선택 → "편집"
   - "새로 만들기" → `C:\ffmpeg\bin` 입력
   - "확인" 클릭하여 모든 창 닫기

4. **설치 확인**
   - 새 명령 프롬프트 열기
   ```cmd
   ffmpeg -version
   ```

### 방법 3: Chocolatey 사용

1. **Chocolatey 설치** (이미 설치된 경우 생략)
   ```powershell
   Set-ExecutionPolicy Bypass -Scope Process -Force; [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072; iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))
   ```

2. **FFmpeg 설치**
   ```powershell
   choco install ffmpeg
   ```

## 🔍 설치 확인 방법

### 성공적인 설치
```cmd
C:\> ffmpeg -version
ffmpeg version 6.0-full_build-www.gyan.dev Copyright (c) 2000-2023 the FFmpeg developers
built with gcc 12.2.0 (Rev10, Built by MSYS2 project)
configuration: --enable-gpl --enable-version3 --enable-static ...
```

### 설치 실패
```cmd
C:\> ffmpeg -version
'ffmpeg'은(는) 내부 또는 외부 명령, 실행할 수 있는 프로그램, 또는 배치 파일이 아닙니다.
```

## 🛠️ 문제 해결

### Q: "ffmpeg을 찾을 수 없습니다" 오류
**A:** 환경변수 PATH 설정을 확인하세요.
1. 명령 프롬프트에서 `echo %PATH%` 실행
2. FFmpeg bin 폴더 경로가 포함되어 있는지 확인
3. 없다면 환경변수 설정을 다시 확인

### Q: 설치했는데도 YouTube Downloader에서 인식하지 못함
**A:** 앱을 완전히 종료하고 다시 시작하세요.
1. YouTube Downloader 완전 종료
2. 명령 프롬프트에서 `ffmpeg -version` 확인
3. YouTube Downloader 재시작

### Q: winget을 사용할 수 없음
**A:** Windows 10 버전 1709 이상 또는 Windows 11이 필요합니다.
- 구버전 Windows: 방법 2(수동 설치) 사용

### Q: 관리자 권한이 없음
**A:** 방법 2를 사용하되, 사용자 폴더에 설치하세요.
1. `C:\Users\[사용자명]\ffmpeg\`에 압축 해제
2. 사용자 환경변수 PATH에 추가

## 💡 추가 팁

### FFmpeg 없이도 충분한 경우
- 대부분의 사용자는 **"최고 품질 (단일 파일)"** 옵션으로 충분합니다
- 이 옵션은 FFmpeg 없이도 고품질 다운로드가 가능합니다

### FFmpeg가 꼭 필요한 경우
- 비디오와 오디오를 최고 품질로 따로 다운로드 후 병합하고 싶은 경우
- YouTube 비디오에서 음성만 MP3로 추출하고 싶은 경우

### 포터블 설치
프로그램과 함께 FFmpeg를 배포하고 싶다면:
1. FFmpeg 압축 해제
2. `bin/` 폴더에 다음 파일들 복사:
   - `ffmpeg.exe`
   - `ffprobe.exe`
   - 모든 `.dll` 파일들

---

**도움이 필요하시면 GitHub Issues에 문의해주세요!** 🙋‍♂️