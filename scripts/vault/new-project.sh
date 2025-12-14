#!/bin/bash

# 새 프로젝트 노트 생성 스크립트

if [ -z "$1" ]; then
    echo "❌ 사용법: ./scripts/vault/new-project.sh <프로젝트명>"
    echo "예: ./scripts/vault/new-project.sh my-saas"
    exit 1
fi

PROJECT_NAME=$1
DATE=$(date +%Y-%m-%d)

PROJECT_DIR="vault/projects/$PROJECT_NAME"
PROJECT_FILE="$PROJECT_DIR/README.md"

# 디렉토리 생성
mkdir -p "$PROJECT_DIR"

# 파일이 이미 있으면 열기만
if [ -f "$PROJECT_FILE" ]; then
    echo "✅ 프로젝트 노트가 이미 있습니다: $PROJECT_FILE"
    code "$PROJECT_FILE"
    exit 0
fi

# 템플릿에서 복사
cp vault/templates/project.md "$PROJECT_FILE"

# 치환
sed -i '' "s/{{PROJECT_NAME}}/$PROJECT_NAME/g" "$PROJECT_FILE"
sed -i '' "s/{{DATE}}/$DATE/g" "$PROJECT_FILE"

echo "✅ 프로젝트 노트 생성: $PROJECT_FILE"

# VS Code로 열기
code "$PROJECT_FILE"
