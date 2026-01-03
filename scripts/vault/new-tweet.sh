#!/bin/bash

# 새 트윗 생성 스크립트

# 프로젝트 루트 찾기 (git root)
PROJECT_ROOT=$(git rev-parse --show-toplevel 2>/dev/null)

# git root를 찾지 못하면 현재 디렉토리 사용
if [ -z "$PROJECT_ROOT" ]; then
    PROJECT_ROOT=$(pwd)
fi

# 프로젝트 루트로 이동
cd "$PROJECT_ROOT" || exit 1

# 제목 입력받기
echo "📝 트윗 제목을 입력하세요 (영문/한글, 공백 가능):"
read -r TITLE

# 제목이 비어있으면 종료
if [ -z "$TITLE" ]; then
    echo "❌ 제목을 입력해주세요."
    exit 1
fi

# 제목을 slug로 변환 (공백->하이픈, 특수문자 제거, 소문자)
SLUG=$(echo "$TITLE" | sed 's/[^a-zA-Z0-9가-힣 ]//g' | sed 's/ /-/g' | sed 's/--*/-/g' | tr '[:upper:]' '[:lower:]')

# 현재 날짜와 시간
DATETIME=$(date +"%Y-%m-%dT%H:%M:%S%z")
DATETIME_ISO=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
YEAR=$(date +%Y)
MONTH=$(date +%m)
DATE=$(date +%Y-%m-%d)

# 트윗 ID 생성 (타임스탬프 기반)
TWEET_ID="tweet_$(date +%Y%m%d%H%M%S)"

# 디렉토리 및 파일 경로
TWEET_DIR="vault/tweets/$YEAR/$MONTH"
TWEET_FILE="$TWEET_DIR/$DATE-$SLUG.md"

# 디렉토리 생성 (없으면)
mkdir -p "$TWEET_DIR"

# 템플릿에서 복사
cp vault/templates/tweet.md "$TWEET_FILE"

# 변수 치환
if [[ "$OSTYPE" == "darwin"* ]]; then
    # macOS
    sed -i '' "s|{{DATETIME}}|$DATETIME_ISO|g" "$TWEET_FILE"
    sed -i '' "s|{{TWEET_ID}}|$TWEET_ID|g" "$TWEET_FILE"
    sed -i '' "s|{{TITLE}}|$TITLE|g" "$TWEET_FILE"
else
    # Linux
    sed -i "s|{{DATETIME}}|$DATETIME_ISO|g" "$TWEET_FILE"
    sed -i "s|{{TWEET_ID}}|$TWEET_ID|g" "$TWEET_FILE"
    sed -i "s|{{TITLE}}|$TITLE|g" "$TWEET_FILE"
fi

echo "✅ 새 트윗 생성: $TWEET_FILE"
echo "📝 제목: $TITLE"
echo "📝 트윗 ID: $TWEET_ID"

# VS Code로 열기
code "$TWEET_FILE"
