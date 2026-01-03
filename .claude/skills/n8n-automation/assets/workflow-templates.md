# n8n 워크플로우 템플릿

복사해서 바로 쓸 수 있는 완성된 워크플로우

---

## 템플릿 1: 블로그 자동 발행 시스템

### 전체 플로우

```json
{
  "name": "Blog Auto-Publish",
  "nodes": [
    {
      "name": "Manual Trigger",
      "type": "n8n-nodes-base.manualTrigger",
      "parameters": {}
    },
    {
      "name": "Get Latest Post",
      "type": "n8n-nodes-base.httpRequest",
      "parameters": {
        "method": "GET",
        "url": "https://yourblog.com/api/posts/latest",
        "authentication": "headerAuth"
      }
    },
    {
      "name": "Format Messages",
      "type": "n8n-nodes-base.set",
      "parameters": {
        "values": {
          "twitterText": "🎉 새 포스트: {{ $json.title }}\n\n{{ $json.url }}\n\n#webdev #nextjs",
          "slackText": "*새 블로그 포스트*\n{{ $json.title }}\n{{ $json.url }}"
        }
      }
    },
    {
      "name": "Post to Twitter",
      "type": "n8n-nodes-base.twitter",
      "parameters": {
        "resource": "tweet",
        "operation": "create",
        "text": "={{ $json.twitterText }}"
      }
    },
    {
      "name": "Notify Team",
      "type": "n8n-nodes-base.slack",
      "parameters": {
        "channel": "#blog-updates",
        "text": "={{ $json.slackText }}"
      }
    }
  ],
  "connections": {
    "Manual Trigger": { "main": [[{ "node": "Get Latest Post" }]] },
    "Get Latest Post": { "main": [[{ "node": "Format Messages" }]] },
    "Format Messages": { "main": [[
      { "node": "Post to Twitter" },
      { "node": "Notify Team" }
    ]]}
  }
}
```

### 사용 방법

1. Webhook Trigger로 변경 (실전 사용 시)
2. Twitter API credentials 추가
3. Slack credentials 추가
4. 블로그 API URL 수정

---

## 템플릿 2: API 모니터링

### Code 노드: 헬스체크

```javascript
// 이전 노드: HTTP Request to /health endpoint

const response = items[0].json;
const startTime = new Date($node["HTTP Request"].startTime);
const endTime = new Date();
const responseTime = endTime - startTime;

const isHealthy =
  response.statusCode === 200 &&
  responseTime < 1000 &&
  response.data?.status === 'ok';

return [{
  json: {
    isHealthy,
    statusCode: response.statusCode,
    responseTime,
    timestamp: new Date().toISOString(),
    message: isHealthy
      ? `✅ Service healthy (${responseTime}ms)`
      : `🚨 Service degraded (${responseTime}ms, status: ${response.statusCode})`
  }
}];
```

### Slack 알림 (비정상 시)

```json
{
  "channel": "#alerts",
  "text": "{{ $json.message }}",
  "attachments": [{
    "color": "={{ $json.isHealthy ? 'good' : 'danger' }}",
    "fields": [
      {
        "title": "Status Code",
        "value": "={{ $json.statusCode }}",
        "short": true
      },
      {
        "title": "Response Time",
        "value": "={{ $json.responseTime }}ms",
        "short": true
      },
      {
        "title": "Timestamp",
        "value": "={{ $json.timestamp }}",
        "short": false
      }
    ]
  }]
}
```

---

## 템플릿 3: 이메일 → 작업 생성

### Code 노드: 이메일 파싱

```javascript
const email = items[0].json;

// 제목에서 태스크명 추출
const titleMatch = email.subject.match(/\[TASK\](.*)/);
const title = titleMatch ? titleMatch[1].trim() : email.subject;

// 본문에서 우선순위 추출
const body = email.textPlain || email.html;
const priorityMatch = body.match(/Priority:\s*(High|Medium|Low)/i);
const priority = priorityMatch ? priorityMatch[1] : 'Medium';

// 담당자 추출
const assigneeMatch = body.match(/Assignee:\s*@(\w+)/);
const assignee = assigneeMatch ? assigneeMatch[1] : null;

// 마감일 추출
const dueDateMatch = body.match(/Due:\s*(\d{4}-\d{2}-\d{2})/);
const dueDate = dueDateMatch ? dueDateMatch[1] : null;

return [{
  json: {
    title,
    description: body
      .replace(/Priority:.*\n?/g, '')
      .replace(/Assignee:.*\n?/g, '')
      .replace(/Due:.*\n?/g, '')
      .trim(),
    priority: priority.toLowerCase(),
    assignee,
    dueDate,
    source: 'email',
    sourceEmail: email.from.email,
    createdAt: new Date().toISOString()
  }
}];
```

### 이메일 자동 응답

```
To: {{ $node["Email Trigger"].json.from.email }}
Subject: Re: {{ $node["Email Trigger"].json.subject }}

Body:
안녕하세요,

작업이 자동으로 생성되었습니다:

📋 제목: {{ $json.title }}
⏰ 우선순위: {{ $json.priority }}
👤 담당자: {{ $json.assignee || '미지정' }}
📅 마감일: {{ $json.dueDate || '미지정' }}

작업 링크: https://yourtool.com/tasks/{{ $json.taskId }}

감사합니다.
```

---

## 템플릿 4: 데이터 백업

### Schedule Trigger 설정

```
Cron: 0 2 * * *  (매일 오전 2시)
Timezone: Asia/Seoul
```

### Code 노드: CSV 생성

```javascript
const data = items.map(item => item.json);

// CSV 헤더
const headers = Object.keys(data[0]);
const csvHeader = headers.join(',');

// CSV 행
const csvRows = data.map(row =>
  headers.map(header => {
    const value = row[header];
    // 값에 쉼표나 따옴표가 있으면 이스케이프
    if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
      return `"${value.replace(/"/g, '""')}"`;
    }
    return value;
  }).join(',')
);

const csv = [csvHeader, ...csvRows].join('\n');

// 파일명 생성
const filename = `backup_${new Date().toISOString().split('T')[0]}.csv`;

return [{
  json: {
    filename,
    recordCount: data.length,
    timestamp: new Date().toISOString()
  },
  binary: {
    data: {
      data: Buffer.from(csv).toString('base64'),
      mimeType: 'text/csv',
      fileName: filename
    }
  }
}];
```

---

## 템플릿 5: Webhook → 처리 → 알림

### Webhook 보안

```json
{
  "path": "secure-webhook",
  "httpMethod": "POST",
  "authentication": "headerAuth",
  "options": {
    "rawBody": false
  }
}
```

### Code 노드: 검증

```javascript
const event = items[0].json;
const headers = items[0].headers;

// API Key 검증
const apiKey = headers['x-api-key'];
if (apiKey !== process.env.WEBHOOK_SECRET) {
  throw new Error('Unauthorized: Invalid API Key');
}

// 필수 필드 검증
const requiredFields = ['type', 'data', 'timestamp'];
const missingFields = requiredFields.filter(field => !event[field]);

if (missingFields.length > 0) {
  throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
}

// 타임스탬프 검증 (5분 이내)
const eventTime = new Date(event.timestamp).getTime();
const now = Date.now();
if (Math.abs(now - eventTime) > 5 * 60 * 1000) {
  throw new Error('Event timestamp is too old or in the future');
}

return [{
  json: {
    ...event,
    validated: true,
    processedAt: new Date().toISOString()
  }
}];
```

### Switch 노드: 이벤트 타입별 분기

```javascript
// Rule 1: Order
{{ $json.type }} === "order"

// Rule 2: Signup
{{ $json.type }} === "signup"

// Rule 3: Error
{{ $json.type }} === "error"

// Fallback (기타)
```

---

## 템플릿 6: RSS → 콘텐츠 큐레이션

### Code 노드: 키워드 필터링

```javascript
const items = $input.all();

// 관심 키워드
const keywords = [
  'react', 'nextjs', 'typescript', 'javascript',
  'performance', 'optimization', 'architecture'
];

// 제외 키워드 (스팸 필터)
const excludeKeywords = ['sponsored', 'advertisement', 'promo'];

const filtered = items.filter(item => {
  const content = (item.json.title + ' ' + item.json.content).toLowerCase();

  // 제외 키워드 체크
  const hasExcluded = excludeKeywords.some(keyword =>
    content.includes(keyword.toLowerCase())
  );
  if (hasExcluded) return false;

  // 관심 키워드 체크
  const matchedKeywords = keywords.filter(keyword =>
    content.includes(keyword.toLowerCase())
  );

  // 2개 이상 키워드 매치 시 선택
  return matchedKeywords.length >= 2;
});

return filtered.map(item => ({
  json: {
    ...item.json,
    matchedKeywords: keywords.filter(k =>
      (item.json.title + ' ' + item.json.content).toLowerCase().includes(k)
    ),
    score: matchedKeywords.length,
    curatedAt: new Date().toISOString()
  }
}));
```

---

## 템플릿 7: 에러 로깅 시스템

### Code 노드: 에러 분류 및 중복 체크

```javascript
const error = items[0].json;

// 심각도 자동 판단
const getSeverity = (error) => {
  if (error.type === 'FATAL' || error.message.includes('database')) {
    return 'critical';
  }
  if (error.type === 'ERROR' || error.statusCode >= 500) {
    return 'high';
  }
  if (error.type === 'WARNING' || error.statusCode >= 400) {
    return 'medium';
  }
  return 'low';
};

// 에러 시그니처 생성 (중복 판별용)
const signature = `${error.type}_${error.message}_${error.file}_${error.line}`;

// 최근 에러 캐시 확인
const cache = $workflow.staticData.errorCache || {};
const now = Date.now();

// 1시간 이내 동일 에러가 있는지 확인
const isDuplicate = cache[signature] &&
  (now - cache[signature].lastSeen) < 3600000;

// 캐시 업데이트
if (!cache[signature]) {
  cache[signature] = {
    count: 1,
    firstSeen: now,
    lastSeen: now
  };
} else {
  cache[signature].count++;
  cache[signature].lastSeen = now;
}

// 1시간 지난 에러는 캐시에서 제거
Object.keys(cache).forEach(key => {
  if (now - cache[key].lastSeen > 3600000) {
    delete cache[key];
  }
});

$workflow.staticData.errorCache = cache;

return [{
  json: {
    ...error,
    severity: getSeverity(error),
    signature,
    isDuplicate,
    duplicateCount: cache[signature].count,
    processedAt: new Date().toISOString()
  }
}];
```

---

## 사용 팁

### 1. 템플릿 import 방법

1. n8n UI → Workflows
2. Import from File
3. 위 JSON 복사 → 파일로 저장
4. Import

### 2. 커스터마이징

- API URL 변경
- Credentials 추가
- 알림 채널 변경
- 조건 로직 수정

### 3. 테스트

- Manual Trigger로 시작
- 각 노드 개별 실행
- 에러 확인
- Production 배포

### 4. 모니터링

- Execution 로그 확인
- 에러 알림 설정
- 성능 메트릭 추적

---

이 템플릿들을 기반으로 자신만의 워크플로우를 만들어보세요! 🚀
