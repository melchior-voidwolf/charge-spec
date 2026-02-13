import { test, expect } from '@playwright/test';

test.describe('充电头规格网站 - 基础功能测试', () => {
  test('首页加载成功', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('h1')).toContainText('充电头规格');
  });

  test('导航头部可见', async ({ page }) => {
    await page.goto('/');
    const header = page.locator('header');
    await expect(header).toBeVisible();
    await expect(page.locator('text=充电头规格')).toBeVisible();
  });

  test('页脚显示版权信息', async ({ page }) => {
    await page.goto('/');
    const footer = page.locator('footer');
    await expect(footer).toBeVisible();
    await expect(footer.locator('text=©')).toBeVisible();
  });

  test('响应式设计 - 移动端布局', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    const h1 = page.locator('h1');
    await expect(h1).toBeVisible();
  });
});

test.describe('充电器列表页功能测试', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/chargers');
  });

  test('充电器列表显示所有充电器', async ({ page }) => {
    await page.waitForSelector('[class*="rounded-lg"]', { timeout: 5000 });
    const cards = page.locator('[class*="rounded-lg"]');
    const count = await cards.count();
    expect(count).toBeGreaterThan(0);
    console.log(`找到 ${count} 个充电器`);
  });

  test('搜索功能 - 按品牌搜索', async ({ page }) => {
    const searchInput = page.locator('input[placeholder*="搜索"]');
    await searchInput.fill('Apple');
    await page.waitForTimeout(500);

    const results = page.locator('[class*="rounded-lg"]');
    const firstCard = results.first();
    await expect(firstCard).toContainText('Apple');
  });

  test('搜索功能 - 按功率搜索', async ({ page }) => {
    const searchInput = page.locator('input[placeholder*="搜索"]');
    await searchInput.fill('65W');
    await page.waitForTimeout(500);

    const results = page.locator('[class*="rounded-lg"]');
    const firstCard = results.first();
    await expect(firstCard).toContainText('65');
  });

  test('筛选器面板可以展开', async ({ page }) => {
    const filterButton = page.locator('button:has-text("筛选器")');
    await filterButton.click();

    const filterPanel = page.locator('text=品牌').first();
    await expect(filterPanel).toBeVisible();
  });
});

test.describe('API 端点测试', () => {
  test('GET /api/chargers 返回充电器列表', async ({ request }) => {
    const response = await request.get('http://localhost:3000/api/chargers');
    expect(response.status()).toBe(200);

    const data = await response.json();
    expect(data).toBeDefined();
  });

  test('GET /api/chargers/[id] 返回单个充电器', async ({ request }) => {
    const response = await request.get('http://localhost:3000/api/chargers/apple-a2653-30w');
    expect(response.status()).toBe(200);

    const data = await response.json();
    expect(data.brand).toBe('Apple');
    expect(data.power).toBeDefined();
  });
});
