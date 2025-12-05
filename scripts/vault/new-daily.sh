#!/bin/bash

# 오늘 날짜 일기 자동 생성 스크립트

DATE=$(date +%Y-%m-%d)
YEAR=$(date +%Y)
MONTH=$(date +%m)
DAY=$(date +%d)

DAILY_DIR="vault/journal/daily/$YEAR/$MONTH"
DAILY_FILE="$DAILY_DIR/$DATE.md"

# 디렉토리 생성 (없으면)
mkdir -p "$DAILY_DIR"

# 파일이 이미 있으면 열기만
if [ -f "$DAILY_FILE" ]; then
    echo "✅ 오늘 일기가 이미 있습니다: $DAILY_FILE"
    code "$DAILY_FILE"
    exit 0
fi

# 템플릿에서 복사
cp vault/templates/daily.md "$DAILY_FILE"

# 날짜 치환
sed -i '' "s/{{DATE}}/$DATE/g" "$DAILY_FILE"

echo "✅ 오늘 일기 생성: $DAILY_FILE"

# VS Code로 열기
code "$DAILY_FILE"
