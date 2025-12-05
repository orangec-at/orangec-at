#!/bin/bash

# 오늘 Todo 생성 스크립트

DATE=$(date +%Y-%m-%d)
YEAR=$(date +%Y)
MONTH=$(date +%m)

TODO_DIR="vault/journal/daily/$YEAR/$MONTH"
TODO_FILE="$TODO_DIR/$DATE-todo.md"

# 디렉토리 생성
mkdir -p "$TODO_DIR"

# 파일이 이미 있으면 열기만
if [ -f "$TODO_FILE" ]; then
    echo "✅ 오늘 Todo가 이미 있습니다: $TODO_FILE"
    code "$TODO_FILE"
    exit 0
fi

# 템플릿에서 복사
cp vault/templates/todo.md "$TODO_FILE"

# 날짜 치환
sed -i '' "s/{{DATE}}/$DATE/g" "$TODO_FILE"

echo "✅ 오늘 Todo 생성: $TODO_FILE"

# VS Code로 열기
code "$TODO_FILE"
