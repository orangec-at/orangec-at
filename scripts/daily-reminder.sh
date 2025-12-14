#!/bin/bash

# 매일 저녁 9시 알림 + 자동으로 일기 파일 열기

# 알림 표시
osascript -e 'display notification "3줄만 쓰면 됩니다" with title "오늘 뭐 했어?"'

# 1초 대기
sleep 1

# daily.txt 파일로 이동
cd /Users/jaylee222/resources/projects/orangec_at/orangec-at

# 오늘 날짜 추가 (파일 없으면 생성)
if [ ! -f daily.txt ]; then
    echo "# Daily Log" > daily.txt
fi

# 오늘 날짜와 템플릿 추가
echo "
---
$(date '+%Y-%m-%d %H:%M')

한 일:
-

배운 것:
-

느낀 점:
-
" >> daily.txt

# VS Code로 파일 열기
code daily.txt

# 파일 끝으로 이동 (커서)
