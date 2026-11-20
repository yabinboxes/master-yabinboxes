import { test, expect } from '@playwright/test';

const accessToken = process.env.GITHUB_TOKEN ?? '';
const repositories = [
  'snow-monkeys-org/snow-publish-quarkus',
  'snow-monkeys-org/snow-websocket-bun',
  'snow-monkeys-org/snow-cron-bun',
  'snow-monkeys-org/snow-angular-ui',
];

test('Import repositories and verify dashboard filters', async ({ page }) => {
  // Test Case 1: Import snow repositories
  await page.goto('http://localhost:4200/dashboard-test/import');
  await expect(page).toHaveURL(/dashboard-test\/import/);

  const tokenInput = page.locator('input[formcontrolname="token"]');
  await expect(tokenInput).toBeVisible({ timeout: 15000 });
  await tokenInput.fill(accessToken);

  const fetchButton = page.locator('button:has-text("Fetch repositories")');
  await expect(fetchButton).toBeVisible({ timeout: 15000 });
  await fetchButton.click();

  await page.waitForTimeout(5000);

  await expect(page.locator(`text=${repositories[0]}`)).toBeVisible({ timeout: 20000 });

  for (const repository of repositories) {
    const repoItem = page.locator(`li:has-text("${repository}")`);
    await expect(repoItem).toBeVisible({ timeout: 20000 });
    const checkbox = repoItem.locator('input[type="checkbox"][aria-label="Select repository"]').first();
    await expect(checkbox).toBeVisible({ timeout: 10000 });
    await checkbox.check();
  }

  const importButton = page.locator('button:has-text("Import selected repositories")');
  await expect(importButton).toBeVisible({ timeout: 15000 });
  await importButton.click();

  await page.waitForTimeout(5000);

  // Test Case 2: Verify dashboard filters
  await page.goto('http://localhost:4200/dashboard-test');
  await expect(page).toHaveURL(/dashboard-test/);

  const servicesFilter = page.locator('label:has-text("Services")');
  await expect(servicesFilter).toBeVisible({ timeout: 15000 });
  await servicesFilter.click();

  await page.waitForTimeout(2000);

  const cards = page.locator('snow-card');
  await expect(cards).toHaveCount(0, { timeout: 10000 });

  await page.waitForTimeout(3000);

  await servicesFilter.click();
  await page.waitForTimeout(5000);
});
