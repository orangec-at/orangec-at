#!/bin/bash

# 이번 주 회고 자동 생성 스크립트

YEAR=$(date +%Y)
WEEK=$(date +%U)  # 주차 번호
WEEKLY_FILE="vault/journal/weekly/$YEAR-W$WEEK.md"

# 이번 주 시작일/종료일 계산
START_DATE=$(date -v-sunday +%Y-%m-%d)
END_DATE=$(date -v+saturday +%Y-%m-%d)

# 파일이 이미 있으면 열기만
if [ -f "$WEEKLY_FILE" ]; then
    echo "✅ 이번 주 회고가 이미 있습니다: $WEEKLY_FILE"
    code "$WEEKLY_FILE"
    exit 0
fi

# 템플릿에서 복사
cp vault/templates/weekly.md "$WEEKLY_FILE"

# 치환
sed -i '' "s/{{WEEK}}/$WEEK/g" "$WEEKLY_FILE"
sed -i '' "s/{{YEAR}}/$YEAR/g" "$WEEKLY_FILE"
sed -i '' "s/{{START_DATE}}/$START_DATE/g" "$WEEKLY_FILE"
sed -i '' "s/{{END_DATE}}/$END_DATE/g" "$WEEKLY_FILE"

echo "✅ 이번 주 회고 생성: $WEEKLY_FILE"

# VS Code로 열기
code "$WEEKLY_FILE"
