import crypto from 'node:crypto';
import { test, expect } from '@playwright/test';

const prefix =
  process.env.GITHUB_PR_NUMBER || crypto.randomBytes(10).toString('hex');

test.describe('@khulnasoft/blob', () => {
  test.describe('page', () => {
    test('serverless', async ({ page }) => {
      console.log(`khulnasoft/pages/blob/image?prefix=${prefix}`);
      const response = await page.goto(
        `khulnasoft/pages/blob/image?prefix=${prefix}`,
      );
      await expect(page.locator('#test-screenshot')).toHaveScreenshot(
        'blob-image.png',
      );
      expect(response?.status()).toBe(200);
    });
  });
  test.afterAll(async ({ request }) => {
    // cleanup all files
    await request.delete(`khulnasoft/blob/api/app/clean?prefix=${prefix}`);
  });
});
