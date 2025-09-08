import { test, expect } from '@playwright/test';

const baseURL = 'http://localhost:3033';

test('Desktop First Impression - Above the fold', async ({ page }) => {
  await page.setViewportSize({ width: 1920, height: 1080 });
  await page.goto(baseURL);
  
  // Wait for content to load
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(2000);
  
  // Take screenshot of above the fold content
  await page.screenshot({
    path: 'screenshots/desktop-hero.png',
    clip: { x: 0, y: 0, width: 1920, height: 1080 },
    fullPage: false
  });
  
  // Full page screenshot
  await page.screenshot({
    path: 'screenshots/desktop-full.png',
    fullPage: true
  });
});

test('Mobile First Impression - Above the fold', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 }); // iPhone X
  await page.goto(baseURL);
  
  // Wait for content to load
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(2000);
  
  // Take screenshot of above the fold content
  await page.screenshot({
    path: 'screenshots/mobile-hero.png',
    clip: { x: 0, y: 0, width: 375, height: 812 },
    fullPage: false
  });
  
  // Full page screenshot
  await page.screenshot({
    path: 'screenshots/mobile-full.png',
    fullPage: true
  });
});

test('Tablet View', async ({ page }) => {
  await page.setViewportSize({ width: 768, height: 1024 }); // iPad
  await page.goto(baseURL);
  
  // Wait for content to load
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(2000);
  
  await page.screenshot({
    path: 'screenshots/tablet-full.png',
    fullPage: true
  });
});

test('Performance and Loading Analysis', async ({ page }) => {
  // Measure performance
  const startTime = Date.now();
  await page.goto(baseURL);
  await page.waitForLoadState('domcontentloaded');
  const domLoadTime = Date.now() - startTime;
  
  await page.waitForLoadState('networkidle');
  const fullLoadTime = Date.now() - startTime;
  
  console.log(`DOM Content Loaded: ${domLoadTime}ms`);
  console.log(`Network Idle: ${fullLoadTime}ms`);
  
  // Check for critical elements
  const heroSection = await page.locator('[data-testid="hero"], .hero, h1').first();
  await expect(heroSection).toBeVisible();
  
  await page.screenshot({
    path: 'screenshots/performance-test.png',
    fullPage: false
  });
});

test('Navigation and Interaction', async ({ page }) => {
  await page.setViewportSize({ width: 1920, height: 1080 });
  await page.goto(baseURL);
  await page.waitForLoadState('networkidle');
  
  // Test navigation if exists
  const navLinks = await page.locator('nav a, header a').all();
  if (navLinks.length > 0) {
    // Click first nav link if available
    await navLinks[0].click();
    await page.waitForTimeout(1000);
    await page.screenshot({
      path: 'screenshots/navigation-test.png',
      fullPage: false
    });
  }
  
  // Test mobile menu if exists
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto(baseURL);
  await page.waitForLoadState('networkidle');
  
  const mobileMenuTrigger = await page.locator('[aria-label="menu"], .hamburger, .mobile-menu').first();
  if (await mobileMenuTrigger.isVisible()) {
    await mobileMenuTrigger.click();
    await page.waitForTimeout(500);
    await page.screenshot({
      path: 'screenshots/mobile-menu.png',
      fullPage: false
    });
  }
});

test('Accessibility Check', async ({ page }) => {
  await page.goto(baseURL);
  await page.waitForLoadState('networkidle');
  
  // Check for basic accessibility elements
  const hasH1 = await page.locator('h1').count() > 0;
  const hasAltText = await page.locator('img[alt]').count();
  const totalImages = await page.locator('img').count();
  const hasSkipLink = await page.locator('[href="#main"], [href="#content"]').count() > 0;
  
  console.log(`H1 present: ${hasH1}`);
  console.log(`Images with alt text: ${hasAltText}/${totalImages}`);
  console.log(`Skip link present: ${hasSkipLink}`);
  
  // Test keyboard navigation
  await page.keyboard.press('Tab');
  await page.waitForTimeout(500);
  await page.screenshot({
    path: 'screenshots/keyboard-focus.png',
    fullPage: false
  });
});