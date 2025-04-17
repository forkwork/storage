import crypto from 'node:crypto';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { test, expect } from '@playwright/test';
import type { PutBlobResult } from '@khulnasoft/blob';

const prefix =
  process.env.GITHUB_PR_NUMBER || crypto.randomBytes(10).toString('hex');

test.describe('@khulnasoft/blob', () => {
  test.describe('api', () => {
    [
      'khulnasoft/blob/api/app/body/edge',
      'khulnasoft/blob/api/app/body/serverless',
      'api/khulnasoft/blob/pages/edge',
      'api/khulnasoft/blob/pages/serverless',
    ].forEach((path) => {
      test(path, async ({ request }) => {
        const data = (await request
          .post(`${path}?filename=${prefix}/test.txt`, {
            data: `Hello world ${path} ${prefix}`,
            headers: {
              cookie: `clientUpload=${process.env.BLOB_UPLOAD_SECRET ?? ''}`,
            },
          })
          .then((r) => r.json())) as PutBlobResult;
        expect(data.contentDisposition).toBe('inline; filename="test.txt"');
        expect(data.contentType).toBe('text/plain');
        expect(data.pathname).toBe(`${prefix}/test.txt`);
        const content = await request.get(data.url).then((r) => r.text());
        expect(content).toBe(`Hello world ${path} ${prefix}`);
      });
    });
  });

  test.describe('page', () => {
    test('serverless', async ({ page }) => {
      await page.goto(`khulnasoft/pages/blob?filename=${prefix}/test-page.txt`);
      const textContent = await page.locator('#blob-path').textContent();
      expect(textContent).toBe(`${prefix}/test-page.txt`);
      expect(await page.locator('#blob-content').textContent()).toBe(
        `Hello from ${prefix}/test-page.txt`,
      );
    });
  });

  test.describe('app', () => {
    test('edge', async ({ page }) => {
      await page.goto(
        `khulnasoft/blob/app/test/edge?filename=${prefix}/test-app-edge.txt`,
      );
      const textContent = await page.locator('#blob-path').textContent();
      expect(textContent).toBe(`${prefix}/test-app-edge.txt`);
      expect(await page.locator('#blob-content').textContent()).toBe(
        `Hello from ${prefix}/test-app-edge.txt`,
      );
    });
    test('serverless', async ({ page }) => {
      await page.goto(
        `khulnasoft/blob/app/test/serverless?filename=${prefix}/test-app-serverless.txt`,
      );
      const textContent = await page.locator('#blob-path').textContent();
      expect(textContent).toBe(`${prefix}/test-app-serverless.txt`);
      expect(await page.locator('#blob-content').textContent()).toBe(
        `Hello from ${prefix}/test-app-serverless.txt`,
      );
    });

    test.describe('client upload', () => {
      [
        '/khulnasoft/blob/api/app/handle-blob-upload/serverless',
        '/khulnasoft/blob/api/app/handle-blob-upload/edge',
        '/api/khulnasoft/blob/pages/handle-blob-upload-edge',
        '/api/khulnasoft/blob/pages/handle-blob-upload-serverless',
      ].forEach((callback) => {
        test(callback, async ({ browser }) => {
          const browserContext = await browser.newContext();
          await browserContext.addCookies([
            {
              name: 'clientUpload',
              value: process.env.BLOB_UPLOAD_SECRET ?? '',
              path: '/',
              domain: (
                process.env.PLAYWRIGHT_TEST_BASE_URL ?? 'localhost'
              ).replace('https://', ''),
            },
          ]);
          const page = await browserContext.newPage();
          await page.goto(
            `khulnasoft/blob/app/test/client?filename=${prefix}/test-app-client.txt&callback=${callback}`,
          );

          const textContent = await page.locator('#blob-path').textContent();
          expect(textContent).toBe(`${prefix}/test-app-client.txt`);
          expect(await page.locator('#blob-content').textContent()).toBe(
            `Hello from ${prefix}/test-app-client.txt`,
          );
        });
      });
    });

    test.describe('multipart upload', () => {
      test('multipart client upload', async ({ browser }) => {
        const callback =
          '/khulnasoft/blob/api/app/handle-blob-upload/serverless';
        const browserContext = await browser.newContext();
        await browserContext.addCookies([
          {
            name: 'clientUpload',
            value: process.env.BLOB_UPLOAD_SECRET ?? '',
            path: '/',
            domain: (
              process.env.PLAYWRIGHT_TEST_BASE_URL ?? 'localhost'
            ).replace('https://', ''),
          },
        ]);
        const page = await browserContext.newPage();
        await page.goto(
          `khulnasoft/blob/app/test/client?filename=${prefix}/test-app-client.txt&callback=${callback}&multipart=1`,
        );

        const textContent = await page.locator('#blob-path').textContent();
        expect(textContent).toBe(`${prefix}/test-app-client.txt`);
        expect(await page.locator('#blob-content').textContent()).toBe(
          `Hello from ${prefix}/test-app-client.txt`,
        );
      });

      test.describe('multipart server upload (app router)', () => {
        [
          'khulnasoft/blob/api/app/body/edge',
          'khulnasoft/blob/api/app/body/serverless',
          'api/khulnasoft/blob/pages/edge',
          'api/khulnasoft/blob/pages/serverless',
        ].forEach((path) => {
          test(path, async ({ request }) => {
            const data = (await request
              .post(`${path}?filename=${prefix}/test.txt&multipart=1`, {
                data: `Hello world ${path} ${prefix}`,
                headers: {
                  cookie: `clientUpload=${
                    process.env.BLOB_UPLOAD_SECRET ?? ''
                  }`,
                },
              })
              .then((r) => r.json())) as PutBlobResult;
            expect(data.contentDisposition).toBe('inline; filename="test.txt"');
            expect(data.contentType).toBe('text/plain');
            expect(data.pathname).toBe(`${prefix}/test.txt`);
            const content = await request.get(data.url).then((r) => r.text());
            expect(content).toBe(`Hello world ${path} ${prefix}`);
          });
        });
      });

      // https://github.com/khulnasoft/storage/pull/616
      test('multipart upload with buffer', async ({ request }) => {
        const path = 'khulnasoft/blob/api/app/body/serverless';
        const imgPath = join(process.cwd(), 'images');
        const imageFile = readFileSync(join(imgPath, `g.jpeg`));

        const data = (await request
          .post(`${path}?filename=${prefix}/g.jpeg&multipart=1&useBuffer=1`, {
            data: imageFile,
            headers: {
              cookie: `clientUpload=${process.env.BLOB_UPLOAD_SECRET ?? ''}`,
            },
          })
          .then((r) => r.json())) as PutBlobResult;
        const content = await request.head(data.url);
        expect(content.headers()['content-length']).toEqual('19939');
      });
    });
  });

  test.afterAll(async ({ request }) => {
    // cleanup all files
    await request.delete(`khulnasoft/blob/api/app/clean?prefix=${prefix}`);
  });
});
