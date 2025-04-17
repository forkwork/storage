import { upload } from '@khulnasoft/blob/client';

addEventListener(
  'message',
  async (event: MessageEvent<{ fileName: string; fileContent: string }>) => {
    const { fileName, fileContent } = event.data;
    const blob = await upload(fileName, fileContent, {
      access: 'public',
      handleUploadUrl: `/khulnasoft/blob/api/app/handle-blob-upload/serverless`,
    });
    postMessage(blob.url);
  },
);
