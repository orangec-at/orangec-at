#!/bin/bash

# 매일 저녁 9시 알림 설정 스크립트

SCRIPT_PATH="/Users/jaylee222/resources/projects/orangec_at/orangec-at/scripts/daily-reminder.sh"

# 실행 권한 부여
chmod +x "$SCRIPT_PATH"

# LaunchAgent plist 파일 생성
PLIST_PATH="$HOME/Library/LaunchAgents/com.orangec.daily-reminder.plist"

cat > "$PLIST_PATH" << EOF
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>Label</key>
    <string>com.orangec.daily-reminder</string>

    <key>ProgramArguments</key>
    <array>
        <string>$SCRIPT_PATH</string>
    </array>

    <key>StartCalendarInterval</key>
    <dict>
        <key>Hour</key>
        <integer>21</integer>
        <key>Minute</key>
        <integer>0</integer>
    </dict>

    <key>RunAtLoad</key>
    <false/>

    <key>StandardErrorPath</key>
    <string>/tmp/daily-reminder.err</string>

    <key>StandardOutPath</key>
    <string>/tmp/daily-reminder.out</string>
</dict>
</plist>
EOF

# LaunchAgent 로드
launchctl unload "$PLIST_PATH" 2>/dev/null
launchctl load "$PLIST_PATH"

echo "✅ 매일 저녁 9시 알림 설정 완료!"
echo ""
echo "테스트하려면:"
echo "  ./scripts/daily-reminder.sh"
echo ""
echo "비활성화하려면:"
echo "  launchctl unload ~/Library/LaunchAgents/com.orangec.daily-reminder.plist"
echo ""
echo "다시 활성화하려면:"
echo "  launchctl load ~/Library/LaunchAgents/com.orangec.daily-reminder.plist"
