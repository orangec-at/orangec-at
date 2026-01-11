#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const statePath = path.join(__dirname, '../vault/bullet/state.json');
const state = JSON.parse(fs.readFileSync(statePath, 'utf-8'));

const today = new Date();
const todayDay = today.getDate();
const todayMonth = today.getMonth() + 1;

const arg = process.argv[2] || state.config.defaultView;
const view = (arg === 'm' || arg === 'monthly') ? 'monthly' : 'weekly';

const LINE = '━'.repeat(76);
const DLINE = '═'.repeat(76);

function renderWeekly() {
  const w = state.weekly;
  const j = state.jobTracker;
  const n = state.northStar;
  
  const lines = [];
  
  lines.push('');
  lines.push(DLINE);
  lines.push(`  WEEK ${String(w.weekNumber).padStart(2, '0')} │ ${state.monthly.month} ${state.config.year} │ ${w.range}`);
  lines.push(DLINE);
  lines.push('');
  
  lines.push('  📍 이번주 포인트');
  lines.push(`     ${w.point}`);
  lines.push('');
  
  lines.push('  🎯 우선순위');
  w.priorities.forEach((p, i) => {
    lines.push(`     ${i + 1}. ${p}`);
  });
  lines.push('');
  
  lines.push(LINE);
  lines.push('');
  
  lines.push('  📅 이번주');
  const days = Object.entries(w.days);
  days.forEach(([d, info]) => {
    const isToday = parseInt(d) === todayDay && todayMonth === state.config.currentMonth;
    const marker = isToday ? '→' : ' ';
    const dayLabel = `${info.dow} ${d}`;
    const todayTag = isToday ? ' [TODAY]' : '';
    const event = info.event ? ` - ${info.event}` : '';
    lines.push(`   ${marker} ${dayLabel}${todayTag}${event}`);
  });
  lines.push('');
  
  lines.push(LINE);
  lines.push('');
  
  lines.push('  ⏳ WAITING FOR');
  w.waitingFor.forEach(item => {
    lines.push(`     • ${item}`);
  });
  lines.push('');
  
  lines.push('  💼 JOB TRACKER');
  lines.push(`     Active: ${j.active} │ Rejected: ${j.rejected} │ Interview: ${j.interview}`);
  lines.push(`     Next: ${j.next.company} ${j.next.action} ${j.next.date}${parseInt(j.next.date.split('/')[1]) === todayDay + 1 ? ' (내일!)' : ''}`);
  lines.push('');
  
  lines.push(LINE);
  lines.push('');
  
  lines.push('  📝 한줄일기');
  const recentDays = days.filter(([_, info]) => info.note).slice(-3);
  recentDays.forEach(([d, info]) => {
    const isToday = parseInt(d) === todayDay && todayMonth === state.config.currentMonth;
    const suffix = isToday ? ' ← 오늘' : '';
    lines.push(`     ${state.config.currentMonth}/${d}: ${info.note}${suffix}`);
  });
  lines.push('');
  
  lines.push(LINE);
  lines.push('');
  
  lines.push('  ⭐ 북극성');
  lines.push(`     ${n.goal}`);
  lines.push(`     확보: ${n.secured} │ 필요: ${n.needed} │ 갭: ${n.gap}`);
  lines.push('');
  
  lines.push(DLINE);
  lines.push('');
  lines.push('  💬 "오늘 가장 중요한 한 가지는?"');
  lines.push('');
  
  return lines.join('\n');
}

function renderMonthly() {
  const m = state.monthly;
  const n = state.northStar;
  
  const lines = [];
  
  lines.push('');
  lines.push(DLINE);
  lines.push(`  ${m.month} ${state.config.year}                                        북극성: ${n.gap} 갭`);
  lines.push(DLINE);
  lines.push('');
  
  lines.push('  🎯 BUCKET (이번달 목표)');
  m.bucket.forEach(b => {
    lines.push(`     [${b.done ? '✓' : ' '}] ${b.task}`);
  });
  lines.push('');
  
  lines.push('  📂 LONGTERM');
  m.longterm.forEach(l => {
    lines.push(`     [${l.type}] ${l.name} - ${l.status}`);
  });
  lines.push('');
  
  lines.push(LINE);
  lines.push('');
  
  lines.push('  📅 6-WEEK CALENDAR');
  lines.push('');
  lines.push('         SUN   MON   TUE   WED   THU   FRI   SAT');
  
  const firstDayIndex = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].indexOf(m.calendar.firstDayOfMonth);
  let dayNum = 1;
  
  for (let week = 1; week <= 5; week++) {
    let weekRow = `  W${week}   `;
    for (let dow = 0; dow < 7; dow++) {
      if ((week === 1 && dow < firstDayIndex) || dayNum > m.calendar.totalDays) {
        weekRow += '      ';
      } else {
        const isToday = dayNum === todayDay && todayMonth === state.config.currentMonth;
        const dayStr = isToday ? `[${String(dayNum).padStart(2)}]` : `  ${String(dayNum).padStart(2)}`;
        weekRow += dayStr + '  ';
        dayNum++;
      }
    }
    if (week === Math.ceil((todayDay + firstDayIndex) / 7)) {
      weekRow += '← TODAY';
    }
    lines.push(weekRow);
  }
  lines.push('');
  
  lines.push(LINE);
  lines.push('');
  
  lines.push('  📊 ROUTINE (이번주)');
  const tracks = state.config.tracks;
  tracks.forEach(track => {
    const completed = m.tracker[track.name] || [];
    const boxes = Array.from({length: 7}, (_, j) => completed.length > j ? '■' : '·');
    lines.push(`     ${track.name}: [${boxes.join('][')}] ${completed.length}/7`);
  });
  lines.push('');
  
  lines.push('  📝 NOTES');
  m.notes.slice(-4).forEach(note => {
    lines.push(`     ${note.date}: ${note.text}`);
  });
  lines.push('');
  
  lines.push(DLINE);
  lines.push('');
  lines.push('  💬 "오늘 가장 중요한 한 가지는?"');
  lines.push('');
  
  return lines.join('\n');
}

if (view === 'monthly') {
  console.log(renderMonthly());
} else {
  console.log(renderWeekly());
}
