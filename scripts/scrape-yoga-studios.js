#!/usr/bin/env node
/**
 * 요가원 정보 수집 스크립트
 * 네이버 플레이스에서 지역별 요가원 정보를 크롤링
 * 
 * 사용법:
 *   node scripts/scrape-yoga-studios.js [지역명...]
 * 
 * 예시:
 *   node scripts/scrape-yoga-studios.js 잠실 송파 목동
 *   node scripts/scrape-yoga-studios.js 판교 분당
 */

const fs = require('fs');
const path = require('path');

// 설정
const DB_PATH = path.join(__dirname, '../vault/business/yoga-studios.json');
const DELAY_MS = 2000; // 요청 간 딜레이 (네이버 차단 방지)

// 색상 출력
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  cyan: '\x1b[36m',
};

function log(msg, color = 'reset') {
  console.log(`${colors[color]}${msg}${colors.reset}`);
}

// DB 로드
function loadDB() {
  try {
    const data = fs.readFileSync(DB_PATH, 'utf-8');
    return JSON.parse(data);
  } catch (e) {
    return {
      meta: {
        description: '요가원 DB - 네이버 플레이스 기반',
        lastUpdated: new Date().toISOString().split('T')[0],
        source: 'naver-place',
        totalCount: 0,
        withContact: 0,
      },
      studios: [],
    };
  }
}

// DB 저장
function saveDB(db) {
  db.meta.lastUpdated = new Date().toISOString().split('T')[0];
  db.meta.totalCount = db.studios.length;
  db.meta.withContact = db.studios.filter(s => s.phone || s.instagram).length;
  fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2), 'utf-8');
}

// ID 생성
function generateId(area, index) {
  const areaMap = {
    '성수': 'seongsu',
    '강남': 'gangnam',
    '홍대': 'hongdae',
    '신촌': 'sinchon',
    '강동': 'gangdong',
    '용산': 'yongsan',
    '잠실': 'jamsil',
    '송파': 'songpa',
    '목동': 'mokdong',
    '판교': 'pangyo',
    '분당': 'bundang',
  };
  const prefix = areaMap[area] || area.toLowerCase().replace(/\s/g, '');
  return `${prefix}-${String(index).padStart(3, '0')}`;
}

// 메인 함수 (Playwright 사용)
async function scrapeArea(area) {
  let playwright;
  try {
    playwright = require('playwright');
  } catch (e) {
    log('Playwright가 설치되어 있지 않습니다.', 'red');
    log('설치: pnpm add -D playwright', 'yellow');
    log('브라우저: npx playwright install chromium', 'yellow');
    process.exit(1);
  }

  const browser = await playwright.chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  const studios = [];
  const searchUrl = `https://map.naver.com/p/search/${encodeURIComponent(area + ' 요가')}`;
  
  log(`\n[${area}] 검색 중...`, 'cyan');
  
  try {
    await page.goto(searchUrl, { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(3000);
    
    // 검색 결과 iframe으로 전환
    const frame = page.frameLocator('#searchIframe');
    
    // 검색 결과 목록 가져오기
    const items = await frame.locator('.VLTHu').all();
    
    log(`  ${items.length}개 결과 발견`, 'green');
    
    for (let i = 0; i < Math.min(items.length, 15); i++) {
      try {
        const item = items[i];
        const name = await item.locator('.place_bluelink').first().textContent();
        const category = await item.locator('.KCMnt').first().textContent().catch(() => '요가원');
        const address = await item.locator('.zZfO1').textContent().catch(() => '');
        
        // 상세 페이지 클릭해서 연락처 가져오기
        await item.locator('.place_bluelink').first().click();
        await page.waitForTimeout(2000);
        
        const detailFrame = page.frameLocator('#entryIframe');
        const phone = await detailFrame.locator('.xlx7Q').first().textContent().catch(() => '');
        const instagram = await detailFrame.locator('a[href*="instagram.com"]').getAttribute('href').catch(() => '');
        const website = await detailFrame.locator('.jO09N a').first().getAttribute('href').catch(() => '');
        
        studios.push({
          name: name?.trim() || '',
          area,
          address: address?.trim() || '',
          category: category?.trim() || '요가원',
          phone: phone?.trim() || '',
          instagram: instagram ? instagram.split('instagram.com/')[1]?.split('?')[0] || '' : '',
          website: website || '',
        });
        
        log(`  ✓ ${name}`, 'green');
        
        // 목록으로 돌아가기
        await page.goBack();
        await page.waitForTimeout(1500);
        
      } catch (e) {
        log(`  ✗ 항목 ${i + 1} 스킵: ${e.message}`, 'yellow');
      }
    }
    
  } catch (e) {
    log(`  ✗ 검색 실패: ${e.message}`, 'red');
  }
  
  await browser.close();
  return studios;
}

// 간단한 버전 (fetch만 사용, 제한적)
async function scrapeAreaSimple(area) {
  log(`\n[${area}] 검색 중... (Simple 모드)`, 'cyan');
  log('  → Playwright 없이는 상세 정보 수집 불가', 'yellow');
  log('  → 기본 정보만 수집됩니다', 'yellow');
  
  // 네이버 지도 API는 인증 필요하므로 여기서는 placeholder
  return [];
}

// 메인
async function main() {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    log('사용법: node scripts/scrape-yoga-studios.js [지역명...]', 'yellow');
    log('예시: node scripts/scrape-yoga-studios.js 잠실 송파 목동', 'yellow');
    log('', 'reset');
    log('현재 DB 현황:', 'cyan');
    const db = loadDB();
    log(`  총 요가원: ${db.meta.totalCount}개`, 'reset');
    log(`  연락처 있음: ${db.meta.withContact}개`, 'reset');
    
    const byArea = {};
    db.studios.forEach(s => {
      byArea[s.area] = (byArea[s.area] || 0) + 1;
    });
    Object.entries(byArea).forEach(([area, count]) => {
      log(`  - ${area}: ${count}개`, 'reset');
    });
    return;
  }
  
  log('='.repeat(50), 'cyan');
  log('요가원 정보 수집 시작', 'cyan');
  log('='.repeat(50), 'cyan');
  
  const db = loadDB();
  let hasPlaywright = false;
  
  try {
    require('playwright');
    hasPlaywright = true;
  } catch (e) {
    log('\nPlaywright 미설치 - 설치 방법:', 'yellow');
    log('  pnpm add -D playwright', 'reset');
    log('  npx playwright install chromium', 'reset');
    log('\n간단 모드로 진행합니다...', 'yellow');
  }
  
  for (const area of args) {
    const studios = hasPlaywright 
      ? await scrapeArea(area)
      : await scrapeAreaSimple(area);
    
    // 기존 데이터와 병합 (중복 제거)
    const existingNames = new Set(db.studios.map(s => s.name));
    let newCount = 0;
    
    studios.forEach((studio, i) => {
      if (!existingNames.has(studio.name)) {
        const existingInArea = db.studios.filter(s => s.area === area).length;
        db.studios.push({
          id: generateId(area, existingInArea + newCount + 1),
          ...studio,
          status: 'prospect',
        });
        newCount++;
      }
    });
    
    log(`  → ${newCount}개 신규 추가`, 'green');
    
    // 요청 간 딜레이
    if (args.indexOf(area) < args.length - 1) {
      await new Promise(r => setTimeout(r, DELAY_MS));
    }
  }
  
  saveDB(db);
  
  log('\n' + '='.repeat(50), 'cyan');
  log('완료!', 'green');
  log(`  총 요가원: ${db.meta.totalCount}개`, 'reset');
  log(`  연락처 있음: ${db.meta.withContact}개`, 'reset');
  log(`  저장: ${DB_PATH}`, 'reset');
  log('='.repeat(50), 'cyan');
}

main().catch(console.error);
