# n8n 빠른 시작 가이드

처음 시작하는 사람을 위한 30분 완성 가이드

---

## Step 1: n8n 설치 (5분)

### Docker로 설치 (추천)

```bash
# Docker 실행
docker run -it --rm \
  --name n8n \
  -p 5678:5678 \
  -v ~/.n8n:/home/node/.n8n \
  n8nio/n8n

# 브라우저에서 접속
# http://localhost:5678
```

### npm으로 설치

```bash
npm install -g n8n

# 실행
n8n start

# 브라우저에서 접속
# http://localhost:5678
```

---

## Step 2: 첫 워크플로우 만들기 (10분)

### 목표: "Hello World" Slack 알림

**구조**:
```
Manual Trigger → Slack Message
```

### 실습

1. **New Workflow 클릭**

2. **Manual Trigger 노드 추가**
   - 왼쪽에서 "Manual Trigger" 검색
   - 클릭하여 캔버스에 추가
   - 아무 설정 안 함

3. **Slack 노드 추가**
   - "+" 버튼 클릭
   - "Slack" 검색 → 추가
   - Resource: Message
   - Operation: Post
   - Channel: `#general` (또는 원하는 채널)
   - Text: `Hello from n8n! 🎉`

4. **Slack Credentials 설정**
   - Slack 앱 만들기: https://api.slack.com/apps
   - OAuth Token 복사
   - n8n에 Credential 추가

5. **Test 실행**
   - "Test Workflow" 버튼 클릭
   - Slack에서 메시지 확인

**축하합니다! 첫 워크플로우 완성! 🎊**

---

## Step 3: 실용적인 워크플로우 (15분)

### 목표: API 모니터링 자동화

**구조**:
```
Schedule Trigger → HTTP Request → IF → Slack Alert
```

### 실습

1. **Schedule Trigger 추가**
   - Trigger Interval: `5분마다`
   - 또는 Cron: `*/5 * * * *`

2. **HTTP Request 노드 추가**
   - Method: `GET`
   - URL: `https://api.github.com/status`
   - 또는 본인의 API URL

3. **Code 노드 추가**
   ```javascript
   const response = items[0].json;
   const isHealthy = response.status?.indicator === 'none';

   return [{
     json: {
       isHealthy,
       status: response.status,
       timestamp: new Date().toISOString()
     }
   }];
   ```

4. **IF 노드 추가**
   - Condition: `{{ $json.isHealthy }} === false`

5. **Slack 노드 추가** (IF False 경로)
   - Channel: `#alerts`
   - Text: `🚨 API is down! Status: {{ $json.status.indicator }}`

6. **Test & Save**
   - Test workflow
   - Save workflow: "API Monitor"
   - Activate: 스위치 ON

**이제 5분마다 자동으로 API 상태를 체크합니다!**

---

## 자주 쓰는 패턴 치트시트

### 패턴 1: 정기 작업

```
Schedule Trigger (매일 9시)
  ↓
Database Query (데이터 가져오기)
  ↓
Code (리포트 생성)
  ↓
Email (리포트 발송)
```

### 패턴 2: 이벤트 처리

```
Webhook Trigger (외부 이벤트)
  ↓
Code (데이터 검증)
  ↓
Switch (이벤트 타입별 분기)
  ├→ Type A: Action A
  ├→ Type B: Action B
  └→ Default: 로깅
```

### 패턴 3: 데이터 동기화

```
Schedule Trigger (1시간마다)
  ↓
Source API (데이터 가져오기)
  ↓
Split In Batches (100개씩)
  ↓
Target API (데이터 저장)
  ↓
Loop (다음 배치)
```

---

## 필수 Expression 치트시트

### 데이터 접근

```javascript
{{ $json.fieldName }}              // 현재 필드
{{ $json.user.email }}              // 중첩 필드
{{ $json.items[0] }}                // 배열 첫 요소
{{ $json.items.length }}            // 배열 길이
```

### 날짜/시간

```javascript
{{ $now.toISO() }}                  // 현재 시간 ISO
{{ $now.toFormat('yyyy-MM-dd') }}   // 포맷팅
{{ $now.plus({ days: 7 }) }}        // 7일 후
```

### 문자열

```javascript
{{ $json.email.toLowerCase() }}     // 소문자
{{ $json.name.toUpperCase() }}      // 대문자
{{ $json.text.substring(0, 100) }}  // 자르기
{{ $json.tags.join(', ') }}         // 배열 합치기
```

### 조건

```javascript
{{ $json.age >= 18 }}                          // 비교
{{ $json.status === "active" }}                // 같음
{{ $json.verified === true }}                  // Boolean
{{ $json.name ? $json.name : 'Unknown' }}      // 기본값
```

---

## 트러블슈팅

### 문제: "Invalid JSON" 에러

**해결**:
```javascript
// HTTP Request 노드
Response Format: "Text"

// 이후 Code 노드에서 파싱
try {
  return [{ json: JSON.parse(items[0].json) }];
} catch (e) {
  return [{ json: { error: 'Invalid JSON' } }];
}
```

### 문제: Expression이 작동 안 함

**해결**:
```javascript
// ❌ 틀림
{{ $json.user.name }}  // user가 undefined일 수 있음

// ✅ 안전
{{ $json.user?.name || 'Unknown' }}
```

### 문제: Workflow가 실행 안 됨

**체크리스트**:
- [ ] Workflow가 Active인가? (스위치 ON)
- [ ] Trigger 설정이 올바른가?
- [ ] Credentials가 설정되었나?
- [ ] 에러 로그 확인

---

## 다음 단계

### 레벨 1: 기본 마스터 ✅
- [x] Manual Trigger + Action
- [x] Schedule Trigger
- [x] IF 조건
- [x] Basic Expression

### 레벨 2: 중급 (지금 여기!)
- [ ] Code 노드 활용
- [ ] Switch 다중 분기
- [ ] Split In Batches
- [ ] 에러 핸들링

### 레벨 3: 고급
- [ ] 복잡한 데이터 변환
- [ ] 여러 API 연동
- [ ] 성능 최적화
- [ ] 보안 강화

---

## 추천 첫 프로젝트

### 프로젝트 1: 일일 리포트

```
Schedule (매일 9시)
  ↓
Google Sheets (어제 데이터)
  ↓
Code (차트 생성)
  ↓
Email (리포트 발송)
```

### 프로젝트 2: 블로그 자동화

```
Webhook (새 포스트 발행)
  ↓
HTTP Request (포스트 가져오기)
  ↓
Set (SNS 메시지 생성)
  ↓
Twitter + Slack (알림)
```

### 프로젝트 3: 폼 → CRM

```
Webhook (폼 제출)
  ↓
Code (검증)
  ↓
Notion API (연락처 추가)
  ↓
Email (자동 응답)
```

---

## 유용한 리소스

### 공식 문서
- Docs: https://docs.n8n.io
- Examples: https://docs.n8n.io/code-examples/

### 커뮤니티
- Forum: https://community.n8n.io
- Templates: https://n8n.io/workflows

### 도움말
- Cron 생성기: https://crontab.guru
- Expression 테스트: n8n UI의 "Expression" 탭

---

## 다음 스킬로

- `references/common-workflows.md` - 실전 워크플로우 10개
- `references/node-reference.md` - 자주 쓰는 노드 설정
- `assets/workflow-templates.md` - 복붙 가능한 완성 템플릿

**화이팅! 자동화의 세계로! 🚀**
