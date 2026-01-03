# 자주 쓰는 n8n 워크플로우 패턴

실전에서 바로 사용할 수 있는 워크플로우 템플릿

---

## 1. 블로그 → SNS 자동 발행

**용도**: 블로그 포스트 발행 시 자동으로 트위터, 링크드인에 공유

```
Manual Trigger (또는 Webhook)
  ↓
HTTP Request (GET /api/posts/latest)
  ↓
Set (메시지 포맷팅)
  text: "{{ $json.title }}\n{{ $json.url }}\n#webdev"
  ↓
Split (분기)
  ├→ Twitter API (tweet)
  └→ LinkedIn API (post)
  ↓
Slack (팀 알림)
```

**활용 예시**:
- 블로그 자동 홍보
- 포트폴리오 업데이트 알림
- 새 프로젝트 공유

---

## 2. 정기 백업 & 리포트

**용도**: 매일/매주 데이터 백업 및 리포트 생성

```
Schedule Trigger (매일 새벽 2시)
  ↓
Database Query (데이터 추출)
  ↓
Code (CSV 변환)
  ↓
Google Drive (업로드)
  ↓
Email (백업 완료 알림)
```

**cron 설정**:
- 매일 2시: `0 2 * * *`
- 매주 월요일 9시: `0 9 * * 1`
- 매월 1일 0시: `0 0 1 * *`

---

## 3. Webhook → Slack 알림

**용도**: 외부 이벤트 발생 시 팀에 즉시 알림

```
Webhook Trigger
  Path: /webhook/events
  Method: POST
  ↓
Code (데이터 검증)
  ↓
Slack Message
  Channel: #alerts
  Text: "🔔 {{ $json.event }}: {{ $json.message }}"
```

**호출 예시**:
```bash
curl -X POST https://n8n.domain.com/webhook/events \
  -H "Content-Type: application/json" \
  -d '{
    "event": "deployment",
    "message": "Production deployed successfully",
    "user": "deploy-bot"
  }'
```

---

## 4. API 헬스체크 & 모니터링

**용도**: 5분마다 API 상태 확인, 문제 시 알림

```
Schedule Trigger (5분마다)
  ↓
HTTP Request (GET /health)
  Timeout: 5000ms
  ↓
Code (응답 시간 측정)
  ↓
IF (status !== 200 OR responseTime > 1000)
  ├→ Yes: Slack (긴급 알림)
  └→ No: NoOp (스킵)
```

**Code 노드**:
```javascript
const response = items[0].json;
const responseTime = response.responseTime;
const isHealthy = response.statusCode === 200 && responseTime < 1000;

return [{
  json: {
    ...response,
    isHealthy,
    timestamp: new Date().toISOString()
  }
}];
```

---

## 5. 이메일 → 작업 생성

**용도**: 특정 이메일 수신 시 자동으로 태스크/이슈 생성

```
Email Trigger
  Filter: subject contains "[TASK]"
  ↓
Code (이메일 파싱)
  ↓
Linear/Notion API (이슈 생성)
  ↓
Email Reply (확인 메일)
```

**이메일 파싱**:
```javascript
const email = items[0].json;

// 제목에서 태스크명 추출
const title = email.subject.replace('[TASK]', '').trim();

// 본문에서 우선순위/담당자 파싱
const body = email.textPlain;
const priority = body.match(/Priority: (High|Medium|Low)/)?.[1] || 'Medium';
const assignee = body.match(/Assignee: (@\w+)/)?.[1];

return [{
  json: {
    title,
    description: body,
    priority,
    assignee: assignee?.replace('@', ''),
    source: 'email'
  }
}];
```

---

## 6. 파일 업로드 → 처리

**용도**: S3/Drive에 파일 업로드 시 자동 처리

```
Webhook Trigger (파일 업로드 이벤트)
  ↓
HTTP Request (파일 다운로드)
  ↓
Code (파일 처리: 이미지 리사이즈, CSV 파싱 등)
  ↓
Database (메타데이터 저장)
  ↓
Slack (처리 완료 알림)
```

**이미지 처리 예시**:
```javascript
const sharp = require('sharp');

// 이미지 리사이즈
const buffer = Buffer.from(items[0].binary.data, 'base64');
const resized = await sharp(buffer)
  .resize(800, 600, { fit: 'inside' })
  .jpeg({ quality: 80 })
  .toBuffer();

return [{
  json: {
    filename: items[0].json.filename,
    size: resized.length
  },
  binary: {
    data: resized.toString('base64')
  }
}];
```

---

## 7. 데이터 동기화

**용도**: 두 시스템 간 데이터 동기화 (Notion ↔ Airtable)

```
Schedule Trigger (1시간마다)
  ↓
Notion API (Get Pages, Last Updated > 1h)
  ↓
Split In Batches (10개씩)
  ↓
Airtable API (Update Record)
  ↓
Loop (다음 배치)
```

**중복 방지**:
```javascript
// Airtable에서 기존 레코드 확인
const existingRecords = $node["Get Existing"].json;
const notionPage = items[0].json;

// 이미 존재하면 UPDATE, 없으면 CREATE
const recordExists = existingRecords.find(
  r => r.fields.notion_id === notionPage.id
);

return [{
  json: {
    ...notionPage,
    operation: recordExists ? 'update' : 'create',
    airtableId: recordExists?.id
  }
}];
```

---

## 8. RSS → 콘텐츠 큐레이션

**용도**: RSS 피드에서 새 글 수집 → 필터링 → 저장

```
Schedule Trigger (2시간마다)
  ↓
RSS Read (기술 블로그 피드)
  ↓
Code (키워드 필터링)
  ↓
IF (관심 키워드 포함?)
  ↓
Notion API (읽기 목록에 추가)
  ↓
Slack (새 아티클 알림)
```

**키워드 필터링**:
```javascript
const item = items[0].json;
const keywords = ['react', 'nextjs', 'typescript', 'performance'];

// 제목이나 내용에 키워드 포함 여부
const isRelevant = keywords.some(keyword =>
  item.title.toLowerCase().includes(keyword) ||
  item.content.toLowerCase().includes(keyword)
);

return [{
  json: {
    ...item,
    isRelevant,
    matchedKeywords: keywords.filter(k =>
      item.title.toLowerCase().includes(k)
    )
  }
}];
```

---

## 9. 폼 제출 → CRM 연동

**용도**: 웹사이트 문의 폼 → CRM/Notion에 자동 등록

```
Webhook Trigger
  Path: /webhook/contact-form
  ↓
Code (스팸 필터링)
  ↓
IF (valid submission)
  ↓
Split (분기)
  ├→ Notion API (연락처 DB에 추가)
  ├→ Email (자동 응답)
  └→ Slack (영업팀 알림)
```

**스팸 필터링**:
```javascript
const submission = items[0].json;

// 기본 검증
const isValid =
  submission.email?.includes('@') &&
  submission.message?.length > 10 &&
  !submission.message.includes('viagra');  // 스팸 키워드

// 허니팟 체크
const isSpam = submission.website !== '';  // hidden field

return [{
  json: {
    ...submission,
    isValid: isValid && !isSpam,
    timestamp: new Date().toISOString()
  }
}];
```

---

## 10. 에러 로그 수집 & 분석

**용도**: 앱 에러 발생 시 자동 수집 및 분석

```
Webhook Trigger
  Path: /webhook/errors
  ↓
Code (에러 분류)
  ↓
Switch (심각도별 분기)
  ├→ Critical: Slack (#urgent) + Email (CTO)
  ├→ High: Slack (#alerts)
  └→ Medium/Low: Database (로그 저장)
  ↓
Google Sheets (일일 에러 리포트에 추가)
```

**에러 분류**:
```javascript
const error = items[0].json;

// 심각도 판단
const severity =
  error.type === 'FATAL' || error.message.includes('database') ? 'critical' :
  error.type === 'ERROR' ? 'high' :
  'medium';

// 중복 에러 체크 (1시간 내)
const recentErrors = $workflow.staticData.recentErrors || [];
const isDuplicate = recentErrors.some(e =>
  e.message === error.message &&
  Date.now() - e.timestamp < 3600000
);

return [{
  json: {
    ...error,
    severity,
    isDuplicate,
    timestamp: Date.now()
  }
}];
```

---

## 빠른 시작 가이드

### 첫 워크플로우 추천 순서:

1. **Manual Trigger + Slack 알림** (5분)
   - 가장 간단, 테스트하기 좋음

2. **Schedule + HTTP Request + Slack** (10분)
   - API 헬스체크 워크플로우
   - 실용적이고 즉시 활용 가능

3. **Webhook + Processing + Action** (20분)
   - 실제 이벤트 기반 자동화
   - 외부 시스템과 연동

4. **복잡한 워크플로우** (1시간+)
   - 조건 분기, 에러 핸들링
   - 여러 서비스 연동

### 각 패턴의 완성본은 `assets/workflow-templates.md`에서 확인하세요!
