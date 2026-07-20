# Green Loop — SDGs UNO (Firebase 멀티플레이)

SK온 × 단국대학교 환경 리빙랩 프로젝트용 실시간 멀티플레이 SDGs UNO 앱.

## 로컬에서 실행하기

```bash
npm install
npm run dev
```

터미널에 뜨는 주소(예: http://localhost:5173)로 접속. 같은 와이파이의 다른 기기에서
`http://<내 컴퓨터 IP>:5173` 으로 접속하면 각자 폰으로 테스트 가능 (`vite.config.js`에
`host: true` 설정되어 있음).

## Firestore 보안 규칙 적용하기 (배포 전 필수)

1. Firebase 콘솔 → Firestore Database → **규칙** 탭
2. 이 프로젝트의 `firestore.rules` 파일 내용을 복사해서 붙여넣고 **게시**
3. 지금까지는 "테스트 모드"(전체 공개, 30일 후 만료)였는데, 이 규칙을 적용하면:
   - 로그인(익명 포함)한 사용자만 읽기/쓰기 가능
   - 각자 카드 패(hand)는 본인만 조회 가능 (다른 플레이어는 카드 개수만 볼 수 있음)
   - 같은 방 참가자끼리는 게임 진행을 위해 서로의 handCount, hand에 쓰기 가능
     (오염+2, 탄소폭탄 카드 효과로 상대에게 카드를 지급하기 위함)

> 참고: 이 구조는 클라이언트가 직접 Firestore에 쓰는 방식이라 완전한 부정행위
> 방지는 안 됩니다 (같은 방 친구끼리 하는 게임이라 실용적으로 충분한 수준).
> 완전히 막으려면 Cloud Functions로 게임 로직을 서버에서 검증해야 해요.

## 배포하기 (Firebase Hosting)

```bash
npm install -g firebase-tools
firebase login
npm run build
firebase init hosting   # public directory: dist, SPA: yes
firebase deploy
```

## 폴더 구조

```
src/
  firebase.js       Firebase 초기화 (config, 익명 로그인)
  gameLogic.js       덱 생성, 카드 규칙, CO2 계산
  App.jsx            로비 <-> 게임룸 전환
  components/
    Lobby.jsx         방 생성 / 초대 코드 입장
    GameRoom.jsx       실시간 게임 진행 (턴, 카드 내기/뽑기)
    Card.jsx           카드 UI
    WinScreen.jsx       승리 화면 (CO2 절감량)
firestore.rules      Firestore 보안 규칙
```

## 게임 규칙 요약

- 최대 6인, 각자 폰에서 초대 코드로 입장
- 카드 4색 = ESG 4축 (초록/파랑/노랑/빨강)
- 재활용(Skip), 순환(Reverse), 오염+2(Draw2), 정책전환(Wild), 탄소폭탄(Wild+4)
- 그린액션 카드: 낸 사람이 한 번 더 낼 수 있음 (턴 안 넘어감)
- 카드 1장 남으면 "넷제로!" 버튼으로 선언
- 핸드가 0장이 되면 승리 → 이번 판에서 사용된 카드 수 기준 CO2 절감량 표시

## 다음에 추가하면 좋은 것

- SDGs퀴즈 카드에 실제 퀴즈 UI 붙이기 (지금은 일반 카드처럼 동작)
- 넷제로 선언 안 하고 카드 0장 되려 할 때 페널티(카드 2장 드로우) 로직
- 재입장(끊겼다 다시 들어오기) 시 상태 복구 UX
