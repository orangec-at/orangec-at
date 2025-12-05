#!/bin/bash

# vault 전체 검색 스크립트

if [ -z "$1" ]; then
    echo "❌ 사용법: ./scripts/vault/search.sh <검색어>"
    exit 1
fi

QUERY=$1

echo "🔍 '$QUERY' 검색 중..."
echo ""

# vault 폴더 내 모든 .md 파일 검색
grep -r -i -n --color=always "$QUERY" vault/ --include="*.md"

echo ""
echo "✅ 검색 완료"
