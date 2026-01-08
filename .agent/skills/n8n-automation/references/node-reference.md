# n8n 노드 레퍼런스

자주 쓰는 노드들의 설정 방법과 팁

---

## Trigger Nodes

### Webhook

**용도**: HTTP 요청으로 워크플로우 시작

**기본 설정**:
```json
{
  "path": "webhook-name",
  "httpMethod": "POST",
  "responseMode": "lastNode",
  "options": {
    "rawBody": false
  }
}
```

**인증 추가**:
```json
{
  "authentication": "headerAuth",
  "headerAuth": {
    "name": "Authorization",
    "value": "Bearer {{ $env.API_SECRET }}"
  }
}
```

**팁**:
- Production webhook: `https://n8n.domain.com/webhook/path`
- Test webhook: `https://n8n.domain.com/webhook-test/path`
- 항상 인증 추가 (보안)

---

### Schedule Trigger

**용도**: 정해진 시간에 자동 실행

**Cron 패턴**:
```
분 시 일 월 요일
*  *  *  *  *

예시:
0  2  *  *  *     # 매일 오전 2시
*/5 * * * *       # 5분마다
0  9  *  *  1     # 매주 월요일 9시
0  0  1  *  *     # 매월 1일 자정
```

**간단한 설정**:
- Every Hour: `0 * * * *`
- Every Day at 2 AM: `0 2 * * *`
- Every Monday at 9 AM: `0 9 * * 1`

**팁**: https://crontab.guru 에서 cron 표현식 테스트

---

### Manual Trigger

**용도**: 수동 실행, 테스트

**테스트 데이터 추가**:
```json
{
  "id": "test-123",
  "name": "Test User",
  "email": "test@example.com"
}
```

**팁**: 워크플로우 개발 시 Manual Trigger로 시작 → 완성 후 Webhook/Schedule로 변경

---

## Processing Nodes

### Code

**용도**: JavaScript로 커스텀 로직

**기본 구조**:
```javascript
// items는 이전 노드의 데이터 배열
for (const item of items) {
  // 각 item 처리
  const data = item.json;

  // 로직 실행
  const result = processData(data);

  // 결과 설정
  item.json = result;
}

return items;
```

**단일 아이템 반환**:
```javascript
const data = items[0].json;

return [{
  json: {
    processed: true,
    original: data,
    timestamp: new Date().toISOString()
  }
}];
```

**npm 패키지 사용**:
```javascript
// n8n에 기본 포함된 패키지들
const axios = require('axios');
const crypto = require('crypto');
const moment = require('moment');

// 사용 예시
const hash = crypto.createHash('sha256')
  .update(items[0].json.email)
  .digest('hex');
```

---

### IF

**용도**: 조건 분기 (True/False)

**Condition 설정**:
```javascript
// 비교
{{ $json.status }} === "active"
{{ $json.age }} >= 18
{{ $json.score }} > 75

// 존재 여부
{{ $json.email }}  // email 필드가 있으면 true
{{ $json.verified === true }}

// 복합 조건
{{ $json.age >= 18 && $json.verified === true }}
{{ $json.status === "active" || $json.status === "pending" }}
```

**팁**: 복잡한 조건은 Code 노드로 처리 후 IF 노드 사용

---

### Switch

**용도**: 다중 조건 분기 (3개 이상 경로)

**Rule 설정**:
```javascript
// Rule 1
{{ $json.type }} === "order"

// Rule 2
{{ $json.type }} === "refund"

// Rule 3
{{ $json.type }} === "inquiry"

// Fallback (기타)
```

**팁**: Switch > IF when 3+ conditions

---

### Set

**용도**: 데이터 변환, 필드 추가/수정

**Keep Only Set 모드**:
```json
{
  "id": "={{ $json.userId }}",
  "name": "={{ $json.firstName }} {{ $json.lastName }}",
  "email": "={{ $json.email.toLowerCase() }}",
  "createdAt": "={{ $now.toISO() }}"
}
```

**Add Fields 모드**:
```json
{
  "processed": true,
  "processedAt": "={{ $now.toISO() }}"
}
// 기존 필드 유지, 새 필드만 추가
```

---

### Merge

**용도**: 여러 경로의 데이터 합치기

**Mode 선택**:
- **Append**: 순서대로 연결
- **Keep Matches**: 공통 필드 매칭
- **Combine**: 모든 조합 생성

**Append 예시**:
```
Input 1: [A, B]
Input 2: [C, D]
Output: [A, B, C, D]
```

---

### Split In Batches

**용도**: 대량 데이터를 배치로 나눠 처리

**설정**:
```json
{
  "batchSize": 100,
  "options": {
    "reset": false
  }
}
```

**구조**:
```
Get 1000 items
  ↓
Split In Batches (100개씩)
  ↓
Process 100 items
  ↓
Loop back to Split In Batches
  ↓
All processed (1000개 완료)
```

**팁**: API Rate Limit 우회에 유용

---

## Action Nodes

### HTTP Request

**GET 요청**:
```json
{
  "method": "GET",
  "url": "https://api.example.com/users",
  "authentication": "predefinedCredentialType",
  "nodeCredentialType": "httpHeaderAuth"
}
```

**POST with JSON**:
```json
{
  "method": "POST",
  "url": "https://api.example.com/users",
  "sendBody": true,
  "bodyParameters": {
    "parameters": [
      {
        "name": "name",
        "value": "={{ $json.name }}"
      },
      {
        "name": "email",
        "value": "={{ $json.email }}"
      }
    ]
  }
}
```

**에러 처리**:
```json
{
  "options": {
    "response": {
      "response": {
        "neverError": true
      }
    },
    "timeout": 10000,
    "retry": {
      "maxRetries": 3,
      "waitBetweenRetries": 1000
    }
  }
}
```

---

### Slack

**간단한 메시지**:
```json
{
  "channel": "#general",
  "text": "Hello from n8n!"
}
```

**Rich message**:
```json
{
  "channel": "#alerts",
  "text": "🚨 Alert",
  "attachments": [{
    "color": "danger",
    "fields": [
      {
        "title": "Error Type",
        "value": "{{ $json.errorType }}",
        "short": true
      },
      {
        "title": "Timestamp",
        "value": "{{ $json.timestamp }}",
        "short": true
      }
    ]
  }]
}
```

---

### Email

**HTML 이메일**:
```json
{
  "to": "{{ $json.email }}",
  "subject": "Welcome {{ $json.name }}!",
  "emailType": "html",
  "message": "<h1>Welcome!</h1><p>Thanks for signing up.</p>"
}
```

**파일 첨부**:
```json
{
  "to": "{{ $json.email }}",
  "subject": "Your Report",
  "attachments": "data",
  "options": {
    "attachmentsPropertyName": "attachments"
  }
}
```

---

### Database (PostgreSQL)

**Insert**:
```json
{
  "operation": "insert",
  "table": "users",
  "columns": "name,email,created_at",
  "values": "={{ $json.name }},={{ $json.email }},={{ $now.toISO() }}"
}
```

**Select**:
```sql
SELECT *
FROM users
WHERE email = '{{ $json.email }}'
LIMIT 1
```

**팁**: Prepared statements 사용으로 SQL injection 방지

---

### Google Sheets

**Append Row**:
```json
{
  "operation": "append",
  "sheetName": "Sheet1",
  "valueInputMode": "USER_ENTERED",
  "values": {
    "A": "={{ $json.name }}",
    "B": "={{ $json.email }}",
    "C": "={{ $now.toFormat('yyyy-MM-dd') }}"
  }
}
```

**Lookup**:
```json
{
  "operation": "lookup",
  "sheetName": "Sheet1",
  "lookupColumn": "A",
  "lookupValue": "={{ $json.email }}"
}
```

---

## 고급 팁

### 1. 에러 핸들링

**Continue On Fail 설정**:
```
Node Settings → Continue On Fail → Enable
```

**에러 체크**:
```javascript
// IF 노드에서
{{ $json.error }}

// Code 노드에서
if (items[0].json.error) {
  // 에러 처리
}
```

---

### 2. Static Data (워크플로우 메모리)

```javascript
// 읽기
const cache = $workflow.staticData.cache || {};

// 쓰기
$workflow.staticData.cache = {
  lastRun: Date.now(),
  count: (cache.count || 0) + 1
};
```

**용도**: 카운터, 캐싱, 마지막 실행 시간 저장

---

### 3. 환경 변수

```javascript
// 읽기
const apiKey = $env.API_KEY;
const dbUrl = $env.DATABASE_URL;
```

**설정**: n8n 서버 환경 변수에 추가

---

### 4. Binary Data (파일 처리)

```javascript
// 파일 읽기
const fileData = items[0].binary.data;
const buffer = Buffer.from(fileData.data, 'base64');

// 파일 쓰기
return [{
  json: { filename: 'output.txt' },
  binary: {
    data: {
      data: buffer.toString('base64'),
      mimeType: 'text/plain',
      fileName: 'output.txt'
    }
  }
}];
```

---

### 5. 날짜/시간 처리

```javascript
// 현재 시간
{{ $now.toISO() }}  // 2025-01-15T10:30:00.000Z
{{ $now.toFormat('yyyy-MM-dd') }}  // 2025-01-15

// 계산
{{ $now.plus({ days: 7 }).toISO() }}  // 7일 후
{{ $now.minus({ hours: 1 }).toISO() }}  // 1시간 전

// 파싱
{{ $moment('2025-01-15').toISO() }}
```

---

이 레퍼런스로 빠르게 찾아서 사용하세요!
더 자세한 내용은 공식 문서: https://docs.n8n.io/integrations/builtin/
