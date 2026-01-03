#!/bin/bash

# 진행 상황 한눈에 보기
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📊 Product Life 진행 상황"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# 오늘 모드
TODAY=$(date +%u)
if [ $TODAY -eq 1 ] || [ $TODAY -eq 2 ]; then
    echo "🗓️  오늘: 제품 모드 (Product Mode)"
elif [ $TODAY -eq 3 ]; then
    echo "🗓️  오늘: 마케팅 모드 (Marketing Mode)"
elif [ $TODAY -eq 4 ]; then
    echo "🗓️  오늘: 커리어 모드 (Career Mode)"
elif [ $TODAY -eq 5 ]; then
    echo "🗓️  오늘: 버퍼 모드 (Buffer Mode)"
else
    echo "🗓️  오늘: 삶 모드 (Life Mode)"
fi
echo ""

# WIP 상태
echo "📦 진행중인 작업 (WIP)"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
if [ -f "vault/projects/current-wip.md" ]; then
    grep "^\[" vault/projects/current-wip.md | head -3 | while read line; do
        echo "   $line"
    done
else
    echo "   (WIP 파일이 없습니다)"
fi
echo ""

# 주간 체크리스트 (핵심!)
echo "✅ 이번 주 체크리스트"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
if [ -f "vault/journal/weekly/2025-W01.md" ]; then
    grep "^- \[" vault/journal/weekly/2025-W01.md | while read line; do
        if [[ $line == *"[x]"* ]]; then
            echo "   ✅ ${line#*] }"
        else
            echo "   ⬜ ${line#*] }"
        fi
    done
else
    echo "   (주간 회고 파일이 없습니다)"
fi
echo ""

# 완료 개수 계산
COMPLETED=$(grep -c "\[x\]" vault/journal/weekly/2025-W01.md 2>/dev/null || echo 0)
TOTAL=4
echo "📈 진행률: $COMPLETED / $TOTAL"
if [ $COMPLETED -ge 3 ]; then
    echo "🎉 목표 달성 가능! (3개 이상)"
elif [ $COMPLETED -ge 1 ]; then
    echo "💪 계속 진행중..."
else
    echo "⚠️  아직 시작 전"
fi
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
