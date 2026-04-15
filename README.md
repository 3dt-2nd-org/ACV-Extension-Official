작성 : 2026-04-15, 20:30

# ACV v4

YouTube 영상의 자막과 메타데이터를 수집해 서버 분석 결과를 표시하는 Chrome 확장프로그램입니다.

## 개요

ACV v4는 YouTube `watch` 페이지에서 동작합니다.

- `inject.js`가 YouTube 플레이어 응답과 `api/timedtext` 요청을 가로챕니다.
- `content.js`가 자막/메타데이터를 서버로 전송하고 SSE 결과를 받아 UI를 렌더링합니다.
- 분석 결과는 배지, 리포트 패널, 오버레이 형태로 표시됩니다.

현재 코드에는 광고 자막 오인 업로드, 홈 화면 복귀 시 UI 잔존, 자막 버튼 재시도 루프 같은 주요 이슈에 대한 안정화 로직이 반영되어 있습니다.

## 주요 기능

- YouTube 영상 메타데이터 수집
- YouTube 자막 요청(`api/timedtext`) 가로채기
- 자막 데이터 서버 업로드
- SSE 기반 분석 진행 상태 수신
- 배지/패널/오버레이 UI 렌더링
- 우측 리포트 패널에 `리포트 요약`, `제목`, `채널명`을 별도 메타 블록으로 표시
- 서버 판단 결과를 `ACV 등급`으로 표시
- 광고 재생 중 자막 데이터 필터링
- 본편 영상 ID 기준 자막 정합성 검증
- 홈 화면 이동 시 이전 분석 결과 자동 정리

## 동작 구조

### 1. 콘텐츠 스크립트 로드

- `content.js`가 YouTube 페이지에 주입됩니다.
- `inject.js`를 페이지 컨텍스트에 삽입합니다.
- 분석 UI를 초기화합니다.

### 2. 플레이어/자막 요청 가로채기

`inject.js`가 아래 요청을 감지합니다.

- `/youtubei/v1/player`
- `api/timedtext`
- Fetch
- XHR

이 과정에서 다음 데이터를 관리합니다.

- `videoId`
- `title`
- `description`
- `channel_id`
- `channel_title`
- `published_at`
- `tags`

### 3. 광고 자막 필터링

현재 광고 관련 안정화 로직은 아래 순서로 동작합니다.

- 플레이어 클래스와 광고 UI를 기준으로 광고 상태를 판별합니다.
- 자막 요청의 `requestVideoId`와 현재 페이지/플레이어의 영상 ID를 비교합니다.
- 광고 중이더라도 본편 영상 자막으로 판단되면 payload를 통과시킵니다.
- 광고 자막으로 보이면 차단하거나 재시도 힌트를 보냅니다.
- 메인 영상 ID가 아직 완전히 확정되지 않았더라도 `page v`와 요청 ID가 같으면 임시 메인 영상 ID로 처리합니다.

### 4. 메시지 브리지

`inject.js`는 다음 메시지를 `window.postMessage`로 전달합니다.

- `YT_SUB_DATA`
  - 자막 payload
  - 메타데이터
  - `requestVideoId`
  - `resolvedVideoId`
  - `pageVideoId`
  - `playerVideoId`
  - `isAd`
  - `timestamp`
- `YT_SUB_RETRY_HINT`
  - 광고 재생 중
  - 메인 영상 미확정
  - timedtext 파싱 실패
  - 빈 자막 응답
  - videoId mismatch

### 5. 서버 연동

`content.js`는 아래 엔드포인트를 사용합니다.

- `POST /api/subtitles/:videoId`
- `GET /api/stream/:videoId` via `EventSource`

기본 서버 주소:

```text
https://acv-project.koreacentral.cloudapp.azure.com
```

### 6. 분석 UI 렌더링

분석 결과는 다음 형태로 보여줍니다.

- 상단 배지
- 우측 리포트 패널 (`리포트 요약` / `제목` / `채널명` 블록)
- 중앙 경고/안내 오버레이

우측 리포트 패널은 `ACV 등급`을 함께 보여주며, 블록별 배경이 통일된 스타일로 구성됩니다.

## 상태값

현재 UI는 아래 상태를 사용합니다.

- `분석 중`
- `안심`
- `주의`
- `의심`
- `재검토`
- `오류`

`재검토`는 서버 응답이 불완전하거나, 분석 결과가 애매하거나, 자막 업로드 전에 fallback 결과가 먼저 도착했을 때 표시될 수 있는 중간 상태입니다.

## 최근 안정화 작업

### 광고 자막 오인 업로드 방지

- 광고 재생 중 자막 차단 로직 강화
- `requestVideoId` / `playerVideoId` / `pageVideoId` 정합성 검증 강화
- 본편 자막은 광고 중이어도 통과 가능하도록 예외 처리
- 메인 영상 미확정 시 provisional video id 사용
- 보류 중인 자막 payload flush 로직 보강

### timedtext 파싱 안정화

- JSON 응답 외에 XML/Text 형식도 처리
- 빈 응답/파싱 실패 시 재시도 힌트 전송

### 자막 추출 재시도 안정화

- 자막 버튼 강제 토글 로직 개선
- 중복 재시도 루프 방지
- 자막 업로드 성공 시 추출 루프 즉시 종료
- 업로드 실패 시 일부 HTTP 상태코드에 대해 재시도

재시도 대상 상태코드:

- `408`
- `425`
- `429`
- `500`
- `502`
- `503`
- `504`

### UI 정리

- 홈 화면으로 돌아갈 때 이전 영상 분석 결과 제거
- `watch` 페이지가 아니면 세션과 UI 자동 제거
- 우측 리포트 패널에 `리포트 요약`, `제목`, `채널명`을 별도 블록으로 표시하도록 개선됨
- `panelMeta` 업데이트 시 제목/채널명 정보가 지워지지 않도록 유지 로직 추가

### 확장프로그램 로드 오류 방지

- Azurite 임시 파일이 루트에 생기면 Chrome이 unpacked extension 로드를 거부할 수 있습니다.
- `.gitignore`는 Git 오염 방지용이며, Chrome 로드 오류를 직접 막지는 않습니다.
- 아래 파일/폴더가 루트에 생기지 않도록 주의해야 합니다.

```text
__azurite_db_*.json
__queuestorage__/
```

## 설치 방법

1. `chrome://extensions`를 엽니다.
2. `개발자 모드`를 켭니다.
3. `압축해제된 확장 프로그램 로드`를 선택합니다.
4. 이 저장소 루트 폴더 `ACV-v3`를 선택합니다.

## 개발 시 반영 방법

코드 수정 시 확장프로그램을 반드시 끌 필요는 없습니다.

권장 절차:

1. 코드 수정
2. `chrome://extensions`에서 확장프로그램 새로고침
3. YouTube 탭 새로고침 또는 새 탭으로 재오픈

특히 아래 파일을 수정하면 확장프로그램 새로고침이 필요합니다.

- `content.js`
- `inject.js`
- `manifest.json`
- `popup.html`
- `style.css`

## 검증 방법

문법 확인:

```powershell
node --check content.js
node --check inject.js
```

확인 권장 시나리오:

- 광고가 붙는 영상
- 광고 없이 바로 시작하는 영상
- 자막이 늦게 뜨는 영상
- 홈 화면으로 돌아갔다가 다시 다른 영상으로 진입하는 흐름
- `재검토`가 뜨는 영상

## 자주 보는 콘솔 로그

정상 흐름에서 자주 볼 수 있는 로그:

```text
[EXT-CONTENT] Bridge Loaded
[EXT-INJECT] Interceptor Active
[EXT-INJECT] Metadata cache refreshed [videoId]
[EXT-INJECT] Subtitle XHR Detected! [videoId]
[EXT-INJECT] Allowing main-video subtitle payload during ad playback.
[EXT-INJECT] Using provisional main video id for subtitle payload.
[EXT-CONTENT] Final analysis received
```

재시도/보호 로직 관련 로그:

```text
[EXT-INJECT] Deferring main-video subtitle payload until ad playback ends.
[EXT-INJECT] Skip subtitle payload during ad playback.
[EXT-INJECT] Empty timedtext payload (XHR)
[EXT-INJECT] Timedtext Parse Error (Fetch|XHR)
[EXT-CONTENT] Retrying subtitle extraction.
[EXT-CONTENT] Ignored subtitle payload.
```

## 트러블슈팅

### 1. 확장프로그램이 로드되지 않음

확인할 것:

- 루트 폴더에 Azurite 임시 파일이 없는지
- `manifest.json` 문법이 깨지지 않았는지
- `content.js`, `inject.js` 문법 오류가 없는지

### 2. 계속 `자막 버튼을 찾고 있습니다`에서 멈춤

가능한 원인:

- 광고 재생 중으로 계속 판정되는 경우
- 메인 영상 ID 확정이 늦는 경우
- 자막 버튼이 실제로 늦게 렌더링되는 경우

확인 로그:

- `Subtitle payload dropped before main video was confirmed.`
- `Retrying subtitle extraction.`
- `Allowing main-video subtitle payload during ad playback.`
- `Using provisional main video id for subtitle payload.`

### 3. 정상 영상인데 `0점` 또는 `재검토`가 뜸

가능한 원인:

- 광고 자막이 본편 자막으로 잘못 업로드된 경우
- 자막 업로드 전에 SSE `complete`가 먼저 도착한 경우
- timedtext 응답이 비어 있거나 파싱 실패한 경우

### 4. 홈으로 갔는데 이전 분석 결과가 남아 있음

현재는 `watch` 페이지 이탈 시 UI를 제거하도록 수정되어 있습니다.
증상이 계속되면 확장프로그램 새로고침 후 다시 확인합니다.

## 프로젝트 구조

```text
ACV-v4/
|-- manifest.json
|-- content.js
|-- inject.js
|-- style.css
|-- popup.html
|-- report.html
|-- .gitignore
|-- README.md
|-- DEVLOG_*.md
```

## 관련 문서

- `DEVLOG_2026-04-14_ad-subtitle-fix.md`
- `DEVLOG_2026-04-14_ad-subtitle-fix-final.md`
- `DEVLOG_2026-04-14_gitignore-azurite.md`
- `DEVLOG_2026-04-15_panel-ui-update.md`
- `DEVLOG_2026-04-16_manual-subtitle-422-followup.md`

## 참고

- 이 프로젝트는 YouTube UI/네트워크 구조 변화에 영향을 받을 수 있습니다.
- 광고가 있는 영상은 일반 영상보다 타이밍 이슈가 많아서 브라우저 수동 재현 테스트가 중요합니다.
