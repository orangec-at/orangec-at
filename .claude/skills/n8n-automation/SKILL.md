---
name: n8n-automation
description: n8n workflow automation 설계 및 구현 가이드. 일반적인 자동화 패턴, 노드 연결 방법, 트러블슈팅 전략을 제공합니다. 실전 워크플로우 템플릿으로 빠르게 시작할 수 있습니다.
---

# n8n Automation

n8n으로 반복 작업을 자동화하고 서비스를 연동하는 실전 가이드

**Works With:** APIs • Webhooks • Database • Slack/Discord • Email • Cloud Services

---

## When to Use This Skill

- 반복 작업 자동화 (블로그 포스팅, SNS 발행)
- API 서비스 연동 (Notion, Airtable, Slack 등)
- 데이터 파이프라인 구축
- 알림 및 모니터링 시스템
- Webhook 기반 이벤트 처리
- 정기 작업 스케줄링

---

## Core Principles

### 1. Trigger → Process → Action 패턴

모든 워크플로우는 이 3단계로 구성:

```
Trigger (시작점)
   ↓
Process (데이터 처리/변환)
   ↓
Action (결과 실행)
```

### 2. 단순하게 시작, 점진적 확장

- 작은 워크플로우로 시작
- 동작 확인 후 단계 추가
- 각 노드를 개별 테스트

### 3. 에러 핸들링은 필수

- 실패 시 대응 방안 준비
- 알림 설정 (Slack, Email)
- 재시도 로직 구현

### 4. 데이터 흐름 이해

- 각 노드는 이전 노드의 출력을 입력으로 받음
- `{{ $json }}` 문법으로 데이터 접근
- Expression으로 데이터 변환

---

## n8n 기본 개념

### Trigger Nodes (시작점)

**주요 Trigger**:
- **Webhook**: HTTP 요청으로 시작
- **Schedule**: 정해진 시간에 실행 (cron)
- **Manual**: 수동 실행 (테스트용)
- **Email Trigger**: 이메일 수신 시
- **File Trigger**: 파일 변경 감지

**예시**:
```
Webhook Trigger
- Method: POST
- Path: /new-blog-post
→ 새 블로그 포스트 발행 시 자동 실행
```

### Core Nodes (처리)

**데이터 처리**:
- **Set**: 데이터 변환/추가
- **Code**: JavaScript 커스텀 로직
- **IF**: 조건 분기
- **Switch**: 다중 조건 분기
- **Merge**: 여러 경로 합치기
- **Split In Batches**: 대량 데이터 배치 처리

**데이터 소스**:
- **HTTP Request**: API 호출
- **Database**: PostgreSQL, MySQL, MongoDB
- **Spreadsheet**: Google Sheets, Excel
- **File**: 파일 읽기/쓰기

### Action Nodes (결과)

**알림/커뮤니케이션**:
- **Slack**: 메시지 발송
- **Discord**: 디스코드 메시지
- **Email**: 이메일 발송
- **Telegram**: 텔레그램 메시지

**데이터 저장**:
- **Database**: 데이터 저장
- **Google Sheets**: 스프레드시트 업데이트
- **Airtable**: Airtable 레코드 생성
- **Notion**: Notion 페이지 생성

---

## 실전 워크플로우 패턴

### 패턴 1: 블로그 자동 발행 → SNS 공유

```
Manual Trigger (블로그 발행 완료)
   ↓
HTTP Request (블로그 API에서 최신 포스트 가져오기)
   ↓
Set (SNS 메시지 포맷팅)
   ↓
Split (여러 플랫폼으로 분기)
   ├─→ Twitter API (트위터 포스팅)
   ├─→ Slack (팀에 알림)
   └─→ Discord (커뮤니티에 공유)
```

**구현 디테일**:

**1) HTTP Request 노드**:
```json
{
  "method": "GET",
  "url": "https://yourblog.com/api/posts/latest",
  "authentication": "headerAuth",
  "sendHeaders": true
}
```

**2) Set 노드 (메시지 포맷팅)**:
```javascript
// Expression 사용
{
  "title": "{{ $json.title }}",
  "url": "{{ $json.url }}",
  "twitterText": "새 포스트: {{ $json.title }} {{ $json.url }} #webdev #nextjs",
  "slackText": "🎉 새 블로그 포스트 발행: *{{ $json.title }}*\n{{ $json.url }}"
}
```

**3) Twitter API 노드**:
```json
{
  "resource": "Tweet",
  "operation": "Create",
  "text": "={{ $json.twitterText }}"
}
```

---

### 패턴 2: 정기 백업 & 알림

```
Schedule Trigger (매일 오전 2시)
   ↓
Database (데이터 추출)
   ↓
Code (데이터 처리/압축)
   ↓
Google Drive (백업 파일 업로드)
   ↓
IF (성공 여부 확인)
   ├─ 성공 → Slack (성공 알림)
   └─ 실패 → Email (에러 알림)
```

**구현 디테일**:

**1) Schedule Trigger**:
```
Cron Expression: 0 2 * * *
(매일 오전 2시)
```

**2) Code 노드 (데이터 압축)**:
```javascript
// items는 이전 노드에서 온 데이터 배열
const data = items.map(item => item.json);

// CSV 형식으로 변환
const csv = data.map(row =>
  Object.values(row).join(',')
).join('\n');

// Base64 인코딩
const encoded = Buffer.from(csv).toString('base64');

return [{
  json: {
    filename: `backup_${new Date().toISOString().split('T')[0]}.csv`,
    content: encoded,
    recordCount: data.length
  }
}];
```

**3) IF 노드 (성공 확인)**:
```javascript
// Condition
{{ $json.recordCount }} > 0
```

---

### 패턴 3: Webhook → 데이터 처리 → 저장

```
Webhook Trigger (외부 이벤트 수신)
   ↓
Code (데이터 검증/변환)
   ↓
Switch (이벤트 타입별 분기)
   ├─ type: "order" → Database (주문 저장) → Email (주문 확인)
   ├─ type: "signup" → Airtable (사용자 추가) → Slack (팀 알림)
   └─ type: "error" → Discord (에러 알림)
```

**구현 디테일**:

**1) Webhook Trigger**:
```
Method: POST
Path: /webhook/events
Authentication: Header Auth (API Key)
```

**2) Code 노드 (검증)**:
```javascript
const event = items[0].json;

// 필수 필드 검증
if (!event.type || !event.timestamp) {
  throw new Error('Invalid event: missing required fields');
}

// 타임스탬프 변환
const processedEvent = {
  ...event,
  timestamp: new Date(event.timestamp).toISOString(),
  processed_at: new Date().toISOString()
};

return [{ json: processedEvent }];
```

**3) Switch 노드**:
```
Rules:
- Rule 1: {{ $json.type }} === "order"
- Rule 2: {{ $json.type }} === "signup"
- Rule 3: {{ $json.type }} === "error"
- Fallback: 기타 (로깅만)
```

---

### 패턴 4: API 모니터링 & 알림

```
Schedule Trigger (5분마다)
   ↓
HTTP Request (API 헬스체크)
   ↓
Code (응답 시간 측정, 상태 확인)
   ↓
IF (정상 동작 여부)
   ├─ 정상 → NoOp (아무것도 안 함)
   └─ 비정상 → Slack (긴급 알림) + Email (담당자 알림)
```

**구현 디테일**:

**1) HTTP Request 노드**:
```json
{
  "method": "GET",
  "url": "https://api.yourservice.com/health",
  "timeout": 5000,
  "options": {
    "returnFullResponse": true
  }
}
```

**2) Code 노드 (분석)**:
```javascript
const response = items[0].json;
const startTime = new Date($node["HTTP Request"].startTime);
const endTime = new Date();
const responseTime = endTime - startTime;

// 상태 판단
const isHealthy =
  response.statusCode === 200 &&
  responseTime < 1000 &&
  response.body.status === 'ok';

return [{
  json: {
    isHealthy,
    statusCode: response.statusCode,
    responseTime,
    timestamp: new Date().toISOString(),
    message: isHealthy ? 'Service healthy' : 'Service degraded'
  }
}];
```

**3) Slack 알림 (비정상 시)**:
```javascript
{
  "channel": "#alerts",
  "text": "🚨 API 장애 감지!",
  "attachments": [{
    "color": "danger",
    "fields": [
      {
        "title": "Status Code",
        "value": "{{ $json.statusCode }}",
        "short": true
      },
      {
        "title": "Response Time",
        "value": "{{ $json.responseTime }}ms",
        "short": true
      },
      {
        "title": "Timestamp",
        "value": "{{ $json.timestamp }}"
      }
    ]
  }]
}
```

---

## Expression 활용

### 데이터 접근

```javascript
// 현재 노드 데이터
{{ $json.fieldName }}

// 이전 노드 데이터
{{ $node["NodeName"].json.fieldName }}

// 첫 번째 아이템
{{ $items[0].json.fieldName }}

// 배열 처리
{{ $json.items.length }}
{{ $json.items[0].name }}
```

### 날짜/시간

```javascript
// 현재 시간
{{ $now.toISO() }}

// 포맷팅
{{ $now.toFormat('yyyy-MM-dd') }}
{{ $now.toFormat('HH:mm:ss') }}

// 계산
{{ $now.plus({ days: 7 }).toISO() }}  // 7일 후
{{ $now.minus({ hours: 1 }).toISO() }}  // 1시간 전
```

### 문자열 처리

```javascript
// 대문자/소문자
{{ $json.title.toUpperCase() }}
{{ $json.email.toLowerCase() }}

// 자르기
{{ $json.description.substring(0, 100) }}

// 치환
{{ $json.text.replace('old', 'new') }}

// 분할
{{ $json.tags.split(',') }}
```

### 조건부 로직

```javascript
// 삼항 연산자
{{ $json.status === 'active' ? 'Active User' : 'Inactive' }}

// 기본값
{{ $json.name || 'Unknown' }}

// 조건 결합
{{ $json.age >= 18 && $json.verified === true }}
```

---

## 에러 핸들링

### 1. Try-Catch 패턴

```
Main Flow
   ↓
[노드 설정: Continue On Fail = true]
   ↓
IF ({{ $json.error }} exists)
   ├─ 에러 있음 → Error Handler (로깅/알림)
   └─ 정상 → 다음 단계
```

### 2. 재시도 로직

**HTTP Request 노드 설정**:
```json
{
  "retry": {
    "maxRetries": 3,
    "waitBetweenRetries": 1000
  },
  "timeout": 10000
}
```

### 3. Fallback 경로

```
API Call
   ↓
IF (성공?)
   ├─ 성공 → Primary Action
   └─ 실패 → Fallback Action (캐시된 데이터 사용)
```

### 4. Error Workflow

```
Any Node (Continue On Fail: true)
   ↓
IF ({{ $json.error }})
   ↓
Set (에러 정보 수집)
   ↓
Split
   ├─→ Slack (즉시 알림)
   ├─→ Database (에러 로그 저장)
   └─→ Email (일일 에러 리포트에 추가)
```

---

## 성능 최적화

### 1. 배치 처리

**문제**: 1000개 레코드를 하나씩 처리 → 너무 느림

**해결**: Split In Batches 노드 사용
```
Get All Records (1000개)
   ↓
Split In Batches (100개씩)
   ↓
Process Batch (100개 한 번에 처리)
   ↓
Loop Back (다음 배치)
```

**설정**:
```json
{
  "batchSize": 100,
  "options": {
    "reset": false
  }
}
```

### 2. 병렬 처리

여러 독립적인 작업을 동시에:
```
Start
   ↓
Split (분기)
   ├─→ Task 1 (API Call 1)
   ├─→ Task 2 (API Call 2)
   └─→ Task 3 (Database Query)
   ↓
Merge (결과 합치기)
   ↓
Final Processing
```

### 3. 조건부 실행

불필요한 노드 실행 방지:
```
IF ({{ $json.needsProcessing === true }})
   ├─ Yes → Heavy Processing
   └─ No → Skip
```

### 4. 캐싱

```javascript
// Code 노드에서 캐싱
const cache = $workflow.staticData.cache || {};
const cacheKey = `data_${$json.id}`;

// 캐시 확인
if (cache[cacheKey] && cache[cacheKey].timestamp > Date.now() - 3600000) {
  // 1시간 이내 캐시 사용
  return [{ json: cache[cacheKey].data }];
}

// 새 데이터 가져오기 + 캐싱
const newData = fetchData($json.id);
cache[cacheKey] = {
  data: newData,
  timestamp: Date.now()
};
$workflow.staticData.cache = cache;

return [{ json: newData }];
```

---

## 실전 예시: 블로그 자동화 전체 플로우

### 시나리오

블로그 포스트 발행 → 자동으로 SEO 체크 → SNS 발행 → 팀 알림

### 워크플로우 설계

```
1. Webhook Trigger
   - Path: /blog/published
   - Method: POST

2. HTTP Request (블로그 API)
   - GET /api/posts/{{ $json.postId }}

3. Code (SEO 기본 체크)
   - Title 길이 (50-60자)
   - Description 길이 (150-160자)
   - 키워드 존재 여부

4. IF (SEO 통과?)
   ├─ Yes → Continue
   └─ No → Slack (SEO 경고) → Stop

5. Set (SNS 메시지 생성)
   - Twitter 메시지
   - Instagram 캡션
   - LinkedIn 포스트

6. Split (3개 경로)
   ├─→ Twitter API
   ├─→ Instagram API (또는 Manual 알림)
   └─→ LinkedIn API

7. Merge (결과 합치기)

8. Google Sheets (발행 로그 기록)
   - 포스트 제목, URL, 발행 시간

9. Slack (팀 알림)
   - 포스트 정보 + SNS 발행 상태
```

### 구현 코드

**3) Code 노드 (SEO 체크)**:
```javascript
const post = items[0].json;

const seoChecks = {
  titleLength: post.title.length >= 50 && post.title.length <= 60,
  descLength: post.description.length >= 150 && post.description.length <= 160,
  hasKeyword: post.tags && post.tags.length > 0,
  hasImage: post.featuredImage && post.featuredImage.length > 0
};

const passedChecks = Object.values(seoChecks).filter(v => v).length;
const totalChecks = Object.keys(seoChecks).length;
const seoScore = (passedChecks / totalChecks) * 100;

return [{
  json: {
    ...post,
    seoScore,
    seoChecks,
    seoPassed: seoScore >= 75  // 75% 이상 통과
  }
}];
```

**5) Set 노드 (메시지 생성)**:
```javascript
{
  "post": "={{ $json }}",
  "twitter": {
    "text": "🎉 새 포스트: {{ $json.title }}\n\n{{ $json.description.substring(0, 100) }}...\n\n{{ $json.url }}\n\n#webdev #{{ $json.tags[0] }}"
  },
  "linkedin": {
    "text": "새로운 블로그 포스트를 발행했습니다!\n\n📌 {{ $json.title }}\n\n{{ $json.description }}\n\n전체 글: {{ $json.url }}",
    "url": "{{ $json.url }}"
  },
  "sheets": {
    "title": "{{ $json.title }}",
    "url": "{{ $json.url }}",
    "publishedAt": "{{ $now.toISO() }}",
    "seoScore": "={{ $json.seoScore }}%",
    "tags": "{{ $json.tags.join(', ') }}"
  }
}
```

**9) Slack 알림**:
```json
{
  "channel": "#blog-updates",
  "text": "✅ 블로그 포스트 자동 발행 완료!",
  "attachments": [{
    "color": "good",
    "fields": [
      {
        "title": "포스트",
        "value": "<{{ $json.post.url }}|{{ $json.post.title }}>",
        "short": false
      },
      {
        "title": "SEO Score",
        "value": "{{ $json.post.seoScore }}%",
        "short": true
      },
      {
        "title": "SNS 발행",
        "value": "Twitter ✅ LinkedIn ✅",
        "short": true
      }
    ]
  }]
}
```

---

## 베스트 프랙티스

### 1. 노드 이름 명확하게

❌ **Bad**: `HTTP Request`, `HTTP Request 1`, `HTTP Request 2`

✅ **Good**: `Get Latest Post`, `Fetch User Data`, `Send to Twitter API`

### 2. 테스트 데이터 준비

**Manual Trigger 노드**에 샘플 데이터:
```json
{
  "postId": "test-123",
  "title": "Test Post Title",
  "url": "https://example.com/test"
}
```

### 3. 환경 변수 활용

민감한 정보는 환경 변수로:
```javascript
// ❌ 하드코딩
const apiKey = "sk-1234567890abcdef";

// ✅ 환경 변수
const apiKey = $env.TWITTER_API_KEY;
```

### 4. 주석 추가

Code 노드에 주석:
```javascript
// 1. 포스트 데이터 추출
const post = items[0].json;

// 2. SEO 메타데이터 검증
const hasValidMeta =
  post.title.length >= 50 &&
  post.description.length >= 150;

// 3. 결과 반환
return [{ json: { ...post, hasValidMeta } }];
```

### 5. 버전 관리

워크플로우를 JSON으로 export하여 git 관리:
```bash
# n8n UI에서 Export
# → workflows/blog-automation.json

git add workflows/
git commit -m "Add: Blog automation workflow"
```

---

## 트러블슈팅

### 문제 1: "Invalid JSON" 에러

**원인**: API 응답이 JSON이 아님

**해결**:
```javascript
// HTTP Request 노드 설정
{
  "options": {
    "response": {
      "response": {
        "neverError": true,
        "responseFormat": "text"  // JSON 파싱 안 함
      }
    }
  }
}

// 이후 Code 노드에서 수동 파싱
try {
  const data = JSON.parse(items[0].json.body);
  return [{ json: data }];
} catch (e) {
  return [{ json: { error: 'Invalid JSON', raw: items[0].json.body } }];
}
```

### 문제 2: Expression이 작동 안 함

**원인**: 문법 오류 또는 데이터 구조 오해

**해결**:
```javascript
// ❌ 틀린 예시
{{ $json.user.name }}  // user가 undefined일 수 있음

// ✅ 안전한 방법
{{ $json.user?.name || 'Unknown' }}

// 또는 Code 노드에서
const userName = items[0].json?.user?.name || 'Unknown';
return [{ json: { userName } }];
```

### 문제 3: 워크플로우가 멈춤

**원인**: 무한 루프 또는 타임아웃

**해결**:
```javascript
// Split In Batches에 안전장치
let counter = $workflow.staticData.counter || 0;

if (counter > 100) {
  throw new Error('Too many iterations, stopping workflow');
}

$workflow.staticData.counter = counter + 1;
```

### 문제 4: Rate Limit 에러

**원인**: API 호출 제한 초과

**해결**:
```javascript
// Wait 노드 추가 또는 Code에서 delay
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

for (const item of items) {
  await processItem(item);
  await delay(1000);  // 1초 대기
}
```

---

## 보안 고려사항

### 1. API Key 보호

```javascript
// ❌ 절대 하드코딩 금지
const key = "sk-prod-1234567890";

// ✅ 환경 변수 사용
const key = $env.API_KEY;

// ✅ n8n Credentials 시스템 사용
// Settings → Credentials → Add New
```

### 2. Webhook 인증

```javascript
// Webhook 노드에 인증 추가
{
  "authentication": "headerAuth",
  "headerAuth": {
    "name": "X-API-Key",
    "value": "={{ $env.WEBHOOK_SECRET }}"
  }
}

// Code 노드에서 검증
const apiKey = items[0].headers['x-api-key'];
if (apiKey !== process.env.WEBHOOK_SECRET) {
  throw new Error('Unauthorized');
}
```

### 3. 데이터 암호화

민감한 데이터는 암호화:
```javascript
const crypto = require('crypto');

// 암호화
const encrypt = (text) => {
  const cipher = crypto.createCipher('aes-256-cbc', $env.ENCRYPTION_KEY);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return encrypted;
};

// 복호화
const decrypt = (encrypted) => {
  const decipher = crypto.createDecipher('aes-256-cbc', $env.ENCRYPTION_KEY);
  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
};
```

---

## 자주 쓰는 노드 조합

### 1. API → Transform → Save

```
HTTP Request → Code (변환) → Database (저장)
```

### 2. Schedule → Check → Notify

```
Schedule Trigger → HTTP Request (체크) → IF → Slack (알림)
```

### 3. Webhook → Validate → Branch

```
Webhook → Code (검증) → Switch (분기) → [Multiple Actions]
```

### 4. Loop → Process → Aggregate

```
Split In Batches → Process Item → Loop → Merge Results
```

---

## 리소스

### 공식 문서
- n8n Docs: https://docs.n8n.io
- Expression 가이드: https://docs.n8n.io/code-examples/expressions/
- Node Reference: https://docs.n8n.io/integrations/builtin/

### 커뮤니티
- n8n Forum: https://community.n8n.io
- Reddit: r/n8n
- Discord: n8n Community

### 템플릿
- n8n Workflows: https://n8n.io/workflows
- Community Templates: https://community.n8n.io/c/workflows

---

## Summary

n8n으로 자동화를 시작하려면:

1. **간단하게 시작**: Manual Trigger + HTTP Request + Slack 알림
2. **점진적 확장**: 조건 분기, 에러 핸들링 추가
3. **테스트 철저히**: 각 노드를 개별 실행하여 확인
4. **에러 대비**: Continue On Fail + 알림 설정
5. **문서화**: 노드 이름 명확하게, 주석 추가

**첫 워크플로우 추천**:
- Schedule → HTTP Request (헬스체크) → Slack (알림)
- 성공하면 점차 복잡한 워크플로우로 확장!

더 궁금한 점 있으면 물어보세요! 🚀
