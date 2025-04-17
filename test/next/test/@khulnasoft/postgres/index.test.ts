import { test, expect } from '@playwright/test';

const expectedRows = [
  {
    id: 1,
    name: 'Guillermo Rauch',
    email: 'rauchg@khulnasoft.com',
    image:
      'https://pbs.twimg.com/profile_images/1576257734810312704/ucxb4lHy_400x400.jpg',
    created_at: null,
  },
  {
    id: 2,
    name: 'Lee Robinson',
    email: 'lee@khulnasoft.com',
    image:
      'https://pbs.twimg.com/profile_images/1587647097670467584/adWRdqQ6_400x400.jpg',
    created_at: null,
  },
  {
    id: 3,
    name: 'Steven Tey',
    email: 'stey@khulnasoft.com',
    image:
      'https://pbs.twimg.com/profile_images/1506792347840888834/dS-r50Je_400x400.jpg',
    created_at: null,
  },
];

test.describe('@khulnasoft/postgres', () => {
  test.describe('app directory', () => {
    test.describe('client', () => {
      test.describe('api', () => {
        test('edge', async ({ request }) => {
          const res = await request.get(
            'api/khulnasoft/postgres/app/client/edge',
          );
          expect(await res.json()).toEqual(expectedRows);
        });
        test('node', async ({ request }) => {
          const res = await request.get(
            'api/khulnasoft/postgres/app/client/node',
          );
          expect(await res.json()).toEqual(expectedRows);
        });
      });
      test.describe('page', () => {
        test('edge', async ({ page }) => {
          await page.goto('khulnasoft/postgres/app/client/edge');
          await expect(page.locator('html#__next_error__')).toHaveCount(0);
          const textContent = await page.locator('pre').textContent();
          expect(textContent).not.toBeNull();

          expect(JSON.parse(textContent!)).toEqual(expectedRows);
        });
        test('node', async ({ page }) => {
          await page.goto('khulnasoft/postgres/app/client/node');
          await expect(page.locator('html#__next_error__')).toHaveCount(0);
          const textContent = await page.locator('pre').textContent();
          expect(textContent).not.toBeNull();

          expect(JSON.parse(textContent!)).toEqual(expectedRows);
        });
      });
    });
    test.describe('pool', () => {
      test.describe('api', () => {
        test('edge', async ({ request }) => {
          const res = await request.get(
            'api/khulnasoft/postgres/app/pool/edge',
          );
          expect(await res.json()).toEqual(expectedRows);
        });
        test('node', async ({ request }) => {
          const res = await request.get(
            'api/khulnasoft/postgres/app/pool/node',
          );
          expect(await res.json()).toEqual(expectedRows);
        });
      });
      test.describe('page', () => {
        test('edge', async ({ page }) => {
          await page.goto('khulnasoft/postgres/app/pool/edge');
          await expect(page.locator('html#__next_error__')).toHaveCount(0);
          const textContent = await page.locator('pre').textContent();
          expect(textContent).not.toBeNull();

          expect(JSON.parse(textContent!)).toEqual(expectedRows);
        });
        test('node', async ({ page }) => {
          await page.goto('khulnasoft/postgres/app/pool/node');
          await expect(page.locator('html#__next_error__')).toHaveCount(0);
          const textContent = await page.locator('pre').textContent();
          expect(textContent).not.toBeNull();

          expect(JSON.parse(textContent!)).toEqual(expectedRows);
        });
      });
    });
  });
  test.describe('pages directory', () => {
    test.describe('client', () => {
      test('edge', async ({ request }) => {
        const res = await request.get(
          'api/khulnasoft/postgres/pages/client/edge',
        );
        expect(await res.json()).toEqual(expectedRows);
      });
      test('node', async ({ request }) => {
        const res = await request.get(
          'api/khulnasoft/postgres/pages/client/node',
        );
        expect(await res.json()).toEqual(expectedRows);
      });
    });
    test.describe('pool', () => {
      test('edge', async ({ request }) => {
        const res = await request.get(
          'api/khulnasoft/postgres/pages/pool/edge',
        );
        expect(await res.json()).toEqual(expectedRows);
      });
      test('node', async ({ request }) => {
        const res = await request.get(
          'api/khulnasoft/postgres/pages/pool/node',
        );
        expect(await res.json()).toEqual(expectedRows);
      });
    });
  });
});
