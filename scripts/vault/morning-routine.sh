#!/bin/bash

# 아침 루틴 스크립트
# - 오늘 Todo 열기
# - 어제 Todo 보여주기 (참고용)

DATE=$(date +%Y-%m-%d)
YESTERDAY=$(date -v-1d +%Y-%m-%d)
YEAR=$(date +%Y)
MONTH=$(date +%m)
YESTERDAY_MONTH=$(date -v-1d +%m)

TODO_DIR="vault/journal/daily/$YEAR/$MONTH"
TODO_FILE="$TODO_DIR/$DATE-todo.md"
YESTERDAY_FILE="vault/journal/daily/$YEAR/$YESTERDAY_MONTH/$YESTERDAY-todo.md"

echo "🌅 Good morning! 오늘도 화이팅!"
echo ""

# 어제 Todo 확인
if [ -f "$YESTERDAY_FILE" ]; then
    echo "📋 어제 한 일:"
    grep "^- \[x\]" "$YESTERDAY_FILE" | sed 's/^- \[x\] /  ✅ /'
    echo ""

    echo "📌 어제 못한 일:"
    grep "^- \[ \]" "$YESTERDAY_FILE" | sed 's/^- \[ \] /  ⏭️  /'
    echo ""
fi

# 오늘 Todo 생성/열기
./scripts/vault/new-todo.sh

echo ""
echo "💡 Tip: 오늘 할 일은 최대 3개만!"
