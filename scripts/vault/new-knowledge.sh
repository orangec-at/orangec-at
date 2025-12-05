#!/bin/bash

# 새 지식 노트 생성 스크립트

if [ -z "$1" ] || [ -z "$2" ]; then
    echo "❌ 사용법: ./scripts/vault/new-knowledge.sh <카테고리> <제목>"
    echo "예: ./scripts/vault/new-knowledge.sh tech/react 'React 19 새 기능'"
    exit 1
fi

CATEGORY=$1
TITLE=$2
DATE=$(date +%Y-%m-%d)

# 파일명 생성 (공백 -> 하이픈)
FILENAME=$(echo "$TITLE" | tr '[:upper:]' '[:lower:]' | tr ' ' '-')
KNOWLEDGE_DIR="vault/knowledge/$CATEGORY"
KNOWLEDGE_FILE="$KNOWLEDGE_DIR/$FILENAME.md"

# 디렉토리 생성
mkdir -p "$KNOWLEDGE_DIR"

# 파일이 이미 있으면 열기만
if [ -f "$KNOWLEDGE_FILE" ]; then
    echo "✅ 지식 노트가 이미 있습니다: $KNOWLEDGE_FILE"
    code "$KNOWLEDGE_FILE"
    exit 0
fi

# 템플릿에서 복사
cp vault/templates/knowledge.md "$KNOWLEDGE_FILE"

# 치환
sed -i '' "s/{{TITLE}}/$TITLE/g" "$KNOWLEDGE_FILE"
sed -i '' "s/{{DATE}}/$DATE/g" "$KNOWLEDGE_FILE"
sed -i '' "s/{{CATEGORY}}/$CATEGORY/g" "$KNOWLEDGE_FILE"

echo "✅ 지식 노트 생성: $KNOWLEDGE_FILE"

# VS Code로 열기
code "$KNOWLEDGE_FILE"
