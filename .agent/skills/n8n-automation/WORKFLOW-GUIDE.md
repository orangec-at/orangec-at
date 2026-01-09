# Content Marketing Pipeline - n8n 워크플로우 가이드

콘텐츠 마케팅 자동화 파이프라인을 n8n에서 시각화하고 미세조정할 수 있는 워크플로우입니다.

---

## 시작하기

### 1. 워크플로우 Import

1. n8n 대시보드에서 **Workflows** → **Import from File** 클릭
2. `content-pipeline-workflow.json` 파일 선택
3. Import 완료 후 워크플로우가 시각적으로 표시됨

### 2. 필수 설정

**환경 변수 (Settings → Variables):**
```
OPENAI_API_KEY=sk-xxx...
SLACK_WEBHOOK_URL=https://hooks.slack.com/...
```

**Credentials 설정:**
- OpenAI: API 키 입력
- Slack: OAuth 또는 Webhook 설정

---

## 워크플로우 구조

```
Webhook → 입력 유형 판별 → 콘텐츠 추출 → Brief 생성
    ↓
[대기] 사용자 Brief 승인
    ↓
플랫폼별 병렬 생성 (Newsletter, Blog, LinkedIn, Thread, Shorts)
    ↓
영상 생성 (YouTube 있으면 클립 / 없으면 텍스트 기반)
    ↓
[대기] 최종 검수
    ↓
Slack 알림
```

---

## 주요 노드 설명

### Webhook Trigger
- **URL**: `https://your-n8n-domain.com/webhook/content-pipeline`
- **Method**: POST
- **Body 예시**:
```json
{
  "url": "https://www.youtube.com/watch?v=xxx"
}
```

### Wait for Approval 노드
두 곳에서 사용자 개입 가능:
1. **Brief 승인**: `/webhook/content-pipeline/approve-brief`
2. **최종 검수**: `/webhook/content-pipeline/final-review`

이 URL로 POST 요청을 보내면 다음 단계로 진행됩니다.

### Switch by Type
입력에 따라 분기:
- **YouTube URL** → 영상 다운로드 + 자막 추출
- **웹사이트 URL** → HTTP Request로 콘텐츠 추출
- **PDF 파일** → 파일 읽기

---

## 커스터마이징

### AI 프롬프트 수정
각 Writer 노드에서 프롬프트 수정 가능:
- `Write: Newsletter` → 뉴스레터 스타일/길이 조정
- `Write: Blog` → SEO 키워드, 헤딩 구조 변경
- `Write: Shorts Scripts` → 쇼츠 개수/길이 조정

### 플랫폼 추가/제거
1. `Split: Platform Writers` 노드에서 출력 분기 수정
2. 새로운 Writer 노드 추가 (예: `Write: Threads`)
3. `Merge All Content`에 연결

### 알림 채널 변경
`Notify: Complete` 노드에서:
- Slack → Discord, Email, Telegram 등으로 변경 가능
- 메시지 내용 수정

---

## 테스트 방법

### 1. 수동 테스트
```bash
curl -X POST https://your-n8n-domain.com/webhook/content-pipeline \
  -H "Content-Type: application/json" \
  -d '{"url": "https://example.com/article"}'
```

### 2. 단계별 테스트
- n8n UI에서 각 노드 우클릭 → **Execute this node only**
- 중간 결과 확인 후 다음 노드 테스트

---

## 트러블슈팅

### API 호출 실패
- OpenAI API 키 확인
- Rate Limit 대기 시간 추가 (Wait 노드)

### 영상 생성 실패
- ffmpeg 설치 확인: `which ffmpeg`
- yt-dlp 설치 확인: `which yt-dlp`

### Webhook 응답 없음
- n8n 서버 상태 확인
- Webhook URL 정확히 복사했는지 확인
