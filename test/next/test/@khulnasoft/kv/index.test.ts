import { test, expect } from '@playwright/test';

test.describe('@khulnasoft/kv', () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/require-await -- [@khulnasoft/style-guide@5 migration]
  test('should work', async ({ page }) => {
    expect('pls add tests').toBe('pls add tests');
  });
});
