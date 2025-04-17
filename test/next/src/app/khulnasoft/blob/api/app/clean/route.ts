import { NextResponse } from 'next/server';
import * as khulnasoftBlob from '@khulnasoft/blob';

export async function DELETE(request: Request): Promise<NextResponse> {
  const { searchParams } = new URL(request.url);
  const prefix = searchParams.get('prefix') ?? '';
  let hasMore = true;
  let cursor: string | undefined;
  while (hasMore) {
    const listResult = await khulnasoftBlob.list({
      cursor,
      prefix,
    });
    if (listResult.blobs.length > 0) {
      await khulnasoftBlob.del(listResult.blobs.map((blob) => blob.url));
    }
    hasMore = listResult.hasMore;
    cursor = listResult.cursor;
  }

  return NextResponse.json({ success: true });
}

export async function GET(): Promise<Response> {
  const { blobs } = await khulnasoftBlob.list({ limit: 1000 });
  for (const blob of blobs) {
    await khulnasoftBlob.del(blob.url);
  }
  return new Response(JSON.stringify({ success: true }), {
    headers: { 'content-type': 'application/json' },
  });
}
