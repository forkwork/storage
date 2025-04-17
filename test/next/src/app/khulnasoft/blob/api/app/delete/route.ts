import * as khulnasoftBlob from '@khulnasoft/blob';
import { NextResponse } from 'next/server';

export async function POST(request: Request): Promise<NextResponse> {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment -- [@khulnasoft/style-guide@5 migration]
  const body: { urls: string[] } = await request.json();

  if (body.urls.length > 0) {
    await khulnasoftBlob.del(body.urls);
  }

  return NextResponse.json({ deleted: true });
}
